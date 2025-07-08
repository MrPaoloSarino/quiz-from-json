// Unified Storage Manager
// Intelligently routes between Google Drive and Local Storage
// Provides seamless experience regardless of configuration

import { GoogleDriveUserStorage } from './googleDriveStorage';
import LocalStorageBackup from './localStorageBackup';
import { UserProfile, UserData, UserQuiz, QuizSession } from '@/types/user';
import { QuizQuestion } from '@/types/quiz';
import { importLegacyQuiz } from './legacyQuizImport';
import debugLogger from './debugLogger';

export enum StorageMode {
  GOOGLE_DRIVE = 'google_drive',
  LOCAL_STORAGE = 'local_storage',
  HYBRID = 'hybrid'
}

class StorageManager {
  private static instance: StorageManager;
  private currentMode: StorageMode = StorageMode.LOCAL_STORAGE;
  private isGoogleConfigured = false;

  constructor() {
    this.detectStorageMode();
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private detectStorageMode(): void {
    // Check if Google APIs are configured
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    this.isGoogleConfigured = !!(clientId && apiKey);
    
    if (this.isGoogleConfigured) {
      this.currentMode = StorageMode.GOOGLE_DRIVE;
      console.log('🌍 Storage Mode: Google Drive (Cloud)');
    } else {
      this.currentMode = StorageMode.LOCAL_STORAGE;
      LocalStorageBackup.initialize();
      console.log('💾 Storage Mode: Local Storage (Offline)');
    }
  }

  getStorageMode(): StorageMode {
    return this.currentMode;
  }

  isCloudMode(): boolean {
    return this.currentMode === StorageMode.GOOGLE_DRIVE;
  }

  isOfflineMode(): boolean {
    return this.currentMode === StorageMode.LOCAL_STORAGE;
  }

  // User Management
  async getCurrentUser(): Promise<UserProfile | null> {
    if (this.isCloudMode()) {
      return GoogleDriveUserStorage.getCurrentUser();
    } else {
      return LocalStorageBackup.getCurrentUser();
    }
  }

  async isSignedIn(): Promise<boolean> {
    if (this.isCloudMode()) {
      return GoogleDriveUserStorage.isSignedIn();
    } else {
      return LocalStorageBackup.isSignedIn();
    }
  }

  async signIn(): Promise<UserProfile | null> {
    if (this.isCloudMode()) {
      return GoogleDriveUserStorage.signIn();
    } else {
      // For offline mode, just return the offline user
      LocalStorageBackup.initialize();
      return LocalStorageBackup.getCurrentUser();
    }
  }

  async signOut(): Promise<void> {
    if (this.isCloudMode()) {
      await GoogleDriveUserStorage.signOut();
    } else {
      // For offline mode, clear session but keep data
      console.log('👋 Signed out from offline mode');
    }
  }

  // User Data Management
  async loadUserData(): Promise<UserData | null> {
    try {
      if (this.isCloudMode()) {
        return await GoogleDriveUserStorage.loadUserData();
      } else {
        return await LocalStorageBackup.loadUserData();
      }
    } catch (error) {
      console.error('❌ Failed to load user data:', error);
      // Fallback to local storage if cloud fails
      if (this.isCloudMode()) {
        console.log('🔄 Falling back to local storage...');
        return await LocalStorageBackup.loadUserData();
      }
      return null;
    }
  }

  async saveUserData(userData: UserData): Promise<void> {
    try {
      if (this.isCloudMode()) {
        await GoogleDriveUserStorage.saveUserData(userData);
      } else {
        await LocalStorageBackup.saveUserData(userData);
      }
    } catch (error) {
      console.error('❌ Failed to save user data:', error);
      // Fallback to local storage if cloud fails
      if (this.isCloudMode()) {
        console.log('🔄 Saving to local storage as fallback...');
        await LocalStorageBackup.saveUserData(userData);
      }
      throw error;
    }
  }

  // Quiz Management
  async saveQuiz(quiz: Omit<UserQuiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (this.isCloudMode()) {
        return await GoogleDriveUserStorage.saveQuiz(quiz);
      } else {
        return await LocalStorageBackup.saveQuiz(quiz);
      }
    } catch (error) {
      console.error('❌ Failed to save quiz:', error);
      // Fallback to local storage if cloud fails
      if (this.isCloudMode()) {
        console.log('🔄 Saving quiz to local storage as fallback...');
        return await LocalStorageBackup.saveQuiz(quiz);
      }
      throw error;
    }
  }

  async getQuizzes(): Promise<UserQuiz[]> {
    try {
      if (this.isCloudMode()) {
        return await GoogleDriveUserStorage.getQuizzes();
      } else {
        return await LocalStorageBackup.getQuizzes();
      }
    } catch (error) {
      console.error('❌ Failed to get quizzes:', error);
      // Fallback to local storage if cloud fails
      if (this.isCloudMode()) {
        console.log('🔄 Loading quizzes from local storage as fallback...');
        return await LocalStorageBackup.getQuizzes();
      }
      return [];
    }
  }

  async getQuiz(quizId: string): Promise<UserQuiz | null> {
    try {
      if (this.isCloudMode()) {
        return await GoogleDriveUserStorage.getQuiz(quizId);
      } else {
        return await LocalStorageBackup.getQuiz(quizId);
      }
    } catch (error) {
      console.error('❌ Failed to get quiz:', error);
      // Fallback to local storage if cloud fails
      if (this.isCloudMode()) {
        console.log('🔄 Loading quiz from local storage as fallback...');
        return await LocalStorageBackup.getQuiz(quizId);
      }
      return null;
    }
  }

  async updateQuiz(quizId: string, updates: Partial<UserQuiz>): Promise<void> {
    try {
      if (this.isCloudMode()) {
        await GoogleDriveUserStorage.updateQuiz(quizId, updates);
      } else {
        await LocalStorageBackup.updateQuiz(quizId, updates);
      }
    } catch (error) {
      console.error('❌ Failed to update quiz:', error);
      // Fallback to local storage if cloud fails
      if (this.isCloudMode()) {
        console.log('🔄 Updating quiz in local storage as fallback...');
        await LocalStorageBackup.updateQuiz(quizId, updates);
      }
      throw error;
    }
  }

  async deleteQuiz(quizId: string): Promise<boolean> {
    try {
      if (this.isCloudMode()) {
        return await GoogleDriveUserStorage.deleteQuiz(quizId);
      } else {
        return await LocalStorageBackup.deleteQuiz(quizId);
      }
    } catch (error) {
      console.error('❌ Failed to delete quiz:', error);
      // Fallback to local storage if cloud fails
      if (this.isCloudMode()) {
        console.log('🔄 Deleting quiz from local storage as fallback...');
        return await LocalStorageBackup.deleteQuiz(quizId);
      }
      return false;
    }
  }

  // Legacy Quiz Import
  async importLegacyQuiz(title: string, questions: QuizQuestion[], description?: string): Promise<string> {
    return importLegacyQuiz(this.isCloudMode(), title, questions, description);
  }

  // Data Migration
  async migrateToCloud(): Promise<boolean> {
    if (this.isCloudMode()) {
      console.log('ℹ️ Already in cloud mode');
      return true;
    }

    // Store original state for rollback
    const originalMode = this.currentMode;
    const originalConfigured = this.isGoogleConfigured;

    try {
      // Check if Google APIs are configured
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      
      if (!clientId || !apiKey) {
        console.warn('⚠️ Google APIs not configured, cannot migrate to cloud');
        return false;
      }

      // Load local data first before making changes
      const localData = await LocalStorageBackup.loadUserData();
      if (!localData) {
        console.log('ℹ️ No local data to migrate');
        // Still switch to cloud mode if APIs are configured
        this.currentMode = StorageMode.GOOGLE_DRIVE;
        this.isGoogleConfigured = true;
        return true;
      }

      // Temporarily switch to cloud mode for sign-in
      this.currentMode = StorageMode.GOOGLE_DRIVE;
      this.isGoogleConfigured = true;

      // Attempt to sign in to Google
      const user = await GoogleDriveUserStorage.signIn();
      if (!user) {
        // Rollback state changes
        this.currentMode = originalMode;
        this.isGoogleConfigured = originalConfigured;
        throw new Error('Failed to sign in to Google');
      }

      // Migrate data to cloud
      await GoogleDriveUserStorage.saveUserData({
        ...localData,
        profile: user
      });

      console.log('✅ Successfully migrated to cloud storage');
      return true;
    } catch (error) {
      console.error('❌ Failed to migrate to cloud:', error);
      // Always rollback to original state on any error
      this.currentMode = originalMode;
      this.isGoogleConfigured = originalConfigured;
      return false;
    }
  }

  // Export/Import for backup
  async exportAllData(): Promise<string> {
    if (this.isCloudMode()) {
      try {
        const userData = await GoogleDriveUserStorage.loadUserData();
        return JSON.stringify({
          userData,
          exportedAt: new Date().toISOString(),
          source: 'google_drive'
        }, null, 2);
      } catch (error) {
        console.warn('⚠️ Failed to export from cloud, trying local storage...');
        return LocalStorageBackup.exportAllData();
      }
    } else {
      return LocalStorageBackup.exportAllData();
    }
  }

  // Status Information
  getStorageInfo(): {
    mode: StorageMode;
    isConfigured: boolean;
    canMigrate: boolean;
    userCount: number;
  } {
    return {
      mode: this.currentMode,
      isConfigured: this.isGoogleConfigured,
      canMigrate: !this.isGoogleConfigured && !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
      userCount: this.isCloudMode() ? 1 : 1 // Always 1 for current implementation
    };
  }

  // Quiz Management
  async saveQuizSession(session: QuizSession): Promise<void> {
    console.log('💾 [DEBUG] Saving quiz session...');
    try {
      const userData = await this.loadUserData();
      if (!userData) throw new Error('User data not found');
      
      userData.sessions.push(session);
      await this.saveUserData(userData);
      
      console.log('✅ [DEBUG] Quiz session saved successfully');
    } catch (error) {
      console.error('❌ [DEBUG] Failed to save quiz session:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default StorageManager.getInstance(); 