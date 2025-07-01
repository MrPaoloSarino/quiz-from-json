import { EnhancedQuizQuestion, QuizSession, SpacedRepetitionData, LearningAnalytics } from '@/types/user';

// Debug categories with emojis
const DEBUG_CATEGORIES = {
  SPACED_REPETITION: '⏰',
  ACTIVE_RECALL: '🧠',
  INTERLEAVING: '🔄',
  ANALYTICS: '📊',
  STORAGE: '💾',
  SESSION: '📝',
  PERFORMANCE: '⚡',
  ERROR: '❌'
} as const;

interface DebugEvent {
  timestamp: Date;
  category: keyof typeof DEBUG_CATEGORIES;
  action: string;
  data?: any;
}

class DebugLogger {
  private static instance: DebugLogger;
  private events: DebugEvent[] = [];
  private startTime: Date = new Date();

  private constructor() {}

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  // Log spaced repetition events
  logSpacedRepetition(action: string, data: SpacedRepetitionData) {
    const event = {
      timestamp: new Date(),
      category: 'SPACED_REPETITION',
      action,
      data: {
        interval: data.interval,
        easeFactor: data.easeFactor,
        consecutiveCorrect: data.consecutiveCorrect,
        nextReview: data.nextReviewDate
      }
    };
    this.logEvent(event);
    console.log(`${DEBUG_CATEGORIES.SPACED_REPETITION} [SPACED] ${action}:`, data);
  }

  // Log active recall events
  logActiveRecall(action: string, success: boolean, timeSpent: number) {
    const event = {
      timestamp: new Date(),
      category: 'ACTIVE_RECALL',
      action,
      data: { success, timeSpent }
    };
    this.logEvent(event);
    console.log(`${DEBUG_CATEGORIES.ACTIVE_RECALL} [RECALL] ${action}:`, { success, timeSpent: `${timeSpent}s` });
  }

  // Log interleaving events
  logInterleaving(action: string, topics: string[]) {
    const event = {
      timestamp: new Date(),
      category: 'INTERLEAVING',
      action,
      data: { topics }
    };
    this.logEvent(event);
    console.log(`${DEBUG_CATEGORIES.INTERLEAVING} [INTERLEAVE] ${action}:`, topics);
  }

  // Log analytics events
  logAnalytics(action: string, analytics: LearningAnalytics) {
    const event = {
      timestamp: new Date(),
      category: 'ANALYTICS',
      action,
      data: {
        strengthScore: analytics.strengthScore,
        recallSuccess: analytics.recallSuccesses / analytics.recallAttempts,
        averageTime: analytics.averageRecallTime
      }
    };
    this.logEvent(event);
    console.log(`${DEBUG_CATEGORIES.ANALYTICS} [ANALYTICS] ${action}:`, event.data);
  }

  // Log storage events
  logStorage(action: string, data: any) {
    const event = {
      timestamp: new Date(),
      category: 'STORAGE',
      action,
      data
    };
    this.logEvent(event);
    console.log(`${DEBUG_CATEGORIES.STORAGE} [STORAGE] ${action}:`, data);
  }

  // Log session events
  logSession(action: string, session: Partial<QuizSession>) {
    const event = {
      timestamp: new Date(),
      category: 'SESSION',
      action,
      data: {
        duration: session.endTime ? 
          (new Date(session.endTime).getTime() - new Date(session.startTime!).getTime()) / 1000 : 
          undefined,
        score: session.totalScore,
        questionCount: session.questions?.length,
        strategies: session.strategiesUsed
      }
    };
    this.logEvent(event);
    console.log(`${DEBUG_CATEGORIES.SESSION} [SESSION] ${action}:`, event.data);
  }

  // Log performance metrics
  logPerformance(action: string, metrics: any) {
    const event = {
      timestamp: new Date(),
      category: 'PERFORMANCE',
      action,
      data: metrics
    };
    this.logEvent(event);
    console.log(`${DEBUG_CATEGORIES.PERFORMANCE} [PERF] ${action}:`, metrics);
  }

  // Log errors
  logError(action: string, error: Error) {
    const event = {
      timestamp: new Date(),
      category: 'ERROR',
      action,
      data: {
        message: error.message,
        stack: error.stack
      }
    };
    this.logEvent(event);
    console.error(`${DEBUG_CATEGORIES.ERROR} [ERROR] ${action}:`, error);
  }

  // Get session summary
  getSessionSummary(): any {
    const now = new Date();
    const duration = (now.getTime() - this.startTime.getTime()) / 1000;
    
    const eventsByCategory = Object.keys(DEBUG_CATEGORIES).reduce((acc, category) => {
      acc[category] = this.events.filter(e => e.category === category).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      sessionDuration: duration,
      totalEvents: this.events.length,
      eventsByCategory,
      startTime: this.startTime,
      endTime: now
    };
  }

  // Clear events
  clearEvents() {
    this.events = [];
    this.startTime = new Date();
  }

  private logEvent(event: DebugEvent) {
    this.events.push(event);
  }
}

// Export singleton instance
export const Debug = DebugLogger.getInstance();

// Helper functions for common debug patterns
export const debugSpacedRepetition = (question: EnhancedQuizQuestion) => {
  Debug.logSpacedRepetition('Question Review', question.spacedRepetition);
};

export const debugActiveRecall = (success: boolean, timeSpent: number) => {
  Debug.logActiveRecall('Recall Attempt', success, timeSpent);
};

export const debugInterleaving = (currentTopic: string, relatedTopics: string[]) => {
  Debug.logInterleaving('Topic Mix', [currentTopic, ...relatedTopics]);
};

export const debugAnalytics = (question: EnhancedQuizQuestion) => {
  Debug.logAnalytics('Update Analytics', question.analytics);
};

export const debugSession = (session: Partial<QuizSession>) => {
  Debug.logSession('Session Update', session);
};

export const debugError = (action: string, error: Error) => {
  Debug.logError(action, error);
}; 