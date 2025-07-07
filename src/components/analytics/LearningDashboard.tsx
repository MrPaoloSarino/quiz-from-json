import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedQuizQuestion, QuizSession } from '@/types/user';
import { 
  Brain, 
  Clock, 
  Target, 
  Zap, 
  BarChart2, 
  Calendar, 
  Book, 
  Repeat, 
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  ChevronRight,
  PieChart,
  Activity,
  Award,
  BookOpen,
  Users,
  Star,
  Timer,
  Gauge,
  LineChart
} from 'lucide-react';
import { analytics } from '@/utils/saasAnalytics';

interface LearningDashboardProps {
  questions: EnhancedQuizQuestion[];
  sessions: QuizSession[];
}

interface TopicAnalysis {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  strengthScore: number;
  needsReview: boolean;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface LearningInsight {
  type: 'strength' | 'weakness' | 'improvement' | 'recommendation';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

const LearningDashboard: React.FC<LearningDashboardProps> = ({
  questions,
  sessions
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Enhanced analytics calculations
  const analytics_data = useMemo(() => {
    console.log('🔍 [LearningDashboard] Processing questions:', questions?.length || 0);
    console.log('🔍 [LearningDashboard] Processing sessions:', sessions?.length || 0);
    
    if (!questions || questions.length === 0) {
      return null;
    }

    const validQuestions = questions.filter(q => q.analytics && typeof q.analytics.strengthScore === 'number');
    const questionsWithAttempts = questions.filter(q => q.analytics && q.analytics.recallAttempts > 0);
    
    console.log('🔍 [Analytics] Valid questions:', validQuestions.length);
    console.log('🔍 [Analytics] Questions with attempts:', questionsWithAttempts.length);

    // Core metrics
    const overallStrength = validQuestions.length > 0 
      ? validQuestions.reduce((sum, q) => sum + q.analytics.strengthScore, 0) / validQuestions.length
      : 0;

    const recallSuccess = questionsWithAttempts.length > 0 
      ? questionsWithAttempts.reduce((sum, q) => {
          const attempts = Math.max(1, q.analytics.recallAttempts);
          return sum + (q.analytics.recallSuccesses / attempts);
        }, 0) / questionsWithAttempts.length
      : 0;

    const avgResponseTime = questionsWithAttempts.length > 0
      ? questionsWithAttempts.reduce((sum, q) => sum + q.analytics.averageRecallTime, 0) / questionsWithAttempts.length
      : 0;

    const masteredTopics = validQuestions.filter(q => q.analytics.strengthScore > 0.8).length;
    const strugglingTopics = validQuestions.filter(q => q.analytics.strengthScore < 0.4).length;

    // Learning velocity and consistency
    const totalStudyTime = sessions && sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / 3600
      : 0;
    
    const learningVelocity = totalStudyTime > 0 ? masteredTopics / totalStudyTime : 0;
    
    // Session consistency (how regular are study sessions)
    const sessionDates = sessions?.map(s => new Date(s.startTime).toDateString()) || [];
    const uniqueDays = new Set(sessionDates).size;
    const totalDays = sessions?.length > 0 
      ? Math.ceil((Date.now() - new Date(sessions[0].startTime).getTime()) / (1000 * 60 * 60 * 24))
      : 1;
    const consistencyScore = uniqueDays / Math.max(totalDays, 1);

    // Improvement trend (last 5 vs previous 5 sessions)
    const recentSessions = sessions?.slice(-5) || [];
    const previousSessions = sessions?.slice(-10, -5) || [];
    
    const recentAccuracy = recentSessions.length > 0
      ? recentSessions.reduce((sum, s) => sum + (s.totalScore / s.questions.length), 0) / recentSessions.length
      : 0;
    
    const previousAccuracy = previousSessions.length > 0
      ? previousSessions.reduce((sum, s) => sum + (s.totalScore / s.questions.length), 0) / previousSessions.length
      : 0;
    
    const improvementTrend = previousAccuracy > 0 
      ? (recentAccuracy - previousAccuracy) / previousAccuracy 
      : 0;

    return {
      overallStrength: Math.round(overallStrength * 100),
      recallSuccess: Math.round(recallSuccess * 100),
      avgResponseTime: Math.round(avgResponseTime),
      masteredTopics,
      strugglingTopics,
      learningVelocity: Math.round(learningVelocity * 10) / 10,
      consistencyScore: Math.round(consistencyScore * 100),
      improvementTrend: Math.round(improvementTrend * 100),
      totalStudyTime: Math.round(totalStudyTime * 10) / 10,
      recentAccuracy: Math.round(recentAccuracy * 100),
      validQuestions: validQuestions.length,
      questionsWithAttempts: questionsWithAttempts.length
    };
  }, [questions, sessions]);

  // Topic analysis
  const topicAnalysis = useMemo(() => {
    if (!questions || questions.length === 0) return [];

    const topicMap = new Map<string, {
      questions: EnhancedQuizQuestion[];
      totalTime: number;
      correctAnswers: number;
    }>();

    questions.forEach(q => {
      if (!q.category || !q.analytics) return;
      
      if (!topicMap.has(q.category)) {
        topicMap.set(q.category, { questions: [], totalTime: 0, correctAnswers: 0 });
      }
      
      const topic = topicMap.get(q.category)!;
      topic.questions.push(q);
      topic.totalTime += q.analytics.averageRecallTime || 0;
      topic.correctAnswers += q.analytics.recallSuccesses || 0;
    });

    const analysis: TopicAnalysis[] = [];
    
    topicMap.forEach((data, category) => {
      const totalQuestions = data.questions.length;
      const totalAttempts = data.questions.reduce((sum, q) => sum + (q.analytics?.recallAttempts || 0), 0);
      const accuracy = totalAttempts > 0 ? data.correctAnswers / totalAttempts : 0;
      const averageTime = totalQuestions > 0 ? data.totalTime / totalQuestions : 0;
      const strengthScore = data.questions.reduce((sum, q) => sum + (q.analytics?.strengthScore || 0), 0) / totalQuestions;
      
      let masteryLevel: TopicAnalysis['masteryLevel'] = 'beginner';
      if (strengthScore > 0.8) masteryLevel = 'expert';
      else if (strengthScore > 0.6) masteryLevel = 'advanced';
      else if (strengthScore > 0.4) masteryLevel = 'intermediate';

      analysis.push({
        category,
        totalQuestions,
        correctAnswers: data.correctAnswers,
        accuracy,
        averageTime,
        strengthScore,
        needsReview: strengthScore < 0.5,
        masteryLevel
      });
    });

    return analysis.sort((a, b) => b.strengthScore - a.strengthScore);
  }, [questions]);

  // Learning insights
  const learningInsights = useMemo((): LearningInsight[] => {
    if (!analytics_data) return [];

    const insights: LearningInsight[] = [];

    // Strength insights
    if (analytics_data.overallStrength >= 80) {
      insights.push({
        type: 'strength',
        title: 'Excellent Overall Performance',
        description: `You're performing exceptionally well with ${analytics_data.overallStrength}% strength score.`,
        actionable: false,
        priority: 'low'
      });
    }

    // Weakness insights
    if (analytics_data.strugglingTopics > 0) {
      insights.push({
        type: 'weakness',
        title: 'Topics Need Attention',
        description: `${analytics_data.strugglingTopics} topics need review to improve understanding.`,
        actionable: true,
        priority: 'high'
      });
    }

    // Improvement insights
    if (analytics_data.improvementTrend > 10) {
      insights.push({
        type: 'improvement',
        title: 'Great Progress!',
        description: `Your accuracy has improved by ${analytics_data.improvementTrend}% in recent sessions.`,
        actionable: false,
        priority: 'medium'
      });
    } else if (analytics_data.improvementTrend < -10) {
      insights.push({
        type: 'weakness',
        title: 'Performance Declining',
        description: `Your accuracy has decreased by ${Math.abs(analytics_data.improvementTrend)}% recently.`,
        actionable: true,
        priority: 'high'
      });
    }

    // Consistency insights
    if (analytics_data.consistencyScore < 30) {
      insights.push({
        type: 'recommendation',
        title: 'Improve Study Consistency',
        description: 'Regular daily practice would significantly boost your learning progress.',
        actionable: true,
        priority: 'high'
      });
    }

    // Speed insights
    if (analytics_data.avgResponseTime > 30) {
      insights.push({
        type: 'recommendation',
        title: 'Work on Response Speed',
        description: 'Practicing quick recall could improve your response time.',
        actionable: true,
        priority: 'medium'
      });
    }

    return insights.slice(0, 6); // Limit to 6 insights
  }, [analytics_data]);

  // Get upcoming reviews
  const upcomingReviews = useMemo(() => {
    if (!questions) return [];
    
    return questions
      .filter(q => {
        if (!q.spacedRepetition?.nextReviewDate) return false;
        const nextReview = new Date(q.spacedRepetition.nextReviewDate);
        const daysUntil = Math.ceil((nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 7;
      })
      .sort((a, b) => {
        const aDate = new Date(a.spacedRepetition.nextReviewDate);
        const bDate = new Date(b.spacedRepetition.nextReviewDate);
        return aDate.getTime() - bDate.getTime();
      })
      .slice(0, 5);
  }, [questions]);

  const masteryColors = {
    beginner: 'bg-red-100 text-red-700 border-red-200',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-blue-100 text-blue-700 border-blue-200',
    expert: 'bg-green-100 text-green-700 border-green-200'
  };

  const insightIcons = {
    strength: CheckCircle2,
    weakness: AlertCircle,
    improvement: TrendingUp,
    recommendation: Lightbulb
  };

  const insightColors = {
    strength: 'text-green-600 bg-green-50',
    weakness: 'text-red-600 bg-red-50',
    improvement: 'text-blue-600 bg-blue-50',
    recommendation: 'text-purple-600 bg-purple-50'
  };

  if (!analytics_data) {
    return (
      <div className="space-y-4">
        <Card className="p-6 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Learning Data Available</h3>
          <p className="text-gray-500 mb-4">Complete some quiz questions to see your detailed analytics!</p>
          <Button onClick={() => analytics.trackFeatureUsage('learning_dashboard_first_visit')}>
            Start Learning
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                <h3 className="font-medium">Overall Strength</h3>
              </div>
              <Progress value={analytics_data.overallStrength} className="h-2" />
              <span className="text-2xl font-semibold">{analytics_data.overallStrength}%</span>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h3 className="font-medium">Recall Success</h3>
              </div>
              <Progress value={analytics_data.recallSuccess} className="h-2" />
              <span className="text-2xl font-semibold">{analytics_data.recallSuccess}%</span>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <h3 className="font-medium">Avg Response</h3>
              </div>
              <span className="text-2xl font-semibold">{analytics_data.avgResponseTime}s</span>
              <span className="text-sm text-gray-500">per question</span>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                <h3 className="font-medium">Topics Mastered</h3>
              </div>
              <span className="text-2xl font-semibold">{analytics_data.masteredTopics}</span>
              <span className="text-sm text-gray-500">of {analytics_data.validQuestions}</span>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="w-5 h-5 text-blue-500" />
                <h3 className="font-medium">Learning Velocity</h3>
              </div>
              <div className="space-y-2">
                <span className="text-3xl font-bold">{analytics_data.learningVelocity}</span>
                <span className="text-sm text-gray-500 ml-2">topics/hour</span>
                <p className="text-sm text-gray-600">
                  {analytics_data.learningVelocity > 1 
                    ? 'Excellent pace! You\'re learning efficiently.' 
                    : 'Consider focusing on fewer topics at a time.'}
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-500" />
                <h3 className="font-medium">Consistency</h3>
              </div>
              <div className="space-y-2">
                <span className="text-3xl font-bold">{analytics_data.consistencyScore}%</span>
                <Progress value={analytics_data.consistencyScore} className="h-2" />
                <p className="text-sm text-gray-600">
                  {analytics_data.consistencyScore > 70 
                    ? 'Great consistency! Keep it up.' 
                    : 'Try to study more regularly for better results.'}
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <h3 className="font-medium">Recent Trend</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{Math.abs(analytics_data.improvementTrend)}%</span>
                  {analytics_data.improvementTrend > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : analytics_data.improvementTrend < 0 ? (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  ) : (
                    <Activity className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {analytics_data.improvementTrend > 0 
                    ? 'Improving! Your accuracy is trending up.' 
                    : analytics_data.improvementTrend < 0 
                    ? 'Review needed. Focus on weak areas.'
                    : 'Stable performance. Keep practicing.'}
                </p>
              </div>
            </Card>
          </div>

          {/* Study Sessions Summary */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Book className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium">Recent Study Sessions</h3>
            </div>
            <div className="space-y-3">
              {sessions?.slice(-5).reverse().map((session, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">
                      Session {sessions.length - i}
                    </span>
                    <div className="text-xs text-gray-500">
                      {new Date(session.startTime).toLocaleDateString()} at{' '}
                      {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      {Math.round(session.timeSpent / 60)}min
                    </span>
                    <div className="text-xs text-gray-500">
                      Score: {session.totalScore}/{session.questions.length} ({Math.round((session.totalScore / session.questions.length) * 100)}%)
                    </div>
                  </div>
                </div>
              ))}
              {(!sessions || sessions.length === 0) && (
                <p className="text-gray-500 text-center py-4">No study sessions recorded yet.</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Topic Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topicAnalysis.map((topic, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{topic.category}</h4>
                        <p className="text-sm text-gray-500">{topic.totalQuestions} questions</p>
                      </div>
                      <Badge className={masteryColors[topic.masteryLevel]}>
                        {topic.masteryLevel}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Accuracy</p>
                        <p className="font-semibold">{Math.round(topic.accuracy * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Avg Time</p>
                        <p className="font-semibold">{Math.round(topic.averageTime)}s</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Strength</p>
                        <p className="font-semibold">{Math.round(topic.strengthScore * 100)}%</p>
                      </div>
                    </div>
                    
                    <Progress value={topic.strengthScore * 100} className="h-2 mb-2" />
                    
                    {topic.needsReview && (
                      <div className="flex items-center gap-2 mt-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-orange-600">Needs review</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {topicAnalysis.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No topic data available yet. Complete more quizzes to see detailed topic analysis.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                AI-Powered Learning Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningInsights.map((insight, index) => {
                  const Icon = insightIcons[insight.type];
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${insightColors[insight.type]}`}>
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{insight.title}</h4>
                          <p className="text-sm opacity-90">{insight.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.priority} priority
                            </Badge>
                            {insight.actionable && (
                              <Badge variant="outline" className="text-xs">
                                Actionable
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {learningInsights.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Complete more learning sessions to unlock personalized insights.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Upcoming Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingReviews.map((q, i) => {
                    const daysUntil = Math.ceil((q.spacedRepetition.nextReviewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    const isOverdue = daysUntil < 0;
                    const isToday = daysUntil === 0;
                    
                    return (
                      <div key={i} className={`p-3 rounded-lg border ${isOverdue ? 'border-red-200 bg-red-50' : isToday ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm truncate">{q.question}</p>
                            <p className="text-xs text-gray-500 mt-1">{q.category}</p>
                          </div>
                          <div className="text-right ml-2">
                            <Badge variant={isOverdue ? 'destructive' : isToday ? 'default' : 'secondary'} className="text-xs">
                              {isOverdue ? `${Math.abs(daysUntil)}d overdue` : isToday ? 'Today' : `in ${daysUntil}d`}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {upcomingReviews.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-gray-500">No reviews scheduled for the next 7 days!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-purple-500" />
                  Learning Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Topics ready for interleaving */}
                  <div>
                    <h4 className="font-medium mb-2">Topics Ready for Interleaving</h4>
                    <div className="flex flex-wrap gap-2">
                      {topicAnalysis
                        .filter(t => t.masteryLevel === 'advanced' || t.masteryLevel === 'expert')
                        .slice(0, 5)
                        .map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {topic.category}
                          </Badge>
                        ))}
                      {topicAnalysis.filter(t => t.masteryLevel === 'advanced' || t.masteryLevel === 'expert').length === 0 && (
                        <p className="text-sm text-gray-500">Master more topics to unlock interleaving</p>
                      )}
                    </div>
                  </div>

                  {/* Weak areas needing attention */}
                  <div>
                    <h4 className="font-medium mb-2">Areas Needing Attention</h4>
                    <div className="space-y-2">
                      {topicAnalysis
                        .filter(t => t.needsReview)
                        .slice(0, 3)
                        .map((topic, i) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-200">
                            <span className="text-sm font-medium">{topic.category}</span>
                            <Badge variant="destructive" className="text-xs">
                              {Math.round(topic.strengthScore * 100)}% strength
                            </Badge>
                          </div>
                        ))}
                      {topicAnalysis.filter(t => t.needsReview).length === 0 && (
                        <p className="text-sm text-gray-500">Great! No topics currently need urgent review.</p>
                      )}
                    </div>
                  </div>

                  {/* Study session recommendations */}
                  <div>
                    <h4 className="font-medium mb-2">Session Recommendations</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4" />
                        <span>Optimal session length: 25-30 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Best study time: Based on your performance patterns</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Repeat className="w-4 h-4" />
                        <span>Review frequency: Every 2-3 days for optimal retention</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningDashboard; 