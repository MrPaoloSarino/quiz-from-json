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
  interleaved: boolean;
  spacingInterval: number;
  activeRecallSuccess: number;
  elaborationCount: number;
  retentionScore: number;
  strategiesUsed: {
    activeRecall: boolean;
    spacedRepetition: boolean;
    interleaving: boolean;
    elaboration: boolean;
    feynmanTechnique: boolean;
  };
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

export interface SpacedRepetitionData {
  lastReviewDate: Date;
  nextReviewDate: Date;
  interval: number;  // Days until next review
  easeFactor: number;  // Multiplier for interval adjustments
  consecutiveCorrect: number;
  reviewHistory: ReviewHistoryEntry[];
}

export interface ReviewHistoryEntry {
  date: Date;
  performance: 'again' | 'hard' | 'good' | 'easy';
  timeSpent: number;
  confidence: number;
  isCorrect: boolean;
}

export interface LearningAnalytics {
  strengthScore: number;  // 0-1 mastery level
  lastRecallSuccess: boolean;
  recallAttempts: number;
  recallSuccesses: number;
  averageRecallTime: number;
  lastInterleaved: Date;  // Last time practiced with other topics
  relatedConcepts: string[];  // For interleaving practice
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
  
  // Enhanced Spaced Repetition
  spacedRepetition: SpacedRepetitionData;
  
  // Enhanced Learning Analytics
  analytics: LearningAnalytics;
  
  // Active Recall Support
  activeRecallPrompts: string[];  // Questions to test understanding
  elaborations: string[];  // User explanations/notes
  feynmanExplanation?: string;  // Simple explanation in user's words
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
  learningStats: {
    // Existing analytics...
    
    // Spaced Repetition Stats
    averageRetentionRate: number;
    optimalReviewIntervals: { [difficulty: string]: number };
    topicsForReview: string[];
    
    // Active Recall Stats
    activeRecallSuccess: number;
    elaborationQuality: number;
    interleavingStrength: number;
    
    // Learning Velocity
    retentionTrend: number[];  // Historical retention scores
    masteryProgress: { [topic: string]: number };  // 0-1 mastery level per topic
  };
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