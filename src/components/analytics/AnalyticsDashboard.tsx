import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Trophy, 
  Brain, 
  Zap, 
  Star,
  Award,
  ChevronRight,
  Fire,
  BookOpen,
  Download,
  Play,
  Calendar,
  Activity,
  Users,
  Lightbulb,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  LineChart,
  PieChart,
  BarChart2
} from 'lucide-react';
import { analytics, UserMetrics, AdvancedInsights } from '@/utils/saasAnalytics';
import { getCurrentPlan, hasFeature } from '@/utils/billing';

interface AnalyticsDashboardProps {
  userId: string;
  onUpgrade?: () => void;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  unlocked: boolean;
  progress?: number;
  target?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface PerformanceTrend {
  period: string;
  accuracy: number;
  speed: number;
  engagement: number;
  volume: number;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId, onUpgrade }) => {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [advancedInsights, setAdvancedInsights] = useState<AdvancedInsights | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [performanceTrends, setPerformanceTrends] = useState<PerformanceTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const plan = getCurrentPlan();
  const hasAdvancedAnalytics = hasFeature('analytics');

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const userMetrics = analytics.getUserMetrics();
      setMetrics(userMetrics);
      
      const engagementInsights = analytics.getEngagementInsights();
      setInsights(engagementInsights);
      
      if (hasAdvancedAnalytics) {
        const advanced = analytics.getAdvancedInsights();
        setAdvancedInsights(advanced);
      }
      
      const userAchievements = generateAchievements(userMetrics);
      setAchievements(userAchievements);
      
      const trends = generatePerformanceTrends(userMetrics);
      setPerformanceTrends(trends);
      
    } catch (error) {
      console.error('Failed to load analytics:', error);
      analytics.trackError('analytics_load_failed', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const generateAchievements = (userMetrics: UserMetrics): Achievement[] => {
    return [
      {
        id: 'first_quiz',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: Play,
        unlocked: userMetrics.totalQuizzes >= 1,
        progress: Math.min(userMetrics.totalQuizzes, 1),
        target: 1,
        rarity: 'common'
      },
      {
        id: 'quiz_explorer',
        name: 'Quiz Explorer',
        description: 'Complete 5 different quizzes',
        icon: BookOpen,
        unlocked: userMetrics.totalQuizzes >= 5,
        progress: Math.min(userMetrics.totalQuizzes, 5),
        target: 5,
        rarity: 'common'
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Complete 25 quizzes',
        icon: Trophy,
        unlocked: userMetrics.totalQuizzes >= 25,
        progress: Math.min(userMetrics.totalQuizzes, 25),
        target: 25,
        rarity: 'rare'
      },
      {
        id: 'quiz_legend',
        name: 'Quiz Legend',
        description: 'Complete 100 quizzes',
        icon: Award,
        unlocked: userMetrics.totalQuizzes >= 100,
        progress: Math.min(userMetrics.totalQuizzes, 100),
        target: 100,
        rarity: 'legendary'
      },
      {
        id: 'streak_starter',
        name: 'Streak Starter',
        description: 'Maintain a 3-day learning streak',
        icon: Fire,
        unlocked: userMetrics.streakDays >= 3,
        progress: Math.min(userMetrics.streakDays, 3),
        target: 3,
        rarity: 'common'
      },
      {
        id: 'streak_warrior',
        name: 'Streak Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: Fire,
        unlocked: userMetrics.streakDays >= 7,
        progress: Math.min(userMetrics.streakDays, 7),
        target: 7,
        rarity: 'rare'
      },
      {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Maintain a 30-day learning streak',
        icon: Fire,
        unlocked: userMetrics.streakDays >= 30,
        progress: Math.min(userMetrics.streakDays, 30),
        target: 30,
        rarity: 'epic'
      },
      {
        id: 'accuracy_apprentice',
        name: 'Accuracy Apprentice',
        description: 'Achieve 70% accuracy rate',
        icon: Target,
        unlocked: userMetrics.averageAccuracy >= 0.7,
        progress: Math.min(userMetrics.averageAccuracy * 100, 70),
        target: 70,
        rarity: 'common'
      },
      {
        id: 'accuracy_expert',
        name: 'Accuracy Expert',
        description: 'Achieve 85% accuracy rate',
        icon: Target,
        unlocked: userMetrics.averageAccuracy >= 0.85,
        progress: Math.min(userMetrics.averageAccuracy * 100, 85),
        target: 85,
        rarity: 'rare'
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 95% accuracy rate',
        icon: Star,
        unlocked: userMetrics.averageAccuracy >= 0.95,
        progress: Math.min(userMetrics.averageAccuracy * 100, 95),
        target: 95,
        rarity: 'legendary'
      },
      {
        id: 'consistent_learner',
        name: 'Consistent Learner',
        description: 'Maintain 80% consistency score',
        icon: RotateCcw,
        unlocked: userMetrics.consistencyScore >= 80,
        progress: Math.min(userMetrics.consistencyScore, 80),
        target: 80,
        rarity: 'epic'
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'High learning velocity',
        icon: Zap,
        unlocked: userMetrics.learningVelocity >= 2,
        progress: Math.min(userMetrics.learningVelocity * 50, 100),
        target: 100,
        rarity: 'rare'
      }
    ];
  };

  const generatePerformanceTrends = (userMetrics: UserMetrics): PerformanceTrend[] => {
    // Generate mock trend data - in a real app, this would come from stored analytics
    const trends: PerformanceTrend[] = [];
    const days = 7;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trends.push({
        period: date.toLocaleDateString('en-US', { weekday: 'short' }),
        accuracy: Math.max(0, userMetrics.averageAccuracy * 100 + (Math.random() - 0.5) * 20),
        speed: Math.max(0, 100 - userMetrics.learningVelocity * 10 + (Math.random() - 0.5) * 30),
        engagement: Math.max(0, userMetrics.engagementScore + (Math.random() - 0.5) * 20),
        volume: Math.max(0, userMetrics.learningVelocity * 5 + Math.random() * 10)
      });
    }
    
    return trends;
  };

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700 border-gray-200',
    rare: 'bg-blue-100 text-blue-700 border-blue-200',
    epic: 'bg-purple-100 text-purple-700 border-purple-200',
    legendary: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getEngagementLevel = (score: number): { color: string; label: string; icon: React.ComponentType } => {
    if (score >= 80) return { color: 'text-green-600', label: 'Excellent', icon: CheckCircle2 };
    if (score >= 60) return { color: 'text-blue-600', label: 'Good', icon: TrendingUp };
    if (score >= 40) return { color: 'text-yellow-600', label: 'Fair', icon: AlertCircle };
    return { color: 'text-red-600', label: 'Needs Improvement', icon: TrendingDown };
  };

  const statisticsCarousel = useMemo(() => {
    if (!metrics) return [];
    
    return [
      { label: 'Questions Answered', value: metrics.totalQuestions, icon: Brain, color: 'blue' },
      { label: 'Study Hours', value: formatTime(metrics.totalTimeSpent), icon: Clock, color: 'green' },
      { label: 'Longest Streak', value: `${metrics.longestStreak} days`, icon: Fire, color: 'orange' },
      { label: 'Improvement Rate', value: `${metrics.improvementRate.toFixed(1)}%`, icon: TrendingUp, color: 'purple' },
      { label: 'Consistency Score', value: `${Math.round(metrics.consistencyScore)}%`, icon: RotateCcw, color: 'indigo' }
    ];
  }, [metrics]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Ready to Start Learning?</h3>
          <p className="text-gray-500 mb-4">No analytics data available yet. Complete your first quiz to unlock personalized insights!</p>
          <Button onClick={() => analytics.trackFeatureUsage('analytics_first_visit')}>
            Get Started
          </Button>
        </CardContent>
      </Card>
    );
  }

  const engagementLevel = getEngagementLevel(metrics.engagementScore);
  const EngagementIcon = engagementLevel.icon;
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const inProgressAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalQuizzes}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Accuracy Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(metrics.averageAccuracy * 100)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.streakDays} days</p>
                  </div>
                  <Fire className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Time Spent</p>
                    <p className="text-2xl font-bold text-gray-900">{formatTime(metrics.totalTimeSpent)}</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Carousel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Extended Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {statisticsCarousel.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <Icon className={`w-8 h-8 text-${stat.color}-600 mx-auto mb-2`} />
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-lg font-semibold">{stat.value}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EngagementIcon className="w-5 h-5" />
                Engagement Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Engagement</span>
                <Badge className={engagementLevel.color}>{engagementLevel.label}</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score: {metrics.engagementScore}/100</span>
                  <span className={engagementLevel.color}>{metrics.engagementScore}%</span>
                </div>
                <Progress value={metrics.engagementScore} className="h-3" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Consistency</p>
                  <p className="text-lg font-semibold">{Math.round(metrics.consistencyScore)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Learning Velocity</p>
                  <p className="text-lg font-semibold">{metrics.learningVelocity.toFixed(1)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Improvement</p>
                  <p className="text-lg font-semibold">{metrics.improvementRate.toFixed(1)}%</p>
                </div>
              </div>

              {insights && insights.suggestions.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Personalized Recommendations
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {insights.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Performance Trends (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Simple visualization - in real app would use charting library */}
                <div className="grid grid-cols-7 gap-2 text-center">
                  {performanceTrends.map((trend, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-xs text-gray-500">{trend.period}</div>
                      <div className="space-y-1">
                        <div className="bg-blue-200 rounded" style={{ height: `${trend.accuracy}px` }}></div>
                        <div className="text-xs">{Math.round(trend.accuracy)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <span className="text-sm text-gray-500">Accuracy Trend</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Pattern Analysis */}
          {hasAdvancedAnalytics && advancedInsights && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Optimal Study Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{advancedInsights.recommendedStudyTime}</p>
                    <p className="text-sm text-gray-500">Based on your performance patterns</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Session Length
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{advancedInsights.optimalSessionLength} min</p>
                    <p className="text-sm text-gray-500">Optimal learning session duration</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Unlocked Achievements ({unlockedAchievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unlockedAchievements.length > 0 ? (
                  unlockedAchievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div key={achievement.id} className={`flex items-center gap-3 p-3 rounded-lg border ${rarityColors[achievement.rarity]}`}>
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm opacity-80">{achievement.description}</p>
                          <Badge className="mt-1" variant="outline">{achievement.rarity}</Badge>
                        </div>
                        <Award className="w-5 h-5 text-yellow-600" />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">No achievements unlocked yet. Keep learning!</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  In Progress ({inProgressAchievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inProgressAchievements.slice(0, 6).map((achievement) => {
                  const Icon = achievement.icon;
                  const progressPercent = achievement.target 
                    ? Math.round((achievement.progress || 0) / achievement.target * 100)
                    : 0;
                  
                  return (
                    <div key={achievement.id} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.name}</h4>
                          <p className="text-xs text-gray-500">{achievement.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{achievement.rarity}</Badge>
                            <span className="text-xs text-gray-500">{progressPercent}%</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={progressPercent} className="h-1" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {hasAdvancedAnalytics && advancedInsights ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI-Powered Learning Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium">Learning Trend</p>
                      <p className="text-sm text-gray-600 capitalize">{advancedInsights.learningTrend}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium">Next Reviews</p>
                      <p className="text-sm text-gray-600">{advancedInsights.nextReviewTopics.length} topics</p>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium">Study Time</p>
                      <p className="text-sm text-gray-600">{advancedInsights.recommendedStudyTime}</p>
                    </div>
                  </div>
                  
                  {advancedInsights.personalizedTips.length > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Personalized Learning Tips
                      </h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        {advancedInsights.personalizedTips.map((tip: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Data Export & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Export Your Data</p>
                      <p className="text-sm text-gray-500">Download your complete learning analytics</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const data = analytics.exportData();
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `learning-analytics-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        analytics.trackFeatureUsage('data_export');
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Clear All Data</p>
                      <p className="text-sm text-gray-500">Permanently delete your analytics data</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        if (confirm('Are you sure? This will permanently delete all your analytics data.')) {
                          analytics.clearAllData();
                          window.location.reload();
                        }
                      }}
                    >
                      Clear Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Unlock Advanced Analytics & AI Insights</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Get detailed insights, progress trends, learning patterns, predictive analytics, and personalized AI recommendations with Pro.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        AI-powered learning pattern analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Predictive mastery forecasting
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Personalized study recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Advanced performance visualization
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Learning efficiency optimization
                      </li>
                    </ul>
                    {onUpgrade && (
                      <Button onClick={onUpgrade} className="bg-blue-600 hover:bg-blue-700">
                        Upgrade to Pro
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
