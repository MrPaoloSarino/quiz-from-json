export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface QuizSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  questions: EnhancedQuizQuestion[];
  userAnswers: AnswerData[];
  confidenceRatings: number[];
  totalScore: number;
  timeSpent: number;
  difficulty: string;
  tags: string[];
}

export interface AnswerData {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  confidence: number; // 1-5 scale
  attempts: number;
  hintsUsed: number;
  timestamp: Date;
}

export interface EnhancedQuizQuestion {
  // Existing
  question: string;
  options?: string[];
  answer?: string;
  type?: 'multiple' | 'essay' | 'fill-blank' | 'drag-drop' | 'sequence' | 'matching';
  
  // NEW: Engagement & Analytics
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  category: string;
  estimatedTime: number; // seconds
  explanation?: string;
  hints?: string[];
  
  // NEW: Spaced Repetition
  lastSeen?: Date;
  attempts: number;
  successRate: number;
  nextReviewDate?: Date;
  
  // NEW: Learning Analytics
  averageTime: number;
  commonMistakes: string[];
  learningObjectives: string[];
}

export interface UserQuiz {
  id: string;
  title: string;
  description?: string;
  questions: EnhancedQuizQuestion[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isPublic?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  estimatedDuration?: number;
}

export interface UserData {
  profile: UserProfile;
  settings: {
    preferences: {
      aiPersonality: 'encouraging' | 'direct' | 'detailed';
      learningStyle: 'visual' | 'auditory' | 'kinesthetic';
      soundEnabled: boolean;
      volume: number;
      theme: 'light' | 'dark' | 'auto';
      language: string;
    };
    analytics: {
      totalQuestions: number;
      totalTime: number;
      streakDays: number;
      longestStreak: number;
      averageAccuracy: number;
      masteredTopics: string[];
      improvementAreas: string[];
      learningVelocity: number; // questions per hour
    };
  };
  quizzes: UserQuiz[];
  sessions: QuizSession[];
  achievements: Achievement[];
  level: number;
  xp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'streak' | 'accuracy' | 'volume' | 'improvement' | 'social';
  unlockedAt?: Date;
  progress?: number;
  target?: number;
} 