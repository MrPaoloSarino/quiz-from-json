// Local Storage Fallback for Quiz Storage
// This provides the same interface as Google Drive storage but uses localStorage
// Automatically used when Google APIs aren't configured

import { QuizQuestion } from '@/types/quiz';
import { UserProfile, UserData, UserQuiz, EnhancedQuizQuestion } from '@/types/user';

const STORAGE_KEYS = {
  USER_DATA: 'quizmaster_user_data',
  USER_PROFILE: 'quizmaster_user_profile',
  QUIZZES: 'quizmaster_quizzes',
} as const;

class LocalStorageBackup {
  private static currentUser: UserProfile | null = null;

  // Initialize with offline user
  static initialize(): void {
    console.log('🔧 [DEBUG] LocalStorageBackup.initialize called');
    if (!this.currentUser) {
      console.log('🔧 [DEBUG] No current user, creating offline user...');
      this.currentUser = this.getOfflineUser();
      this.ensureUserDataStructure();
      console.log('✅ [DEBUG] Offline user initialized:', this.currentUser);
    } else {
      console.log('ℹ️ [DEBUG] Current user already exists:', this.currentUser);
    }
  }

  private static getOfflineUser(): UserProfile {
    console.log('🔧 [DEBUG] Getting offline user...');
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (stored) {
      try {
        console.log('🔧 [DEBUG] Found stored user profile');
        const profile = JSON.parse(stored);
        console.log('✅ [DEBUG] Parsed stored profile:', profile);
        return profile;
      } catch (error) {
        console.warn('⚠️ [DEBUG] Failed to parse stored user profile:', error);
      }
    }

    // Create default offline user
    console.log('🔧 [DEBUG] Creating new offline user...');
    const offlineUser: UserProfile = {
      id: 'offline-user',
      name: 'Offline User',
      email: 'offline@quizmaster.local',
      picture: ''
    };

    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(offlineUser));
    console.log('✅ [DEBUG] New offline user created and stored:', offlineUser);
    return offlineUser;
  }

  static getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  static isSignedIn(): boolean {
    return this.currentUser !== null;
  }

  private static ensureUserDataStructure(): void {
    console.log('🔧 [DEBUG] Ensuring user data structure...');
    const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!stored) {
      console.log('🔧 [DEBUG] No user data found, creating initial structure...');
      const initialData: UserData = {
        profile: this.currentUser!,
        settings: {
          preferences: {
            aiPersonality: 'encouraging',
            learningStyle: 'visual',
            soundEnabled: true,
            volume: 0.3,
            theme: 'light',
            language: 'en',
          },
          analytics: {
            totalQuestions: 0,
            totalTime: 0,
            streakDays: 0,
            longestStreak: 0,
            averageAccuracy: 0,
            masteredTopics: [],
            improvementAreas: [],
            learningVelocity: 0,
          },
        },
        quizzes: this.getDefaultQuizzes(),
        sessions: [],
        achievements: [],
        level: 1,
        xp: 0,
      };

      this.saveUserData(initialData);
      console.log('✅ [DEBUG] Initial user data structure created');
    } else {
      console.log('ℹ️ [DEBUG] User data structure already exists');
    }
  }

  private static getDefaultQuizzes(): UserQuiz[] {
    return [
      {
        id: 'demo-math-1',
        title: 'Demo: Basic Mathematics',
        description: 'Sample quiz to get you started',
        category: 'Mathematics',
        difficulty: 'easy',
        estimatedDuration: 300,
        questions: [
          {
            id: 'math-demo-1',
            question: "What is 2 + 2?",
            options: ["3", "4", "5"],
            answer: "4",
            type: "multiple",
            difficulty: 'easy',
            tags: ['arithmetic', 'addition'],
            category: 'Mathematics',
            estimatedTime: 30,
            attempts: 0,
            successRate: 0,
            averageTime: 30,
            commonMistakes: [],
            learningObjectives: ['Basic addition'],
          },
          {
            id: 'math-demo-2',
            question: "What is 5 × 3?",
            options: ["15", "12", "18"],
            answer: "15",
            type: "multiple",
            difficulty: 'easy',
            tags: ['arithmetic', 'multiplication'],
            category: 'Mathematics',
            estimatedTime: 30,
            attempts: 0,
            successRate: 0,
            averageTime: 30,
            commonMistakes: [],
            learningObjectives: ['Basic multiplication'],
          }
        ],
        tags: ['demo', 'math', 'basic'],
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  static async saveUserData(userData: UserData): Promise<void> {
    console.log('💾 [DEBUG] Saving user data...');
    console.log('💾 [DEBUG] Data to save:', userData);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      console.log('✅ [DEBUG] User data saved successfully');
    } catch (error) {
      console.error('❌ [DEBUG] Failed to save user data:', error);
      throw error;
    }
  }

  static async loadUserData(): Promise<UserData | null> {
    console.log('📖 [DEBUG] Loading user data...');
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!stored) {
        console.log('ℹ️ [DEBUG] No user data found');
        return null;
      }

      const userData = JSON.parse(stored) as UserData;
      console.log('✅ [DEBUG] User data loaded successfully:', userData);
      return userData;
    } catch (error) {
      console.error('❌ [DEBUG] Failed to load user data:', error);
      return null;
    }
  }

  // Quiz-specific methods
  static async saveQuiz(quiz: Omit<UserQuiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('💾 [DEBUG] LocalStorageBackup.saveQuiz called');
    console.log('💾 [DEBUG] Quiz to save:', quiz);
    
    try {
      console.log('💾 [DEBUG] Loading existing user data...');
      const userData = await this.loadUserData();
      
      if (!userData) {
        console.error('❌ [DEBUG] User data not found');
        throw new Error('User data not found');
      }
      
      console.log('💾 [DEBUG] Current quizzes count:', userData.quizzes.length);

      const now = new Date().toISOString();
      const newQuiz: UserQuiz = {
        ...quiz,
        id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      
      console.log('💾 [DEBUG] New quiz created:', newQuiz);
      console.log('💾 [DEBUG] New quiz ID:', newQuiz.id);

      userData.quizzes.push(newQuiz);
      console.log('💾 [DEBUG] Quiz added to user data. New count:', userData.quizzes.length);
      
      console.log('💾 [DEBUG] Saving updated user data...');
      await this.saveUserData(userData);
      console.log('✅ [DEBUG] Quiz saved successfully');

      return newQuiz.id;
      
    } catch (error) {
      console.error('❌ [DEBUG] LocalStorageBackup.saveQuiz error:', error);
      throw error;
    }
  }

  static async getQuizzes(): Promise<UserQuiz[]> {
    const userData = await this.loadUserData();
    return userData?.quizzes || [];
  }

  static async getQuiz(quizId: string): Promise<UserQuiz | null> {
    const userData = await this.loadUserData();
    return userData?.quizzes.find(q => q.id === quizId) || null;
  }

  static async updateQuiz(quizId: string, updates: Partial<UserQuiz>): Promise<void> {
    const userData = await this.loadUserData();
    if (!userData) throw new Error('User data not found');

    const quizIndex = userData.quizzes.findIndex(q => q.id === quizId);
    if (quizIndex === -1) throw new Error('Quiz not found');

    userData.quizzes[quizIndex] = {
      ...userData.quizzes[quizIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveUserData(userData);
    console.log('📝 Quiz updated in local storage:', userData.quizzes[quizIndex].title);
  }

  static async deleteQuiz(quizId: string): Promise<boolean> {
    const userData = await this.loadUserData();
    if (!userData) return false;

    const index = userData.quizzes.findIndex(q => q.id === quizId);
    if (index === -1) return false;

    const deletedQuiz = userData.quizzes.splice(index, 1)[0];
    await this.saveUserData(userData);
    console.log('🗑️ Quiz deleted from local storage:', deletedQuiz.title);
    return true;
  }

  // Convert legacy QuizQuestion to EnhancedQuizQuestion
  static convertLegacyQuestions(questions: QuizQuestion[]): EnhancedQuizQuestion[] {
    console.log('🔄 [DEBUG] Converting legacy questions...');
    console.log('🔄 [DEBUG] Input questions:', questions);
    
    const enhanced = questions.map((q, index) => ({
      ...q,
      id: `question_${Date.now()}_${index}`,
      difficulty: 'medium' as const,
      tags: q.type === 'essay' ? ['essay'] : ['multiple-choice'],
      category: 'General',
      estimatedTime: q.type === 'essay' ? 300 : 30,
      attempts: 0,
      successRate: 0,
      averageTime: q.type === 'essay' ? 300 : 30,
      commonMistakes: [],
      learningObjectives: [],
    }));
    
    console.log('✅ [DEBUG] Questions converted successfully:', enhanced);
    return enhanced;
  }

  // Import quiz from legacy format
  static async importLegacyQuiz(title: string, questions: QuizQuestion[], description?: string): Promise<string> {
    console.log('📥 [DEBUG] LocalStorageBackup.importLegacyQuiz called');
    console.log('📥 [DEBUG] Parameters:', { title, questionsCount: questions.length, description });
    console.log('📥 [DEBUG] Questions:', questions);
    
    try {
      console.log('📥 [DEBUG] Converting legacy questions...');
      const enhancedQuestions = this.convertLegacyQuestions(questions);
      console.log('📥 [DEBUG] Enhanced questions:', enhancedQuestions);
      
      const quizData = {
        title,
        description: description || 'Imported quiz',
        questions: enhancedQuestions,
        tags: ['imported'],
        category: 'General',
        difficulty: 'medium' as const,
        estimatedDuration: enhancedQuestions.reduce((total, q) => total + q.estimatedTime, 0),
      };
      
      console.log('📥 [DEBUG] Quiz data prepared:', quizData);
      console.log('📥 [DEBUG] Calling saveQuiz...');
      
      const result = await this.saveQuiz(quizData);
      console.log('✅ [DEBUG] Quiz imported successfully. ID:', result);
      return result;
      
    } catch (error) {
      console.error('❌ [DEBUG] LocalStorageBackup.importLegacyQuiz error:', error);
      throw error;
    }
  }

  // Migration helper: Export all data for Google Drive migration
  static exportAllData(): string {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    const userProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    
    return JSON.stringify({
      userData: userData ? JSON.parse(userData) : null,
      userProfile: userProfile ? JSON.parse(userProfile) : null,
      exportedAt: new Date().toISOString(),
      source: 'local_storage'
    }, null, 2);
  }

  // Clear all local data
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    this.currentUser = null;
    console.log('🧹 All local quiz data cleared');
  }
}

export default LocalStorageBackup; 