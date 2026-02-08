import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle, XCircle, Percent, Trophy, Clock, RotateCcw } from 'lucide-react';

interface LocalStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  streakDays: number;
  longestStreak: number;
  totalTime: number; // in seconds
  quizzesCompleted: number;
}

const STATS_KEY = 'quizmaster_local_stats';

/** Get stats from localStorage */
const getLocalStats = (): LocalStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return {
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    accuracy: 0,
    streakDays: 0,
    longestStreak: 0,
    totalTime: 0,
    quizzesCompleted: 0,
  };
};

/** Save stats to localStorage */
export const saveLocalStats = (stats: LocalStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
};

/** Update stats after a quiz session */
export const updateStatsAfterQuiz = (
  totalAnswered: number,
  correctCount: number,
  timeSpentSeconds: number
): void => {
  const current = getLocalStats();
  const wrongCount = totalAnswered - correctCount;
  
  const newTotal = current.totalQuestions + totalAnswered;
  const newCorrect = current.correctAnswers + correctCount;
  const newWrong = current.wrongAnswers + wrongCount;
  const newAccuracy = newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0;
  
  // Simple streak logic: check if last quiz was today or yesterday
  const today = new Date().toDateString();
  const lastQuizDate = localStorage.getItem('quizmaster_last_quiz_date');
  let newStreak = current.streakDays;
  
  if (lastQuizDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastQuizDate === yesterday) {
      newStreak = current.streakDays + 1;
    } else if (lastQuizDate !== today) {
      newStreak = 1; // Reset streak
    }
    localStorage.setItem('quizmaster_last_quiz_date', today);
  }
  
  const newLongestStreak = Math.max(current.longestStreak, newStreak);
  
  saveLocalStats({
    totalQuestions: newTotal,
    correctAnswers: newCorrect,
    wrongAnswers: newWrong,
    accuracy: newAccuracy,
    streakDays: newStreak,
    longestStreak: newLongestStreak,
    totalTime: current.totalTime + timeSpentSeconds,
    quizzesCompleted: current.quizzesCompleted + 1,
  });
};

interface UserProfileProps {
  onSignOut?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const [stats, setStats] = useState<LocalStats>(getLocalStats);

  useEffect(() => {
    // Refresh stats when component mounts or when storage changes
    const handleStorageChange = () => {
      setStats(getLocalStats());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleReset = () => {
    if (confirm('Reset all your stats? This cannot be undone.')) {
      saveLocalStats({
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        accuracy: 0,
        streakDays: 0,
        longestStreak: 0,
        totalTime: 0,
        quizzesCompleted: 0,
      });
      localStorage.removeItem('quizmaster_last_quiz_date');
      setStats(getLocalStats());
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Your Stats
        </CardTitle>
        <p className="text-sm text-gray-500">All data stored locally</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{stats.totalQuestions}</div>
            <div className="text-xs text-blue-600">Questions Taken</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{stats.correctAnswers}</div>
            <div className="text-xs text-green-600">Correct</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
            <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-900">{stats.wrongAnswers}</div>
            <div className="text-xs text-red-600">Wrong</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <Percent className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">{stats.accuracy}%</div>
            <div className="text-xs text-purple-600">Accuracy</div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Current Streak
            </span>
            <span className="font-semibold text-yellow-700">{stats.streakDays} days</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-orange-500" />
              Best Streak
            </span>
            <span className="font-semibold text-orange-700">{stats.longestStreak} days</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Time Studied
            </span>
            <span className="font-semibold text-blue-700">{formatTime(stats.totalTime)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Quizzes Completed
            </span>
            <span className="font-semibold text-green-700">{stats.quizzesCompleted}</span>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-center text-gray-500 hover:text-red-600 hover:border-red-300"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile; 