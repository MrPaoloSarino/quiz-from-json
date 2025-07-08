import { gapi } from 'gapi-script';
import { QuizQuestion } from '@/types/quiz';
import { UserProfile, UserData, UserQuiz, QuizSession, EnhancedQuizQuestion } from '@/types/user';
import debugLogger from './debugLogger';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

// SaaS-style scopes for user's personal data
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];
const SCOPES = [
  'https://www.googleapis.com/auth/drive.appdata', // Access to app-specific folder
  'https://www.googleapis.com/auth/userinfo.profile', // User profile info
  'https://www.googleapis.com/auth/userinfo.email' // User email
].join(' ');

let isInitialized = false;
let currentUser: UserProfile | null = null;

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

export class GoogleDriveUserStorage {
  
  static async initializeGoogleClient(): Promise<boolean> {
    if (isInitialized) return true;
    
    debugLogger.log('🔧 Initializing Google Client...');
    debugLogger.log('🔧 CLIENT_ID configured:', CLIENT_ID ? 'Yes' : 'No');
    debugLogger.log('🔧 API_KEY configured:', API_KEY ? 'Yes' : 'No');
    
    if (!CLIENT_ID || !API_KEY) {
      debugLogger.warn('⚠️ Google API credentials not configured - running in offline mode');
      debugLogger.log('ℹ️ To enable cloud features, configure VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY');
      return false;
    }
    
    if (CLIENT_ID.includes('your_google_client_id_here') || API_KEY.includes('your_google_api_key_here')) {
      debugLogger.warn('⚠️ Google API credentials are placeholder values - running in offline mode');
      debugLogger.log('ℹ️ Please replace placeholder values with actual Google API credentials');
      return false;
    }
    
    return new Promise((resolve) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          });
          isInitialized = true;
          debugLogger.log('🎉 Google Drive Storage initialized successfully');
          resolve(true);
        } catch (error) {
          debugLogger.error('❌ Google API init failed:', error);
          debugLogger.log('🔄 Falling back to offline mode');
          resolve(false);
        }
      });
    });
  }

  static async signIn(): Promise<UserProfile | null> {
    await this.initializeGoogleClient();
    
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      
      if (!authInstance.isSignedIn.get()) {
        const googleUser = await authInstance.signIn();
        const profile = googleUser.getBasicProfile();
        
        currentUser = {
          id: profile.getId(),
          email: profile.getEmail(),
          name: profile.getName(),
          picture: profile.getImageUrl(),
        };
      } else {
        const profile = authInstance.currentUser.get().getBasicProfile();
        currentUser = {
          id: profile.getId(),
          email: profile.getEmail(),
          name: profile.getName(),
          picture: profile.getImageUrl(),
        };
      }
      
      // Initialize user's app data folder
      await this.ensureUserDataStructure();
      
      debugLogger.log('✅ User signed in successfully:', currentUser?.name);
      return currentUser;
    } catch (error) {
      debugLogger.error('❌ Sign-in failed:', error);
      return null;
    }
  }

  static async signOut(): Promise<void> {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      await authInstance.signOut();
      currentUser = null;
      debugLogger.log('👋 User signed out');
    }
  }

  static isSignedIn(): boolean {
    if (!isInitialized) return false;
    const authInstance = gapi.auth2.getAuthInstance();
    return authInstance?.isSignedIn.get() || false;
  }

  static getCurrentUser(): UserProfile | null {
    return currentUser;
  }

  // Private: Ensure user has proper data structure in their app folder
  private static async ensureUserDataStructure(): Promise<void> {
    try {
      // Check if user data file exists
      const existingFiles = await gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        q: "name='user_data.json'",
        fields: 'files(id, name)',
      });

      if (!existingFiles.result.files || existingFiles.result.files.length === 0) {
        // Create initial user data structure
        const initialData: UserData = {
          profile: currentUser!,
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
          learningStats: { ...defaultLearningStats },
        };

        await this.saveUserData(initialData);
        debugLogger.log('🎯 Created initial user data structure with sample quizzes');
      } else {
        debugLogger.log('📁 User data structure already exists');
      }
    } catch (error) {
      debugLogger.error('❌ Failed to ensure user data structure:', error);
    }
  }

  private static getDefaultQuizzes(): UserQuiz[] {
    return [
      {
        id: 'default-math-1',
        title: 'Basic Mathematics',
        description: 'Essential arithmetic operations',
        category: 'Mathematics',
        difficulty: 'easy',
        estimatedDuration: 300, // 5 minutes
        questions: [
          {
            id: 'math-1',
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
            id: 'math-2',
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
        tags: ['math', 'basic', 'arithmetic'],
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'default-geography-1',
        title: 'World Geography',
        description: 'Countries, capitals, and landmarks',
        category: 'Geography',
        difficulty: 'medium',
        estimatedDuration: 600, // 10 minutes
        questions: [
          {
            id: 'geo-1',
            question: "What is the capital of France?",
            options: ["Paris", "Rome", "Berlin"],
            answer: "Paris",
            type: "multiple",
            difficulty: 'easy',
            tags: ['capitals', 'europe'],
            category: 'Geography',
            estimatedTime: 30,
            attempts: 0,
            successRate: 0,
            averageTime: 30,
            commonMistakes: [],
            learningObjectives: ['European capitals'],
            ...defaultEnhancedFields,
          },
          {
            id: 'geo-2',
            question: "Describe the climate of the Amazon rainforest and its importance to global weather patterns.",
            type: "essay",
            difficulty: 'medium',
            tags: ['climate', 'rainforest', 'environment'],
            category: 'Geography',
            estimatedTime: 300,
            attempts: 0,
            successRate: 0,
            averageTime: 300,
            commonMistakes: [],
            learningObjectives: ['Climate systems', 'Environmental science'],
            ...defaultEnhancedFields,
          }
        ],
        tags: ['geography', 'world', 'capitals'],
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Save complete user data to their private app folder
  static async saveUserData(userData: UserData): Promise<void> {
    try {
      const fileContent = JSON.stringify(userData, null, 2);
      const blob = new Blob([fileContent], { type: 'application/json' });

      // Check if file already exists
      const existingFiles = await gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        q: "name='user_data.json'",
        fields: 'files(id)',
      });

      const authResponse = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();

      if (existingFiles.result.files && existingFiles.result.files.length > 0) {
        // Update existing file
        const fileId = existingFiles.result.files[0].id;
        
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify({
          name: 'user_data.json',
        })], { type: 'application/json' }));
        form.append('file', blob);

        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${authResponse.access_token}`,
          },
          body: form,
        });
      } else {
        // Create new file
        const fileMetadata = {
          name: 'user_data.json',
          parents: ['appDataFolder'],
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
        form.append('file', blob);

        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authResponse.access_token}`,
          },
          body: form,
        });
      }

      debugLogger.log('💾 User data saved successfully');
    } catch (error) {
      debugLogger.error('❌ Failed to save user data:', error);
      throw error;
    }
  }

  // Load user's complete data from their private app folder
  static async loadUserData(): Promise<UserData | null> {
    try {
      const files = await gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        q: "name='user_data.json'",
        fields: 'files(id)',
      });

      if (!files.result.files || files.result.files.length === 0) {
        debugLogger.log('📄 No user data found');
        return null;
      }

      const fileId = files.result.files[0].id;
      const response = await gapi.client.drive.files.get({
        fileId: fileId!,
        alt: 'media',
      });

      const userData = JSON.parse(response.body) as UserData;
      debugLogger.log('📖 User data loaded successfully');
      return userData;
    } catch (error) {
      debugLogger.error('❌ Failed to load user data:', error);
      return null;
    }
  }

  // Quiz-specific methods
  static async saveQuiz(quiz: Omit<UserQuiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    debugLogger.log('☁️ GoogleDriveUserStorage.saveQuiz called');
    debugLogger.log('☁️ Quiz to save:', quiz);
    
    try {
      debugLogger.log('☁️ Loading user data...');
      const userData = await this.loadUserData();
      
      if (!userData) {
        debugLogger.error('❌ User data not found');
        throw new Error('User data not found');
      }
      
      debugLogger.log('☁️ User data loaded successfully');
      debugLogger.log('☁️ Current quizzes count:', userData.quizzes.length);

      const now = new Date().toISOString();
      const newQuiz: UserQuiz = {
        ...quiz,
        id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      
      debugLogger.log('☁️ New quiz created:', newQuiz);
      debugLogger.log('☁️ New quiz ID:', newQuiz.id);

      userData.quizzes.push(newQuiz);
      debugLogger.log('☁️ Quiz added to user data. New count:', userData.quizzes.length);
      
      debugLogger.log('☁️ Saving updated user data...');
      await this.saveUserData(userData);
      debugLogger.log('☁️ User data saved successfully');

      debugLogger.log('✅ Quiz saved:', newQuiz.title);
      return newQuiz.id;
      
    } catch (error) {
      debugLogger.error('❌ GoogleDriveUserStorage.saveQuiz error:', error);
      debugLogger.log('☁️ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack available',
        type: typeof error
      });
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
    debugLogger.log('📝 Quiz updated:', userData.quizzes[quizIndex].title);
  }

  static async deleteQuiz(quizId: string): Promise<boolean> {
    const userData = await this.loadUserData();
    if (!userData) return false;

    const index = userData.quizzes.findIndex(q => q.id === quizId);
    if (index === -1) return false;

    const deletedQuiz = userData.quizzes.splice(index, 1)[0];
    await this.saveUserData(userData);
    debugLogger.log('🗑️ Quiz deleted:', deletedQuiz.title);
    return true;
  }

  // Settings methods
  static async updateSettings(settings: Partial<UserData['settings']>): Promise<void> {
    const userData = await this.loadUserData();
    if (!userData) throw new Error('User data not found');

    userData.settings = { ...userData.settings, ...settings };
    await this.saveUserData(userData);
    debugLogger.log('⚙️ Settings updated');
  }

  // Analytics methods
  static async recordQuizSession(session: QuizSession): Promise<void> {
    const userData = await this.loadUserData();
    if (!userData) throw new Error('User data not found');

    userData.sessions.push(session);
    
    // Update analytics
    userData.settings.analytics.totalQuestions += session.questions.length;
    userData.settings.analytics.totalTime += session.timeSpent;
    
    await this.saveUserData(userData);
    debugLogger.log('📊 Quiz session recorded');
  }

  // Convert legacy QuizQuestion to EnhancedQuizQuestion
  static convertLegacyQuestions(questions: QuizQuestion[]): EnhancedQuizQuestion[] {
    return questions.map((q, index) => ({
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
  }

  // Import quiz from legacy format
  static async importLegacyQuiz(title: string, questions: QuizQuestion[], description?: string): Promise<string> {
    debugLogger.log('☁️ GoogleDriveUserStorage.importLegacyQuiz called');
    debugLogger.log('☁️ Parameters:', { title, questionsCount: questions.length, description });
    debugLogger.log('☁️ Questions:', questions);
    
    try {
      debugLogger.log('☁️ Converting legacy questions...');
      const enhancedQuestions = this.convertLegacyQuestions(questions);
      debugLogger.log('☁️ Enhanced questions:', enhancedQuestions);
      debugLogger.log('☁️ Enhanced questions count:', enhancedQuestions.length);
      
      const quizData = {
        title,
        description: description || 'Imported quiz',
        questions: enhancedQuestions,
        tags: ['imported'],
        category: 'General',
        difficulty: 'medium' as const,
        estimatedDuration: enhancedQuestions.reduce((total, q) => total + q.estimatedTime, 0),
      };
      
      debugLogger.log('☁️ Quiz data to save:', quizData);
      debugLogger.log('☁️ Calling saveQuiz...');
      
      const result = await this.saveQuiz(quizData);
      
      debugLogger.log('✅ GoogleDriveUserStorage.importLegacyQuiz completed successfully:', result);
      return result;
      
    } catch (error) {
      debugLogger.error('❌ GoogleDriveUserStorage.importLegacyQuiz error:', error);
      debugLogger.log('☁️ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack available',
        type: typeof error
      });
      throw error;
    }
  }
}

// Export for backward compatibility
export const {
  initializeGoogleClient,
  signIn,
  signOut,
  isSignedIn,
  getCurrentUser,
  loadUserData,
  saveUserData,
  getQuizzes,
  saveQuiz,
} = GoogleDriveUserStorage;

export type { UserProfile, UserData, UserQuiz } from '@/types/user';