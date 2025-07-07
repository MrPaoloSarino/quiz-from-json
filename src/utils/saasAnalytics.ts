// Professional SaaS Analytics System - Enhanced Version
export interface AnalyticsEvent {
  id: string;
  userId: string;
  event: string;
  properties: Record<string, unknown>;
  timestamp: Date;
  sessionId: string;
  deviceInfo?: DeviceInfo;
  location?: string;
  version?: string;
}

export interface DeviceInfo {
  platform: string;
  browser: string;
  viewport: { width: number; height: number };
  userAgent: string;
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
  // Enhanced metrics
  masteryLevels: Record<string, number>;
  weakestTopics: string[];
  strongestTopics: string[];
  learningPatterns: LearningPattern[];
  retentionRate: number;
  improvementRate: number;
  consistencyScore: number;
}

export interface LearningPattern {
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6
  accuracy: number;
  speed: number;
  engagement: number;
}

export interface AdvancedInsights {
  recommendedStudyTime: string;
  optimalSessionLength: number;
  nextReviewTopics: string[];
  learningTrend: 'improving' | 'stable' | 'declining';
  predictedMastery: Record<string, number>;
  personalizedTips: string[];
}

class SaaSAnalytics {
  private sessionId: string;
  private userId: string;
  private events: AnalyticsEvent[] = [];
  private sessionStartTime: number;
  private isOnline: boolean = navigator.onLine;
  private pendingEvents: AnalyticsEvent[] = [];
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.sessionStartTime = Date.now();
    this.loadStoredEvents();
    this.initializeEventListeners();
    this.startSessionTracking();
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

  private initializeEventListeners(): void {
    // Online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushPendingEvents();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Page visibility for engagement tracking
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('session_pause', { timestamp: Date.now() });
      } else {
        this.track('session_resume', { timestamp: Date.now() });
      }
    });

    // Beforeunload for session end
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  private startSessionTracking(): void {
    this.track('session_start', {
      timestamp: this.sessionStartTime,
      deviceInfo: this.getDeviceInfo(),
      referrer: document.referrer
    });
  }

  private endSession(): void {
    const sessionDuration = Date.now() - this.sessionStartTime;
    this.track('session_end', {
      duration: sessionDuration,
      timestamp: Date.now()
    });
  }

  private getDeviceInfo(): DeviceInfo {
    return {
      platform: navigator.platform,
      browser: this.getBrowserInfo(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      userAgent: navigator.userAgent
    };
  }

  private getBrowserInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private loadStoredEvents(): void {
    try {
      const stored = localStorage.getItem('saas_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored).map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load stored analytics events:', error);
      this.events = [];
    }
  }

  private validateEvent(event: string, properties: Record<string, unknown>): boolean {
    if (!event || typeof event !== 'string') return false;
    if (properties && typeof properties !== 'object') return false;
    return true;
  }

  private track(event: string, properties: Record<string, unknown> = {}): void {
    if (!this.validateEvent(event, properties)) {
      console.warn('Invalid analytics event:', { event, properties });
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.userId,
      event,
      properties: this.sanitizeProperties(properties),
      timestamp: new Date(),
      sessionId: this.sessionId,
      deviceInfo: this.getDeviceInfo(),
      version: '1.0.0'
    };

    this.events.push(analyticsEvent);
    
    if (this.isOnline) {
      this.persistEvents();
    } else {
      this.pendingEvents.push(analyticsEvent);
    }
  }

  private sanitizeProperties(properties: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(properties)) {
      if (value !== undefined && value !== null) {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private persistEvents(): void {
    try {
      // Keep only last 1000 events to prevent storage bloat
      const eventsToStore = this.events.slice(-1000);
      localStorage.setItem('saas_analytics_events', JSON.stringify(eventsToStore));
    } catch (error) {
      console.warn('Failed to save analytics events:', error);
    }
  }

  private flushPendingEvents(): void {
    if (this.pendingEvents.length > 0) {
      this.events.push(...this.pendingEvents);
      this.pendingEvents = [];
      this.persistEvents();
    }
  }

  // Enhanced tracking methods
  trackQuizStart(data: { title: string; questionCount: number; difficulty?: string; category?: string }): void {
    this.track('quiz_start', {
      ...data,
      startTime: Date.now()
    });
  }

  trackQuestionAnswer(data: { 
    questionId: string; 
    answer: string; 
    correct: boolean; 
    timeSpent: number;
    difficulty?: string;
    category?: string;
  }): void {
    this.track('question_answer', data);
  }

  trackQuizComplete(data: { 
    quizId: string;
    score: number; 
    totalQuestions: number; 
    timeSpent: number;
    accuracy: number;
    difficulty?: string;
    category?: string;
  }): void {
    this.track('quiz_complete', data);
    this.updateUserMetricsFromQuiz(data);
  }

  trackLearningMilestone(milestone: string, data: Record<string, unknown> = {}): void {
    this.track('learning_milestone', { milestone, ...data });
  }

  trackFeatureUsage(feature: string, context: Record<string, unknown> = {}): void {
    this.track('feature_usage', { feature, ...context });
  }

  trackError(error: string, context: Record<string, unknown> = {}): void {
    this.track('error_occurred', { error, ...context });
  }

  trackSubscriptionIntent(intent: 'interested' | 'dismissed', source: string): void {
    this.track('subscription_intent', { intent, source });
  }

  // Enhanced metrics calculation
  private updateUserMetricsFromQuiz(quizData: any): void {
    const current = this.getUserMetrics();
    const updates: Partial<UserMetrics> = {
      totalQuizzes: current.totalQuizzes + 1,
      totalQuestions: current.totalQuestions + quizData.totalQuestions,
      totalTimeSpent: current.totalTimeSpent + quizData.timeSpent,
      averageAccuracy: this.calculateRunningAverage(
        current.averageAccuracy, 
        quizData.accuracy, 
        current.totalQuizzes + 1
      )
    };

    // Update streak
    const today = new Date().toDateString();
    const lastActive = current.lastActiveDate.toDateString();
    if (today !== lastActive) {
      const daysDiff = Math.floor((Date.now() - current.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        updates.streakDays = current.streakDays + 1;
        updates.longestStreak = Math.max(current.longestStreak, updates.streakDays);
      } else if (daysDiff > 1) {
        updates.streakDays = 1;
      }
    }

    this.updateUserMetrics(updates);
  }

  private calculateRunningAverage(currentAvg: number, newValue: number, count: number): number {
    return ((currentAvg * (count - 1)) + newValue) / count;
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
      masteryLevels: {},
      weakestTopics: [],
      strongestTopics: [],
      learningPatterns: [],
      retentionRate: 0,
      improvementRate: 0,
      consistencyScore: 0,
    };
  }

  updateUserMetrics(updates: Partial<UserMetrics>): void {
    const current = this.getUserMetrics();
    const updated = { 
      ...current, 
      ...updates, 
      lastActiveDate: new Date() 
    };
    
    // Calculate enhanced metrics
    updated.engagementScore = this.calculateEngagementScore(updated);
    updated.learningVelocity = this.calculateLearningVelocity(updated);
    updated.consistencyScore = this.calculateConsistencyScore();
    updated.improvementRate = this.calculateImprovementRate();
    
    localStorage.setItem('user_metrics', JSON.stringify(updated));
  }

  private calculateEngagementScore(metrics: UserMetrics): number {
    let score = 0;
    
    // Quiz frequency (30%)
    score += Math.min(metrics.totalQuizzes * 3, 30);
    
    // Accuracy (25%)
    score += metrics.averageAccuracy * 25;
    
    // Streak consistency (20%)
    score += Math.min(metrics.streakDays * 2.5, 20);
    
    // Learning velocity (15%)
    score += Math.min(metrics.learningVelocity * 15, 15);
    
    // Recency (10%)
    const daysSinceActive = (Date.now() - metrics.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActive < 1) score += 10;
    else if (daysSinceActive < 3) score += 5;
    
    return Math.min(Math.round(score), 100);
  }

  private calculateLearningVelocity(metrics: UserMetrics): number {
    const daysSinceSignup = Math.max(1, (Date.now() - metrics.signupDate.getTime()) / (1000 * 60 * 60 * 24));
    return metrics.totalQuestions / daysSinceSignup;
  }

  private calculateConsistencyScore(): number {
    const recent = this.getRecentEvents(7); // Last 7 days
    const dailyActivity = new Map<string, number>();
    
    recent.forEach(event => {
      const day = event.timestamp.toDateString();
      dailyActivity.set(day, (dailyActivity.get(day) || 0) + 1);
    });
    
    const activeDays = dailyActivity.size;
    return Math.min((activeDays / 7) * 100, 100);
  }

  private calculateImprovementRate(): number {
    const quizEvents = this.events.filter(e => e.event === 'quiz_complete');
    if (quizEvents.length < 2) return 0;
    
    const recent = quizEvents.slice(-5);
    const older = quizEvents.slice(-10, -5);
    
    if (older.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, e) => sum + (e.properties.accuracy as number || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, e) => sum + (e.properties.accuracy as number || 0), 0) / older.length;
    
    return ((recentAvg - olderAvg) / olderAvg) * 100;
  }

  getAdvancedInsights(): AdvancedInsights {
    const patterns = this.analyzeLearningPatterns();
    const metrics = this.getUserMetrics();
    
    return {
      recommendedStudyTime: this.getOptimalStudyTime(patterns),
      optimalSessionLength: this.getOptimalSessionLength(),
      nextReviewTopics: this.getTopicsForReview(),
      learningTrend: this.getLearningTrend(),
      predictedMastery: this.predictMasteryLevels(),
      personalizedTips: this.generatePersonalizedTips(metrics)
    };
  }

  private analyzeLearningPatterns(): LearningPattern[] {
    const patterns: LearningPattern[] = [];
    const events = this.getRecentEvents(30);
    
    for (let hour = 0; hour < 24; hour++) {
      for (let day = 0; day < 7; day++) {
        const relevantEvents = events.filter(e => {
          const date = e.timestamp;
          return date.getHours() === hour && date.getDay() === day;
        });
        
        if (relevantEvents.length > 0) {
          patterns.push({
            timeOfDay: hour,
            dayOfWeek: day,
            accuracy: this.calculateAverageAccuracy(relevantEvents),
            speed: this.calculateAverageSpeed(relevantEvents),
            engagement: this.calculateEngagementForEvents(relevantEvents)
          });
        }
      }
    }
    
    return patterns;
  }

  private getRecentEvents(days: number): AnalyticsEvent[] {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.events.filter(e => e.timestamp.getTime() > cutoff);
  }

  private calculateAverageAccuracy(events: AnalyticsEvent[]): number {
    const accuracies = events
      .filter(e => e.properties.accuracy !== undefined)
      .map(e => e.properties.accuracy as number);
    
    return accuracies.length > 0 
      ? accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length 
      : 0;
  }

  private calculateAverageSpeed(events: AnalyticsEvent[]): number {
    const speeds = events
      .filter(e => e.properties.timeSpent !== undefined)
      .map(e => e.properties.timeSpent as number);
    
    return speeds.length > 0 
      ? speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length 
      : 0;
  }

  private calculateEngagementForEvents(events: AnalyticsEvent[]): number {
    return events.length; // Simple engagement metric based on activity count
  }

  private getOptimalStudyTime(patterns: LearningPattern[]): string {
    if (patterns.length === 0) return 'Morning (9-11 AM)';
    
    const bestPattern = patterns.reduce((best, current) => 
      current.accuracy > best.accuracy ? current : best
    );
    
    const hour = bestPattern.timeOfDay;
    if (hour < 12) return `Morning (${hour}:00 AM)`;
    if (hour < 17) return `Afternoon (${hour - 12 || 12}:00 PM)`;
    return `Evening (${hour - 12}:00 PM)`;
  }

  private getOptimalSessionLength(): number {
    const sessions = this.events.filter(e => e.event === 'session_end');
    if (sessions.length === 0) return 25; // Default 25 minutes
    
    const durations = sessions.map(s => s.properties.duration as number);
    return Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length / 60000); // Convert to minutes
  }

  private getTopicsForReview(): string[] {
    const metrics = this.getUserMetrics();
    return metrics.weakestTopics.slice(0, 3);
  }

  private getLearningTrend(): 'improving' | 'stable' | 'declining' {
    const improvementRate = this.calculateImprovementRate();
    if (improvementRate > 5) return 'improving';
    if (improvementRate < -5) return 'declining';
    return 'stable';
  }

  private predictMasteryLevels(): Record<string, number> {
    // Simple prediction based on current trends
    const metrics = this.getUserMetrics();
    const prediction: Record<string, number> = {};
    
    Object.entries(metrics.masteryLevels).forEach(([topic, level]) => {
      const improvement = this.calculateImprovementRate() / 100;
      prediction[topic] = Math.min(1, level + improvement);
    });
    
    return prediction;
  }

  private generatePersonalizedTips(metrics: UserMetrics): string[] {
    const tips: string[] = [];
    
    if (metrics.averageAccuracy < 0.7) {
      tips.push('Focus on reviewing incorrect answers to improve accuracy');
    }
    
    if (metrics.streakDays < 3) {
      tips.push('Try to establish a daily learning routine');
    }
    
    if (metrics.learningVelocity < 1) {
      tips.push('Consider shorter, more frequent study sessions');
    }
    
    if (metrics.consistencyScore < 50) {
      tips.push('Set specific times for learning to build consistency');
    }
    
    return tips.slice(0, 3);
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
      suggestions.push('Help others by sharing your knowledge');
    } else if (score >= 40) {
      level = 'medium';
      achievements.push('Making Great Progress! 📈');
      suggestions.push('Try to maintain a daily learning streak');
      suggestions.push('Explore more challenging topics');
    } else {
      suggestions.push('Take a few quizzes to get started');
      suggestions.push('Set up a daily learning goal');
      suggestions.push('Focus on topics you enjoy');
    }
    
    if (metrics.streakDays >= 7) achievements.push('7-Day Streak Master! 🔥');
    if (metrics.totalQuizzes >= 10) achievements.push('Quiz Explorer! 🎯');
    if (metrics.averageAccuracy >= 0.8) achievements.push('Accuracy Expert! ✨');
    if (metrics.consistencyScore >= 80) achievements.push('Consistency Champion! ⚡');
    
    return { level, suggestions, achievements };
  }

  // Export data for analysis
  exportData(): { events: AnalyticsEvent[]; metrics: UserMetrics } {
    return {
      events: this.events,
      metrics: this.getUserMetrics()
    };
  }

  // Privacy: Clear all data
  clearAllData(): void {
    this.events = [];
    this.pendingEvents = [];
    localStorage.removeItem('saas_analytics_events');
    localStorage.removeItem('user_metrics');
    localStorage.removeItem('analytics_user_id');
  }
}

export const analytics = new SaaSAnalytics();
