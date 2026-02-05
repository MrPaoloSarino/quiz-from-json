// Local Storage Fallback for Quiz Storage
// This provides the same interface as Google Drive storage but uses localStorage
// Automatically used when Google APIs aren't configured

import { QuizQuestion } from '@/types/quiz';
import { UserProfile, UserData, UserQuiz, EnhancedQuizQuestion } from '@/types/user';
import debugLogger from './debugLogger';

const STORAGE_KEYS = {
  USER_DATA: 'quizmaster_user_data',
  USER_PROFILE: 'quizmaster_user_profile',
  QUIZZES: 'quizmaster_quizzes',
} as const;

const defaultLearningStats = {
  averageRetentionRate: 0.8,
  optimalReviewIntervals: { easy: 7, medium: 4, hard: 2 },
  topicsForReview: [],
  activeRecallSuccess: 0,
  elaborationQuality: 0,
  interleavingStrength: 0,
  retentionTrend: [],
  masteryProgress: {},
};

const defaultSpacedRepetition = {
  lastReviewDate: new Date(),
  nextReviewDate: new Date(),
  interval: 1,
  easeFactor: 2.5,
  consecutiveCorrect: 0,
  reviewHistory: [],
};

const defaultAnalytics = {
  strengthScore: 0,
  lastRecallSuccess: false,
  recallAttempts: 0,
  recallSuccesses: 0,
  averageRecallTime: 0,
  lastInterleaved: new Date(),
  relatedConcepts: [],
};

const defaultEnhancedFields = {
  spacedRepetition: { ...defaultSpacedRepetition },
  analytics: { ...defaultAnalytics },
  activeRecallPrompts: [],
  elaborations: [],
  isAnswerLocked: false,
  answerHistory: [],
};

class LocalStorageBackup {
  private static currentUser: UserProfile | null = null;

  // Initialize with offline user
  static initialize(): void {
    if (process.env.NODE_ENV === 'development') debugLogger.log('🔧 LocalStorageBackup.initialize called');
    if (!this.currentUser) {
      if (process.env.NODE_ENV === 'development') debugLogger.log('🔧 No current user, creating offline user...');
      this.currentUser = this.getOfflineUser();
      this.ensureUserDataStructure();
      if (process.env.NODE_ENV === 'development') debugLogger.log('✅ Offline user initialized:', this.currentUser);
    } else {
      if (process.env.NODE_ENV === 'development') debugLogger.log('ℹ️ Current user already exists:', this.currentUser);
    }
  }

  private static getOfflineUser(): UserProfile {
    if (process.env.NODE_ENV === 'development') debugLogger.log('🔧 Getting offline user...');
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (stored) {
      try {
        if (process.env.NODE_ENV === 'development') debugLogger.log('🔧 Found stored user profile');
        const profile = JSON.parse(stored);
        if (process.env.NODE_ENV === 'development') debugLogger.log('✅ Parsed stored profile:', profile);
        return profile;
      } catch (error) {
        debugLogger.warn('⚠️ Failed to parse stored user profile:', error);
      }
    }

    // Create default offline user
    if (process.env.NODE_ENV === 'development') debugLogger.log('🔧 Creating new offline user...');
    const offlineUser: UserProfile = {
      id: 'offline-user',
      name: 'Offline User',
      email: 'offline@quizmaster.local',
      picture: ''
    };

    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(offlineUser));
    if (process.env.NODE_ENV === 'development') debugLogger.log('✅ New offline user created and stored:', offlineUser);
    return offlineUser;
  }

  static getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  static isSignedIn(): boolean {
    return this.currentUser !== null;
  }

  private static ensureUserDataStructure(): void {
    if (process.env.NODE_ENV === 'development') debugLogger.log('🔧 Ensuring user data structure...');
    const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!stored) {
      if (process.env.NODE_ENV === 'development') debugLogger.log('🔧 No user data found, creating initial structure...');
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
        flashcardDecks: [], // FIX: Add flashcardDecks to initial data
        sessions: [],
        achievements: [],
        level: 1,
        xp: 0,
        learningStats: { ...defaultLearningStats },
      };

      this.saveUserData(initialData);
      if (process.env.NODE_ENV === 'development') debugLogger.log('✅ Initial user data structure created');
    } else {
      if (process.env.NODE_ENV === 'development') debugLogger.log('ℹ️ User data structure already exists');
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
            ...defaultEnhancedFields,
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
            ...defaultEnhancedFields,
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
    if (process.env.NODE_ENV === 'development') debugLogger.log('💾 Saving user data...');
    if (process.env.NODE_ENV === 'development') debugLogger.log('💾 Data to save:', userData);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      if (process.env.NODE_ENV === 'development') debugLogger.log('✅ User data saved successfully');
    } catch (error) {
      debugLogger.error('❌ Failed to save user data:', error);
      throw error;
    }
  }

  static async loadUserData(): Promise<UserData | null> {
    if (process.env.NODE_ENV === 'development') debugLogger.log('📖 Loading user data...');
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!stored) {
        if (process.env.NODE_ENV === 'development') debugLogger.log('ℹ️ No user data found');
        return null;
      }

      const userData = JSON.parse(stored) as UserData;
      if (process.env.NODE_ENV === 'development') debugLogger.log('✅ User data loaded successfully:', userData);
      return userData;
    } catch (error) {
      debugLogger.error('❌ Failed to load user data:', error);
      return null;
    }
  }

  // Quiz-specific methods
  static async saveQuiz(quiz: Omit<UserQuiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (process.env.NODE_ENV === 'development') debugLogger.log('💾 LocalStorageBackup.saveQuiz called');
    if (process.env.NODE_ENV === 'development') debugLogger.log('💾 Quiz to save:', quiz);
    
    // Ensure initialization before any operation
    this.initialize();
    
    try {
      if (process.env.NODE_ENV === 'development') debugLogger.log('💾 Loading existing user data...');
      let userData = await this.loadUserData();
      
      // If user data still doesn't exist after initialization, create it
      if (!userData) {
        if (process.env.NODE_ENV === 'development') debugLogger.log('⚠️ User data not found after init, forcing structure creation...');
        this.ensureUserDataStructure();
        userData = await this.loadUserData();
        
        if (!userData) {
          debugLogger.error('❌ Failed to create user data structure');
          throw new Error('Failed to initialize user data');
        }
      }
      
      if (process.env.NODE_ENV === 'development') debugLogger.log('💾 Current quizzes count:', userData.quizzes.length);

      const now = new Date().toISOString();
      const newQuiz: UserQuiz = {
        ...quiz,
        id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      
      if (process.env.NODE_ENV === 'development') debugLogger.log('💾 New quiz created:', newQuiz);
      if (process.env.NODE_ENV === 'development') debugLogger.log('💾 New quiz ID:', newQuiz.id);

      userData.quizzes.push(newQuiz);
      if (process.env.NODE_ENV === 'development') debugLogger.log('💾 Quiz added to user data. New count:', userData.quizzes.length);
      
      if (process.env.NODE_ENV === 'development') debugLogger.log('💾 Saving updated user data...');
      await this.saveUserData(userData);
      if (process.env.NODE_ENV === 'development') debugLogger.log('✅ Quiz saved successfully');

      return newQuiz.id;
      
    } catch (error) {
      debugLogger.error('❌ LocalStorageBackup.saveQuiz error:', error);
      throw error;
    }
  }

  static async getQuizzes(): Promise<UserQuiz[]> {
    this.initialize(); // Ensure initialization
    const userData = await this.loadUserData();
    return userData?.quizzes || [];
  }

  static async getQuiz(quizId: string): Promise<UserQuiz | null> {
    this.initialize(); // Ensure initialization
    const userData = await this.loadUserData();
    return userData?.quizzes.find(q => q.id === quizId) || null;
  }

  static async updateQuiz(quizId: string, updates: Partial<UserQuiz>): Promise<void> {
    this.initialize(); // Ensure initialization
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
    if (process.env.NODE_ENV === 'development') debugLogger.log('📝 Quiz updated in local storage:', userData.quizzes[quizIndex].title);
  }

  static async deleteQuiz(quizId: string): Promise<boolean> {
    this.initialize(); // Ensure initialization
    const userData = await this.loadUserData();
    if (!userData) return false;

    const index = userData.quizzes.findIndex(q => q.id === quizId);
    if (index === -1) return false;

    const deletedQuiz = userData.quizzes.splice(index, 1)[0];
    await this.saveUserData(userData);
    if (process.env.NODE_ENV === 'development') debugLogger.log('🗑️ Quiz deleted from local storage:', deletedQuiz.title);
    return true;
  }

  // Flashcard deck methods
  static async saveFlashcardDeck(deck: Omit<import("@/types/flashcard").FlashcardDeck, 'id'>): Promise<string> {
    if (process.env.NODE_ENV === 'development') debugLogger.log('💾 LocalStorageBackup.saveFlashcardDeck called');
    const userData = await this.loadUserData();
    if (!userData) throw new Error('User data not found');
    const newDeck = {
      ...deck,
      id: `flashcard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    userData.flashcardDecks = userData.flashcardDecks || [];
    userData.flashcardDecks.push(newDeck);
    await this.saveUserData(userData);
    return newDeck.id;
  }

  static async getFlashcardDecks(): Promise<import("@/types/flashcard").FlashcardDeck[]> {
    const userData = await this.loadUserData();
    return userData?.flashcardDecks || [];
  }

  static async getFlashcardDeck(deckId: string): Promise<import("@/types/flashcard").FlashcardDeck | null> {
    const userData = await this.loadUserData();
    return userData?.flashcardDecks?.find(d => d.id === deckId) || null;
  }

  static async updateFlashcardDeck(deckId: string, updates: Partial<import("@/types/flashcard").FlashcardDeck>): Promise<void> {
    const userData = await this.loadUserData();
    if (!userData) throw new Error('User data not found');
    const deckIndex = userData.flashcardDecks?.findIndex(d => d.id === deckId);
    if (deckIndex === undefined || deckIndex === -1) throw new Error('Deck not found');
    userData.flashcardDecks[deckIndex] = {
      ...userData.flashcardDecks[deckIndex],
      ...updates,
    };
    await this.saveUserData(userData);
    if (process.env.NODE_ENV === 'development') debugLogger.log('📝 Flashcard deck updated in local storage:', userData.flashcardDecks[deckIndex].title);
  }

  static async deleteFlashcardDeck(deckId: string): Promise<boolean> {
    const userData = await this.loadUserData();
    if (!userData) return false;
    const index = userData.flashcardDecks?.findIndex(d => d.id === deckId);
    if (index === undefined || index === -1) return false;
    const deletedDeck = userData.flashcardDecks.splice(index, 1)[0];
    await this.saveUserData(userData);
    if (process.env.NODE_ENV === 'development') debugLogger.log('🗑️ Flashcard deck deleted from local storage:', deletedDeck.title);
    return true;
  }

  // Convert legacy QuizQuestion to EnhancedQuizQuestion
  static convertLegacyQuestions(questions: QuizQuestion[]): EnhancedQuizQuestion[] {
    if (process.env.NODE_ENV === 'development') debugLogger.log('🔄 Converting legacy questions...');
    if (process.env.NODE_ENV === 'development') debugLogger.log('🔄 Input questions:', questions);
    
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
      ...defaultEnhancedFields,
    }));
    
    if (process.env.NODE_ENV === 'development') debugLogger.log('✅ Questions converted successfully:', enhanced);
    return enhanced;
  }

  // Import quiz from legacy format
  static async importLegacyQuiz(title: string, questions: QuizQuestion[], description?: string): Promise<string> {
    if (process.env.NODE_ENV === 'development') debugLogger.log('📥 LocalStorageBackup.importLegacyQuiz called');
    if (process.env.NODE_ENV === 'development') debugLogger.log('📥 Parameters:', { title, questionsCount: questions.length, description });
    if (process.env.NODE_ENV === 'development') debugLogger.log('📥 Questions:', questions);
    
    try {
      if (process.env.NODE_ENV === 'development') debugLogger.log('📥 Converting legacy questions...');
      const enhancedQuestions = this.convertLegacyQuestions(questions);
      if (process.env.NODE_ENV === 'development') debugLogger.log('📥 Enhanced questions:', enhancedQuestions);
      
      const quizData = {
        title,
        description: description || 'Imported quiz',
        questions: enhancedQuestions,
        tags: ['imported'],
        category: 'General',
        difficulty: 'medium' as const,
        estimatedDuration: enhancedQuestions.reduce((total, q) => total + q.estimatedTime, 0),
      };
      
      if (process.env.NODE_ENV === 'development') debugLogger.log('📥 Quiz data prepared:', quizData);
      if (process.env.NODE_ENV === 'development') debugLogger.log('📥 Calling saveQuiz...');
      
      const result = await this.saveQuiz(quizData);
      if (process.env.NODE_ENV === 'development') debugLogger.log('✅ Quiz imported successfully. ID:', result);
      return result;
      
    } catch (error) {
      debugLogger.error('❌ LocalStorageBackup.importLegacyQuiz error:', error);
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
    if (process.env.NODE_ENV === 'development') debugLogger.log('🧹 All local quiz data cleared');
  }
}

export default LocalStorageBackup; 