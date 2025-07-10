// Core Learning Types
export interface SpacedRepetitionConfig {
  initialInterval: number;  // in hours
  easeFactor: number;      // default 2.5
  intervalModifier: {
    perfect: number;       // 2.5
    good: number;         // 2.0
    medium: number;       // 1.5
    hard: number;         // 1.0
  };
  optimalSpacing: {
    easy: number;         // days
    medium: number;
    hard: number;
    struggling: number;
  };
}

export interface MemoryStage {
  sensory: {
    duration: number;     // in milliseconds
    capacity: number;     // items
    characteristics: string[];
  };
  shortTerm: {
    duration: number;     // in seconds
    capacity: number;     // items (7±2)
    characteristics: string[];
  };
  longTerm: {
    retentionRate: number;  // 0-1
    connections: number;    // number of related concepts
    lastReview: Date;
  };
}

export interface CognitiveLoadMetrics {
  intrinsic: {
    elementInteractivity: number;  // 0-1
    priorKnowledge: number;       // 0-1
    conceptualDifficulty: number; // 0-1
  };
  extraneous: {
    interfaceComplexity: number;  // 0-1
    distractions: number;        // 0-1
    presentationClarity: number; // 0-1
  };
  germane: {
    schemaConstruction: number;  // 0-1
    mentalModels: number;       // 0-1
    patternRecognition: number; // 0-1
  };
}

export interface MasteryLevel {
  level: 'novice' | 'advanced_beginner' | 'competent' | 'proficient' | 'expert';
  characteristics: string[];
  requirements: {
    accuracy: number;      // 0-1
    speed: number;        // relative to baseline
    consistency: number;  // 0-1
  };
  supportNeeded: string[];
}

export interface LearningProgress {
  currentLevel: MasteryLevel;
  masteryScore: number;        // 0-1
  retentionRate: number;       // 0-1
  confidenceScore: number;     // 1-5
  lastAssessment: Date;
  improvements: {
    date: Date;
    metric: string;
    change: number;
  }[];
}

export interface AdaptiveSettings {
  currentDifficulty: number;   // 0-1
  scaffoldingLevel: number;    // 0-1
  timeAllowed: number;         // in seconds
  hintAvailability: number;    // 0-1
  adaptationRules: {
    metric: string;
    threshold: number;
    adjustment: number;
  }[];
}

export interface FeedbackConfig {
  timing: 'immediate' | 'delayed';
  detail: 'basic' | 'detailed' | 'comprehensive';
  components: {
    correctness: boolean;
    explanation: boolean;
    examples: boolean;
    misconceptions: boolean;
    improvement: boolean;
  };
  style: 'encouraging' | 'neutral' | 'challenging';
}

export interface LearningAnalytics {
  performance: {
    accuracy: number;          // 0-1
    speed: number;            // relative to baseline
    consistency: number;      // 0-1
    improvement: number;      // change over time
  };
  cognitive: {
    loadLevel: number;        // 0-1
    attentionSpan: number;   // in minutes
    fatigueIndex: number;    // 0-1
    optimalTimes: string[];  // times of day
  };
  behavioral: {
    studyPatterns: {
      timeOfDay: string[];
      duration: number[];
      frequency: number;
    };
    strugglePoints: string[];
    revisionFrequency: number;
  };
}

// Add this type for assumptions
export interface Assumption {
  id: string;
  text: string;
  source?: string;
  confidence?: number;
  createdAt: Date;
  tags?: string[];
}

// Learning State Management
export interface LearningState {
  spacedRepetition: SpacedRepetitionConfig;
  memoryStage: MemoryStage;
  cognitiveLoad: CognitiveLoadMetrics;
  mastery: LearningProgress;
  adaptive: AdaptiveSettings;
  feedback: FeedbackConfig;
  analytics: LearningAnalytics;
  assumptions?: Assumption[];
}

// New: Generalized learning activity (not just quizzes)
export type LearningActivityType = 'quiz' | 'reflection' | 'project' | 'practice' | 'peer-feedback' | 'video' | 'custom';

export interface LearningActivity {
  id: string;
  type: LearningActivityType;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  skillIds?: string[];
  data: Record<string, unknown>; // Activity-specific data (e.g., answers, journal text, file refs)
  completed: boolean;
  evidenceUrls?: string[]; // Links to files, videos, etc.
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  dependencies?: string[]; // Prerequisite skills
  level: number; // 0-5 or 0-10 scale
  progress: number; // 0-1 mastery
  evidenceIds?: string[]; // LearningActivity ids that provide evidence
} 