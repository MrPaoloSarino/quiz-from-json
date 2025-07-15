// Skill Acquisition Types - Neuroscience-backed learning system

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: string;
  level: number; // 1-10 mastery level
  dependencies: string[]; // IDs of prerequisite skills
  microSkills: MicroSkill[];
  completionCriteria: CompletionCriteria[];
  estimatedHours: number;
  realWorldTests: RealWorldTest[];
  // Enhanced date tracking
  startDate: Date;
  targetCompletionDate: Date;
  actualStartDate?: Date;
  actualCompletionDate?: Date;
  milestones: Milestone[];
  schedule: SkillSchedule;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  actualDate?: Date;
  completed: boolean;
  type: 'micro-skill' | 'review' | 'test' | 'project' | 'integration';
  dependencies: string[]; // Other milestone IDs
}

export interface SkillSchedule {
  startDate: Date;
  endDate: Date;
  weeklyHours: number;
  preferredDays: string[]; // ['monday', 'tuesday', etc.]
  preferredTimes: string[]; // ['morning', 'afternoon', 'evening']
  breaks: Break[];
  reviewCycles: ReviewCycle[];
}

export interface Break {
  startDate: Date;
  endDate: Date;
  reason: string;
  type: 'vacation' | 'illness' | 'other';
}

export interface ReviewCycle {
  type: 'daily' | 'weekly' | 'monthly';
  nextReview: Date;
  lastReview?: Date;
  interval: number; // days
}

export interface MicroSkill {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timeEstimate: number; // minutes
  practiceProtocols: PracticeProtocol[];
  selfTests: SelfTest[];
  masteryIndicators: string[];
  // Enhanced scheduling
  startDate: Date;
  targetDate: Date;
  actualStartDate?: Date;
  actualCompletionDate?: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  progress: number; // 0-100
}

export interface CompletionCriteria {
  id: string;
  description: string;
  type: 'performance' | 'knowledge' | 'application' | 'teaching';
  threshold: number; // 0-100%
  measurement: 'accuracy' | 'speed' | 'consistency' | 'quality';
  evidenceRequired: boolean;
  targetDate: Date;
  actualDate?: Date;
  completed: boolean;
}

export interface RealWorldTest {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timeLimit?: number; // minutes
  successCriteria: string[];
  failureModes: string[];
  environment: string;
  scheduledDate: Date;
  actualDate?: Date;
  completed: boolean;
  result?: 'pass' | 'fail' | 'partial';
}

export interface PracticeProtocol {
  id: string;
  name: string;
  type: 'deliberate' | 'simulation' | 'review' | 'benchmark' | 'flow';
  duration: number; // minutes
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  instructions: string[];
  materials: string[];
  successMetrics: string[];
  flowTriggers: FlowTrigger[];
  // Enhanced scheduling
  scheduledSessions: ScheduledSession[];
  lastCompleted?: Date;
  nextScheduled?: Date;
}

export interface ScheduledSession {
  id: string;
  date: Date;
  duration: number; // minutes
  type: PracticeProtocol['type'];
  completed: boolean;
  actualDuration?: number;
  quality?: number; // 1-10
  notes?: string;
}

export interface FlowTrigger {
  type: 'difficulty' | 'novelty' | 'feedback' | 'time' | 'environment';
  value: string;
  description: string;
}

export interface SelfTest {
  id: string;
  name: string;
  type: 'quiz' | 'performance' | 'reflection' | 'peer-review';
  questions: TestQuestion[];
  passingScore: number; // 0-100%
  timeLimit?: number; // minutes
  retryPolicy: 'immediate' | '24h' | 'weekly' | 'never';
  scheduledDate: Date;
  actualDate?: Date;
  completed: boolean;
  score?: number;
  attempts: number;
}

export interface TestQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'essay' | 'performance' | 'reflection';
  options?: string[];
  correctAnswer?: string;
  rubric?: string[];
  points: number;
}

// Flow State Tracking
export interface FlowSession {
  id: string;
  skillId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  flowScore: number; // 0-10
  conditions: FlowCondition[];
  notes: string;
  breakthroughs: string[];
  frictionPoints: string[];
  scheduledDate?: Date; // If this was a planned session
}

export interface FlowCondition {
  difficulty: number; // 1-10
  novelty: number; // 1-10
  feedback: number; // 1-10
  timeOfDay: string;
  environment: string;
  energy: number; // 1-10
  focus: number; // 1-10
  arousal: number; // 1-10
}

// Performance Metrics
export interface PerformanceMetrics {
  skillId: string;
  date: Date;
  timeSpent: number; // minutes
  sessionQuality: number; // 0-10
  retentionScore: number; // 0-10
  challengePassRate: number; // 0-1
  flowTime: number; // minutes
  improvements: PerformanceImprovement[];
  scheduledDate?: Date; // If this was a planned session
}

export interface PerformanceImprovement {
  date: Date;
  metric: string;
  change: number;
  description: string;
}

// Skill Journal
export interface SkillJournalEntry {
  id: string;
  skillId: string;
  date: Date;
  title: string;
  content: string;
  framework?: 'OODA' | 'PDCA' | 'WSW' | 'custom';
  frameworkData?: Record<string, any>;
  tags: string[];
  linkedNodes: string[]; // Skill node IDs
  attachments: string[]; // File URLs
  scheduledDate?: Date; // If this was a planned reflection
}

// Environment Priming
export interface EnvironmentSetup {
  id: string;
  name: string;
  description: string;
  prePracticeRituals: Ritual[];
  sensoryTuning: SensoryTuning;
  mentalReset: MentalReset[];
  optimalConditions: OptimalCondition[];
  scheduledDate?: Date; // When this setup should be used
}

export interface Ritual {
  name: string;
  duration: number; // minutes
  description: string;
  type: 'physical' | 'mental' | 'environmental';
}

export interface SensoryTuning {
  music?: string;
  scent?: string;
  lighting?: string;
  posture?: string;
  temperature?: string;
  noise?: string;
}

export interface MentalReset {
  name: string;
  technique: string;
  duration: number; // minutes
  type: 'breathing' | 'movement' | 'meditation' | 'walking';
}

export interface OptimalCondition {
  timeOfDay: string;
  duration: number; // minutes
  energy: number; // 1-10
  environment: string;
  successRate: number; // 0-1
}

// Skill Tree Structure
export interface SkillTree {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: SkillNode[];
  connections: SkillConnection[];
  // Enhanced project management
  startDate: Date;
  targetEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'abandoned';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

export interface SkillConnection {
  from: string; // Skill node ID
  to: string; // Skill node ID
  type: 'prerequisite' | 'related' | 'progression';
  strength: number; // 0-1
}

// User Progress Tracking
export interface SkillProgress {
  skillId: string;
  userId: string;
  currentLevel: number; // 0-10
  masteryScore: number; // 0-1
  timeInvested: number; // total minutes
  sessionsCompleted: number;
  lastPractice: Date;
  nextReview: Date;
  // Enhanced scheduling
  startDate: Date;
  targetCompletionDate: Date;
  actualStartDate?: Date;
  actualCompletionDate?: Date;
  weeklyGoal: number; // hours
  currentWeekProgress: number; // hours
  streak: number; // consecutive days
  flowSessions: FlowSession[];
  performanceHistory: PerformanceMetrics[];
  journalEntries: SkillJournalEntry[];
  environmentSetups: EnvironmentSetup[];
  // Gantt chart data
  ganttData: GanttTask[];
}

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number; // 0-100
  dependencies: string[]; // Task IDs
  type: 'skill' | 'milestone' | 'review' | 'test';
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  actualStart?: Date;
  actualEnd?: Date;
}

// Habit Formation
export interface HabitLoop {
  id: string;
  skillId: string;
  cue: string;
  routine: string;
  reward: string;
  difficulty: number; // 1-10
  consistency: number; // 0-1
  streak: number;
  lastPerformed: Date;
  nextDue: Date;
  startDate: Date;
  targetDate: Date;
}

// Learning Analytics
export interface SkillAnalytics {
  skillId: string;
  timeSeries: {
    date: Date;
    timeSpent: number;
    quality: number;
    flowTime: number;
    retention: number;
  }[];
  patterns: {
    optimalTimes: string[];
    sessionLength: number;
    frequency: number;
    improvementRate: number;
  };
  insights: {
    type: 'breakthrough' | 'plateau' | 'regression' | 'consistency';
    description: string;
    date: Date;
    impact: number; // 0-1
  }[];
  // Enhanced date analytics
  timeline: {
    startDate: Date;
    milestones: {
      date: Date;
      type: string;
      description: string;
      achieved: boolean;
    }[];
    projectedCompletion: Date;
    actualCompletion?: Date;
  };
}

// Calendar and Scheduling
export interface SkillCalendar {
  skillId: string;
  events: CalendarEvent[];
  recurringSessions: RecurringSession[];
  availability: Availability[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: 'practice' | 'review' | 'test' | 'milestone' | 'break';
  skillId: string;
  completed: boolean;
  notes?: string;
}

export interface RecurringSession {
  id: string;
  title: string;
  skillId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:MM
  duration: number; // minutes
  active: boolean;
  startDate: Date;
  endDate?: Date;
}

export interface Availability {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  available: boolean;
  preferred: boolean;
} 