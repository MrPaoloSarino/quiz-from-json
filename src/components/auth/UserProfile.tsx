import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle, XCircle, Percent, Trophy, Clock, RotateCcw, Zap, TrendingUp, Award } from 'lucide-react';

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

// ═══════════════════════════════════════════════════════════════════════════════
// RANKING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

interface RankTier {
  name: string;
  emoji: string;
  minAccuracy: number;
  color: string;
  bgGradient: string;
}

const RANK_TIERS: RankTier[] = [
  { name: 'Topnotcher', emoji: '🏆', minAccuracy: 90, color: 'text-yellow-600', bgGradient: 'from-yellow-100 to-amber-200' },
  { name: 'Distinguished', emoji: '🎖️', minAccuracy: 85, color: 'text-purple-600', bgGradient: 'from-purple-100 to-purple-200' },
  { name: 'Board Passer', emoji: '🏅', minAccuracy: 75, color: 'text-green-600', bgGradient: 'from-green-100 to-emerald-200' },
  { name: 'Competent', emoji: '🎯', minAccuracy: 70, color: 'text-blue-600', bgGradient: 'from-blue-100 to-blue-200' },
  { name: 'Studious', emoji: '📖', minAccuracy: 60, color: 'text-cyan-600', bgGradient: 'from-cyan-100 to-cyan-200' },
  { name: 'Reviewee', emoji: '📝', minAccuracy: 50, color: 'text-orange-600', bgGradient: 'from-orange-100 to-orange-200' },
  { name: 'Seedling', emoji: '🌱', minAccuracy: 0, color: 'text-gray-600', bgGradient: 'from-gray-100 to-gray-200' },
];

interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
}

const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Enrollee', xpRequired: 0 },
  { level: 2, title: 'Freshman', xpRequired: 100 },
  { level: 3, title: 'Sophomore', xpRequired: 300 },
  { level: 4, title: 'Junior', xpRequired: 600 },
  { level: 5, title: 'Senior', xpRequired: 1000 },
  { level: 6, title: 'Intern', xpRequired: 2000 },
  { level: 7, title: 'Associate', xpRequired: 4000 },
  { level: 8, title: 'Professional', xpRequired: 7000 },
  { level: 9, title: 'Specialist', xpRequired: 11000 },
  { level: 10, title: 'Diplomate', xpRequired: 16000 },
];

/** Get rank tier based on accuracy */
const getRankTier = (accuracy: number): RankTier => {
  for (const tier of RANK_TIERS) {
    if (accuracy >= tier.minAccuracy) {
      return tier;
    }
  }
  return RANK_TIERS[RANK_TIERS.length - 1];
};

/** Get next rank tier (for "next goal" display) */
const getNextRankTier = (accuracy: number): RankTier | null => {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (accuracy < RANK_TIERS[i].minAccuracy) {
      return RANK_TIERS[i];
    }
  }
  return null; // Already at highest tier
};

/** Calculate total XP from stats */
const calculateXP = (stats: LocalStats): number => {
  return (
    (stats.correctAnswers * 10) +
    (stats.quizzesCompleted * 50) +
    (stats.longestStreak * 25) +
    (Math.floor(stats.totalTime / 60) * 2) // 2 XP per minute
  );
};

/** Get current level info and progress */
const getLevelInfo = (xp: number): { current: LevelInfo; next: LevelInfo | null; progress: number } => {
  let current = LEVELS[0];
  let next: LevelInfo | null = LEVELS[1];
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  
  // Calculate progress to next level (0-100%)
  let progress = 100;
  if (next) {
    const xpInCurrentLevel = xp - current.xpRequired;
    const xpNeededForNext = next.xpRequired - current.xpRequired;
    progress = Math.round((xpInCurrentLevel / xpNeededForNext) * 100);
  }
  
  return { current, next, progress };
};

/** Calculate composite Board Readiness Score (0-100) */
const calculateBoardReadinessScore = (stats: LocalStats): number => {
  // Normalize each component to 0-100 scale
  const accuracyScore = stats.accuracy; // Already 0-100
  const volumeScore = Math.min(stats.totalQuestions / 500, 1) * 100;
  const streakScore = Math.min(stats.longestStreak / 30, 1) * 100;
  const timeScore = Math.min(stats.totalTime / 36000, 1) * 100; // 10 hours max
  const completionScore = Math.min(stats.quizzesCompleted / 20, 1) * 100;
  
  // Weighted composite
  const score = (
    (0.50 * accuracyScore) +
    (0.15 * volumeScore) +
    (0.15 * streakScore) +
    (0.10 * timeScore) +
    (0.10 * completionScore)
  );
  
  return Math.round(score);
};

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

  // Calculate ranking data
  const xp = calculateXP(stats);
  const levelInfo = getLevelInfo(xp);
  const rankTier = getRankTier(stats.accuracy);
  const nextRank = getNextRankTier(stats.accuracy);
  const boardReadiness = calculateBoardReadinessScore(stats);

  return (
    <div className="w-full max-w-md space-y-4">
      {/* RANK CARD - The main showcase */}
      <Card className="shadow-lg overflow-hidden">
        <div className={`bg-gradient-to-br ${rankTier.bgGradient} p-6`}>
          {/* Rank Badge */}
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">{rankTier.emoji}</div>
            <h2 className={`text-2xl font-bold ${rankTier.color}`}>{rankTier.name}</h2>
            <p className="text-sm text-gray-600 mt-1">Lv.{levelInfo.current.level} {levelInfo.current.title}</p>
          </div>

          {/* XP Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                {xp.toLocaleString()} XP
              </span>
              {levelInfo.next && (
                <span>{levelInfo.next.xpRequired.toLocaleString()} XP</span>
              )}
            </div>
            <div className="h-3 bg-white/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            {levelInfo.next && (
              <p className="text-xs text-gray-500 mt-1 text-center">
                {(levelInfo.next.xpRequired - xp).toLocaleString()} XP to {levelInfo.next.title}
              </p>
            )}
          </div>

          {/* Board Readiness Score */}
          <div className="bg-white/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Board Readiness</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{boardReadiness}<span className="text-sm text-gray-500">/100</span></div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  boardReadiness >= 75 ? 'bg-green-500' :
                  boardReadiness >= 50 ? 'bg-yellow-500' :
                  'bg-red-400'
                }`}
                style={{ width: `${boardReadiness}%` }}
              />
            </div>
          </div>

          {/* Next Rank Goal */}
          {nextRank && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                <Award className="w-3 h-3 inline mr-1" />
                Next rank: <span className="font-semibold">{nextRank.emoji} {nextRank.name}</span>
                <span className="text-gray-500"> ({nextRank.minAccuracy - stats.accuracy}% more accuracy needed)</span>
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* RANKING LADDER CARD */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Ranking Ladder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Accuracy-Based Ranks */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Percent className="w-4 h-4" /> Accuracy Ranks
            </h3>
            <div className="space-y-1">
              {RANK_TIERS.map((tier) => {
                const isCurrentTier = tier.name === rankTier.name;
                const isAchieved = stats.accuracy >= tier.minAccuracy;
                return (
                  <div 
                    key={tier.name}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                      isCurrentTier 
                        ? `bg-gradient-to-r ${tier.bgGradient} border-2 border-yellow-400 shadow-sm` 
                        : isAchieved 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tier.emoji}</span>
                      <span className={`font-medium ${isCurrentTier ? tier.color : ''}`}>
                        {tier.name}
                      </span>
                      {isCurrentTier && (
                        <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className={`text-sm ${isCurrentTier ? 'font-bold' : ''}`}>
                      {tier.minAccuracy}%+
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level-Based Ranks */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" /> XP Levels
            </h3>
            <div className="grid grid-cols-2 gap-1">
              {LEVELS.map((level) => {
                const isCurrentLevel = level.level === levelInfo.current.level;
                const isAchieved = xp >= level.xpRequired;
                return (
                  <div 
                    key={level.level}
                    className={`flex items-center justify-between px-2 py-1.5 rounded text-sm ${
                      isCurrentLevel 
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-400 font-semibold' 
                        : isAchieved 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Lv.{level.level}</span>
                      <span>{level.title}</span>
                      {isCurrentLevel && <span className="text-yellow-600">★</span>}
                    </span>
                    <span className="text-xs">{level.xpRequired.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* XP Breakdown */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">How to Earn XP</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Correct Answer</span>
                <span className="font-medium text-green-600">+10 XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Complete Quiz</span>
                <span className="font-medium text-blue-600">+50 XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Best Streak Day</span>
                <span className="font-medium text-orange-600">+25 XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Per Minute Studied</span>
                <span className="font-medium text-purple-600">+2 XP</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STATS CARD */}
      <Card className="shadow-lg">
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
    </div>
  );
};

export default UserProfile; 