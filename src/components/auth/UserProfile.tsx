import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GoogleDriveUserStorage, UserProfile as UserProfileType, UserData } from '@/utils/googleDriveStorage';
import { toast } from 'sonner';
import { LogOut, Settings, Trophy, BookOpen, Clock, Target, TrendingUp, Zap } from 'lucide-react';

interface UserProfileProps {
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onSignOut }) => {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = GoogleDriveUserStorage.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const data = await GoogleDriveUserStorage.loadUserData();
        setUserData(data);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleDriveUserStorage.signOut();
      onSignOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user || !userData) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Failed to load user profile</p>
        </CardContent>
      </Card>
    );
  }

  const analytics = userData.settings.analytics;
  const accuracyPercentage = analytics.averageAccuracy > 0 ? Math.round(analytics.averageAccuracy * 100) : 0;

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center pb-4">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
          <AvatarImage src={user.picture} alt={user.name} />
          <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">{user.name}</CardTitle>
        <p className="text-sm text-gray-500">{user.email}</p>
        
        {/* Level & XP */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-700">Level {userData.level}</span>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-blue-700">{userData.xp} XP</span>
            </div>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(userData.xp % 1000) / 10}%` }}
            ></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{userData.quizzes.length}</div>
            <div className="text-xs text-blue-600">Quizzes Created</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{analytics.totalQuestions}</div>
            <div className="text-xs text-green-600">Questions Answered</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">{analytics.streakDays}</div>
            <div className="text-xs text-purple-600">Day Streak</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-900">{Math.round(analytics.totalTime / 60)}</div>
            <div className="text-xs text-orange-600">Minutes Studied</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance
          </h4>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accuracy Rate</span>
              <span className="font-semibold text-green-700">{accuracyPercentage}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Learning Velocity</span>
              <span className="font-semibold text-blue-700">
                {analytics.learningVelocity ? `${analytics.learningVelocity.toFixed(1)}/hr` : 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Best Streak</span>
              <span className="font-semibold text-purple-700">{analytics.longestStreak} days</span>
            </div>
          </div>
        </div>

        {/* Mastered Topics */}
        {analytics.masteredTopics.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Mastered Topics</h4>
            <div className="flex flex-wrap gap-2">
              {analytics.masteredTopics.slice(0, 4).map((topic, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                >
                  {topic}
                </span>
              ))}
              {analytics.masteredTopics.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{analytics.masteredTopics.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t">
          <Button variant="outline" className="w-full justify-start text-gray-700 hover:text-gray-900">
            <Settings className="w-4 h-4 mr-2" />
            Settings & Preferences
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile; 