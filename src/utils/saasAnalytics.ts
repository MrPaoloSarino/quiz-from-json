// Professional SaaS Analytics System
export interface AnalyticsEvent {
  id: string;
  userId: string;
  event: string;
  properties: Record<string, unknown>;
  timestamp: Date;
  sessionId: string;
}

export interface UserMetrics {
  totalQuizzes: number;
  totalQuestions: number;
  totalTimeSpent: number;
  averageAccuracy: number;
  streakDays: number;
  longestStreak: number;
  lastActiveDate: Date;
  signupDate: Date;
  subscriptionIntent: 'none' | 'interested' | 'dismissed' | 'converted';
  engagementScore: number;
  learningVelocity: number;
}

class SaaSAnalytics {
  private sessionId: string;
  private userId: string;
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.loadStoredEvents();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string {
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  private loadStoredEvents(): void {
    try {
      const stored = localStorage.getItem('saas_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored analytics events:', error);
    }
  }

  private track(event: string, properties: Record<string, unknown> = {}): void {
    const analyticsEvent: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.userId,
      event,
      properties,
      timestamp: new Date(),
      sessionId: this.sessionId,
    };

    this.events.push(analyticsEvent);
    try {
      localStorage.setItem('saas_analytics_events', JSON.stringify(this.events.slice(-1000)));
    } catch (error) {
      console.warn('Failed to save analytics events:', error);
    }
  }

  trackQuizStart(data: { title: string; questionCount: number }): void {
    this.track('quiz_start', data);
  }

  trackQuizComplete(data: { score: number; totalQuestions: number; timeSpent: number }): void {
    this.track('quiz_complete', data);
  }

  trackFeatureUsage(feature: string): void {
    this.track('feature_usage', { feature });
  }

  trackSubscriptionIntent(intent: 'interested' | 'dismissed', source: string): void {
    this.track('subscription_intent', { intent, source });
  }

  getUserMetrics(): UserMetrics {
    try {
      const stored = localStorage.getItem('user_metrics');
      if (stored) {
        const metrics = JSON.parse(stored);
        return {
          ...metrics,
          lastActiveDate: new Date(metrics.lastActiveDate),
          signupDate: new Date(metrics.signupDate),
        };
      }
    } catch (error) {
      console.warn('Failed to load user metrics:', error);
    }

    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      totalTimeSpent: 0,
      averageAccuracy: 0,
      streakDays: 0,
      longestStreak: 0,
      lastActiveDate: new Date(),
      signupDate: new Date(),
      subscriptionIntent: 'none',
      engagementScore: 0,
      learningVelocity: 0,
    };
  }

  updateUserMetrics(updates: Partial<UserMetrics>): void {
    const current = this.getUserMetrics();
    const updated = { ...current, ...updates, lastActiveDate: new Date() };
    
    // Calculate engagement score
    updated.engagementScore = this.calculateEngagementScore(updated);
    
    localStorage.setItem('user_metrics', JSON.stringify(updated));
  }

  private calculateEngagementScore(metrics: UserMetrics): number {
    let score = 0;
    score += Math.min(metrics.totalQuizzes * 5, 30);
    score += Math.min(metrics.averageAccuracy * 20, 20);
    score += Math.min(metrics.streakDays * 3, 25);
    score += Math.min(metrics.learningVelocity * 2, 15);
    
    const daysSinceActive = (Date.now() - metrics.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActive < 1) score += 10;
    
    return Math.min(Math.round(score), 100);
  }

  getEngagementInsights(): {
    level: 'low' | 'medium' | 'high';
    suggestions: string[];
    achievements: string[];
  } {
    const metrics = this.getUserMetrics();
    const score = metrics.engagementScore;
    
    let level: 'low' | 'medium' | 'high' = 'low';
    const suggestions: string[] = [];
    const achievements: string[] = [];
    
    if (score >= 70) {
      level = 'high';
      achievements.push('Super Learner! 🌟');
      suggestions.push('Try creating your own quizzes');
    } else if (score >= 40) {
      level = 'medium';
      achievements.push('Making Great Progress! 📈');
      suggestions.push('Try to maintain a daily learning streak');
    } else {
      suggestions.push('Take a few quizzes to get started');
      suggestions.push('Set up a daily learning goal');
    }
    
    if (metrics.streakDays >= 7) achievements.push('7-Day Streak Master! 🔥');
    if (metrics.totalQuizzes >= 10) achievements.push('Quiz Explorer! 🎯');
    if (metrics.averageAccuracy >= 0.8) achievements.push('Accuracy Expert! ✨');
    
    return { level, suggestions, achievements };
  }


}

export const analytics = new SaaSAnalytics();
