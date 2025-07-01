import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Play
} from 'lucide-react';
import { analytics, UserMetrics } from '@/utils/saasAnalytics';
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
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId, onUpgrade }) => {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const plan = getCurrentPlan();
  const hasAdvancedAnalytics = hasFeature('analytics');

  useEffect(() => {
    loadAnalytics();
  }, [userId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const userMetrics = analytics.getUserMetrics();
      setMetrics(userMetrics);
      
      const engagementInsights = analytics.getEngagementInsights();
      setInsights(engagementInsights);
      
      const userAchievements = generateAchievements(userMetrics);
      setAchievements(userAchievements);
      
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAchievements = (userMetrics: UserMetrics): Achievement[] => {
    return [
      {
        id: 'first_quiz',
        name: 'Getting Started',
        description: 'Complete your first quiz',
        icon: Play,
        unlocked: userMetrics.totalQuizzes >= 1,
        progress: Math.min(userMetrics.totalQuizzes, 1),
        target: 1
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Complete 10 quizzes',
        icon: Trophy,
        unlocked: userMetrics.totalQuizzes >= 10,
        progress: Math.min(userMetrics.totalQuizzes, 10),
        target: 10
      },
      {
        id: 'streak_warrior',
        name: 'Streak Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: Fire,
        unlocked: userMetrics.streakDays >= 7,
        progress: Math.min(userMetrics.streakDays, 7),
        target: 7
      },
      {
        id: 'accuracy_expert',
        name: 'Accuracy Expert',
        description: 'Achieve 80% accuracy rate',
        icon: Target,
        unlocked: userMetrics.averageAccuracy >= 0.8,
        progress: Math.min(userMetrics.averageAccuracy * 100, 80),
        target: 80
      }
    ];
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getEngagementLevel = (score: number): { color: string; label: string } => {
    if (score >= 80) return { color: 'text-green-600', label: 'Excellent' };
    if (score >= 60) return { color: 'text-blue-600', label: 'Good' };
    if (score >= 40) return { color: 'text-yellow-600', label: 'Fair' };
    return { color: 'text-red-600', label: 'Needs Improvement' };
  };

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
          <p className="text-gray-500">No analytics data available yet. Start taking quizzes to see your progress!</p>
        </CardContent>
      </Card>
    );
  }

  const engagementLevel = getEngagementLevel(metrics.engagementScore);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const inProgressAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
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

      {/* Engagement Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Engagement Score
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
            <Progress value={metrics.engagementScore} className="h-2" />
          </div>

          {insights && insights.suggestions.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Suggestions to improve:</h4>
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

      {/* Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Achievements ({unlockedAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
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
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inProgressAchievements.map((achievement) => {
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
                      <h4 className="font-medium text-gray-900 text-sm">{achievement.name}</h4>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-1" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Upsell */}
      {!hasAdvancedAnalytics && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Unlock Advanced Analytics</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get detailed insights, progress trends, learning patterns, and personalized recommendations with Pro.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Detailed progress charts & trends
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Learning pattern analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Personalized recommendations
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
    </div>
  );
};

export default AnalyticsDashboard;
