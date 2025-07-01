import { gapi } from 'gapi-script';
import { QuizQuestion } from '@/types/quiz';
import { UserProfile, UserData, UserQuiz, QuizSession, EnhancedQuizQuestion } from '@/types/user';

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

export class GoogleDriveUserStorage {
  
  static async initializeGoogleClient(): Promise<boolean> {
    if (isInitialized) return true;
    
    console.log('🔧 [DEBUG] Initializing Google Client...');
    console.log('🔧 [DEBUG] CLIENT_ID configured:', CLIENT_ID ? 'Yes' : 'No');
    console.log('🔧 [DEBUG] API_KEY configured:', API_KEY ? 'Yes' : 'No');
    
    if (!CLIENT_ID || !API_KEY) {
      console.warn('⚠️ Google API credentials not configured - running in offline mode');
      console.log('ℹ️ To enable cloud features, configure VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY');
      return false;
    }
    
    if (CLIENT_ID.includes('your_google_client_id_here') || API_KEY.includes('your_google_api_key_here')) {
      console.warn('⚠️ Google API credentials are placeholder values - running in offline mode');
      console.log('ℹ️ Please replace placeholder values with actual Google API credentials');
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
          console.log('🎉 Google Drive Storage initialized successfully');
          resolve(true);
        } catch (error) {
          console.error('❌ Google API init failed:', error);
          console.log('🔄 Falling back to offline mode');
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
      
      console.log('✅ User signed in successfully:', currentUser.name);
      return currentUser;
    } catch (error) {
      console.error('❌ Sign-in failed:', error);
      return null;
    }
  }

  static async signOut(): Promise<void> {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      await authInstance.signOut();
      currentUser = null;
      console.log('👋 User signed out');
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
        };

        await this.saveUserData(initialData);
        console.log('🎯 Created initial user data structure with sample quizzes');
      } else {
        console.log('📁 User data structure already exists');
      }
    } catch (error) {
      console.error('❌ Failed to ensure user data structure:', error);
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

      console.log('💾 User data saved successfully');
    } catch (error) {
      console.error('❌ Failed to save user data:', error);
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
        console.log('📄 No user data found');
        return null;
      }

      const fileId = files.result.files[0].id;
      const response = await gapi.client.drive.files.get({
        fileId: fileId!,
        alt: 'media',
      });

      const userData = JSON.parse(response.body) as UserData;
      console.log('📖 User data loaded successfully');
      return userData;
    } catch (error) {
      console.error('❌ Failed to load user data:', error);
      return null;
    }
  }

  // Quiz-specific methods
  static async saveQuiz(quiz: Omit<UserQuiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('☁️ [DEBUG] GoogleDriveUserStorage.saveQuiz called');
    console.log('☁️ [DEBUG] Quiz to save:', quiz);
    
    try {
      console.log('☁️ [DEBUG] Loading user data...');
      const userData = await this.loadUserData();
      
      if (!userData) {
        console.error('❌ [DEBUG] User data not found');
        throw new Error('User data not found');
      }
      
      console.log('☁️ [DEBUG] User data loaded successfully');
      console.log('☁️ [DEBUG] Current quizzes count:', userData.quizzes.length);

      const now = new Date().toISOString();
      const newQuiz: UserQuiz = {
        ...quiz,
        id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      
      console.log('☁️ [DEBUG] New quiz created:', newQuiz);
      console.log('☁️ [DEBUG] New quiz ID:', newQuiz.id);

      userData.quizzes.push(newQuiz);
      console.log('☁️ [DEBUG] Quiz added to user data. New count:', userData.quizzes.length);
      
      console.log('☁️ [DEBUG] Saving updated user data...');
      await this.saveUserData(userData);
      console.log('☁️ [DEBUG] User data saved successfully');

      console.log('✅ Quiz saved:', newQuiz.title);
      return newQuiz.id;
      
    } catch (error) {
      console.error('❌ [DEBUG] GoogleDriveUserStorage.saveQuiz error:', error);
      console.log('☁️ [DEBUG] Error details:', {
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
    console.log('📝 Quiz updated:', userData.quizzes[quizIndex].title);
  }

  static async deleteQuiz(quizId: string): Promise<boolean> {
    const userData = await this.loadUserData();
    if (!userData) return false;

    const index = userData.quizzes.findIndex(q => q.id === quizId);
    if (index === -1) return false;

    const deletedQuiz = userData.quizzes.splice(index, 1)[0];
    await this.saveUserData(userData);
    console.log('🗑️ Quiz deleted:', deletedQuiz.title);
    return true;
  }

  // Settings methods
  static async updateSettings(settings: Partial<UserData['settings']>): Promise<void> {
    const userData = await this.loadUserData();
    if (!userData) throw new Error('User data not found');

    userData.settings = { ...userData.settings, ...settings };
    await this.saveUserData(userData);
    console.log('⚙️ Settings updated');
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
    console.log('📊 Quiz session recorded');
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
    }));
  }

  // Import quiz from legacy format
  static async importLegacyQuiz(title: string, questions: QuizQuestion[], description?: string): Promise<string> {
    console.log('☁️ [DEBUG] GoogleDriveUserStorage.importLegacyQuiz called');
    console.log('☁️ [DEBUG] Parameters:', { title, questionsCount: questions.length, description });
    console.log('☁️ [DEBUG] Questions:', questions);
    
    try {
      console.log('☁️ [DEBUG] Converting legacy questions...');
      const enhancedQuestions = this.convertLegacyQuestions(questions);
      console.log('☁️ [DEBUG] Enhanced questions:', enhancedQuestions);
      console.log('☁️ [DEBUG] Enhanced questions count:', enhancedQuestions.length);
      
      const quizData = {
        title,
        description: description || 'Imported quiz',
        questions: enhancedQuestions,
        tags: ['imported'],
        category: 'General',
        difficulty: 'medium' as const,
        estimatedDuration: enhancedQuestions.reduce((total, q) => total + q.estimatedTime, 0),
      };
      
      console.log('☁️ [DEBUG] Quiz data to save:', quizData);
      console.log('☁️ [DEBUG] Calling saveQuiz...');
      
      const result = await this.saveQuiz(quizData);
      
      console.log('✅ [DEBUG] GoogleDriveUserStorage.importLegacyQuiz completed successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ [DEBUG] GoogleDriveUserStorage.importLegacyQuiz error:', error);
      console.log('☁️ [DEBUG] Error details:', {
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