/**
 * Project-based study management types
 * Central hub for exam/licensure/test preparation
 */

export interface StudyProject {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Progress tracking
  overallProgress: number; // 0-100
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  averageAccuracy: number;
  totalStudyTime: number; // minutes
  
  // Consistency tracking
  studyStreak: number; // consecutive days
  weeklyGoal: number; // minutes per day
  weeklyProgress: WeeklyProgress[];
  lastStudyDate?: Date;
  
  // Subject breakdown
  subjects: SubjectProgress[];
  
  // Checklists
  masterChecklist: ChecklistItem[];
  weeklyTasks: WeeklyTask[];
  
  // Analytics
  accuracyTrend: DataPoint[];
  difficultyDistribution: DifficultyStats;
  timeAnalytics: TimeStats;
  weakAreas: WeakArea[];
  
  // Settings
  isArchived: boolean;
  color?: string; // for visual distinction
}

export interface SubjectProgress {
  id: string;
  name: string;
  progress: number; // 0-100
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  quizzesTaken: number;
  averageAccuracy: number;
  hardModeQuizzes: number;
  timeSpent: number; // minutes
  needsAttention: boolean;
  lastPracticed?: Date;
}

export interface WeeklyProgress {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  daysCompleted: boolean[]; // 7 days [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  dailyMinutes: number[]; // minutes per day
  totalMinutes: number;
  goalMet: boolean;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  progress?: number; // for items with sub-progress (0-100)
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface WeeklyTask {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  description: string;
  targetQuestions: number;
  targetMinutes?: number;
  completed: boolean;
  actualQuestions?: number;
  actualAccuracy?: number;
  actualMinutes?: number;
  completedAt?: Date;
}

export interface DataPoint {
  date: Date;
  value: number;
  label?: string;
}

export interface DifficultyStats {
  easy: {
    count: number;
    averageAccuracy: number;
  };
  medium: {
    count: number;
    averageAccuracy: number;
  };
  hard: {
    count: number;
    averageAccuracy: number;
  };
}

export interface TimeStats {
  averagePerQuestion: number; // minutes
  fastestQuestion: number;
  slowestQuestion: number;
  peakPerformanceTime?: string; // e.g., "9-11 AM"
  totalSessions: number;
  averageSessionLength: number; // minutes
}

export interface WeakArea {
  id: string;
  topic: string;
  subjectId: string;
  accuracy: number;
  questionsAttempted: number;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  lastReviewed?: Date;
}

export interface ProjectStats {
  daysRemaining: number;
  progressPercentage: number;
  onTrack: boolean;
  recommendedDailyQuestions: number;
  estimatedCompletionDate: Date;
}

// Helper type for creating new projects
export type CreateProjectInput = Pick<StudyProject, 'name' | 'description' | 'targetDate'> & {
  weeklyGoal?: number;
  subjects?: string[]; // subject names
};

// Helper type for updating projects
export type UpdateProjectInput = Partial<Omit<StudyProject, 'id' | 'createdAt'>>;
