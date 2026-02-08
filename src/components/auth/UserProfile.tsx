import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target, CheckCircle, XCircle, Percent, Trophy, Clock, RotateCcw, 
  Zap, TrendingUp, Award, Shield, AlertTriangle, Flame, BookOpen,
  ChevronDown, ChevronUp, Info
} from 'lucide-react';
import {
  ExtendedStats,
  getExtendedStats,
  saveExtendedStats,
  getDefaultExtendedStats,
  getRankResult,
  getNextRankTier,
  getLevelInfo,
  getEffectiveXP,
  calculateBoardReadinessScore,
  calculateEffectiveAccuracy,
  formatXP,
  RANK_TIERS,
  LEVELS,
  MAJOR_CATEGORIES,
  resetAllStats,
  updateStatsAfterQuiz,
} from '@/utils/rankingSystem';

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// ═══════════════════════════════════════════════════════════════════════════════

// Re-export the backwards-compatible function from rankingSystem
export { updateStatsAfterQuiz } from '@/utils/rankingSystem';

interface LocalStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  streakDays: number;
  longestStreak: number;
  totalTime: number;
  quizzesCompleted: number;
}

const STATS_KEY = 'quizmaster_local_stats';

/** Get stats from localStorage (legacy format) */
export const getLocalStats = (): LocalStats => {
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

/** Save stats to localStorage (legacy format) */
export const saveLocalStats = (stats: LocalStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER PROFILE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface UserProfileProps {
  onSignOut?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const [stats, setStats] = useState<ExtendedStats>(getExtendedStats);
  const [showRankDetails, setShowRankDetails] = useState(false);
  const [showXPDetails, setShowXPDetails] = useState(false);
  const [showCategoryStats, setShowCategoryStats] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setStats(getExtendedStats());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleReset = () => {
    if (confirm('Reset all your stats? This cannot be undone.')) {
      resetAllStats();
      setStats(getExtendedStats());
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  // Calculate all ranking data
  const effectiveXP = getEffectiveXP(stats);
  const levelInfo = getLevelInfo(effectiveXP);
  const rankResult = getRankResult(stats);
  const nextRank = getNextRankTier(stats);
  const boardReadiness = calculateBoardReadinessScore(stats);
  const effectiveAccuracy = calculateEffectiveAccuracy(stats);

  // XP cap info
  const dailyXPRemaining = Math.max(0, 500 - stats.dailyXPEarned);
  const weeklyXPRemaining = Math.max(0, 2500 - stats.weeklyXPEarned);

  return (
    <div className="w-full max-w-md space-y-4">
      {/* RANK DECAY WARNING */}
      {rankResult.isAtRisk && (
        <Card className="shadow-lg border-orange-400 bg-orange-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Rank at risk! Complete a quiz within {rankResult.daysUntilDecay} days to maintain your rank.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RANK CARD - The main showcase */}
      <Card className="shadow-lg overflow-hidden">
        <div className={`bg-gradient-to-br ${rankResult.tier.bgGradient} p-6`}>
          {/* Rank Badge */}
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">{rankResult.tier.emoji}</div>
            <div className="flex items-center justify-center gap-2">
              <h2 className={`text-2xl font-bold ${rankResult.tier.color}`}>{rankResult.tier.name}</h2>
              {/* Confidence Badge */}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                rankResult.confidence === 'high' ? 'bg-green-200 text-green-800' :
                rankResult.confidence === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-gray-200 text-gray-600'
              }`}>
                {rankResult.confidencePercent}% sure
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Lv.{levelInfo.current.level} {levelInfo.current.title}</p>
          </div>

          {/* Effective Accuracy (Recency Weighted) */}
          <div className="text-center mb-4 text-sm">
            <span className="text-gray-600">Effective Accuracy: </span>
            <span className="font-bold text-lg">{effectiveAccuracy}%</span>
            {effectiveAccuracy !== stats.accuracy && (
              <span className="text-xs text-gray-500 ml-1">(All-time: {stats.accuracy}%)</span>
            )}
          </div>

          {/* XP Progress Bar with Decay Info */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                {formatXP(effectiveXP)} XP
                {stats.decayedXP > 0 && (
                  <span className="text-red-500">(-{formatXP(stats.decayedXP)} decayed)</span>
                )}
              </span>
              {levelInfo.next && (
                <span>{formatXP(levelInfo.next.xpRequired)} XP</span>
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
                {formatXP(levelInfo.xpToNext)} XP to {levelInfo.next.title}
              </p>
            )}
          </div>

          {/* XP Caps Indicator */}
          <div className="flex gap-2 mb-4 text-xs">
            <div className={`flex-1 rounded-lg p-2 ${dailyXPRemaining > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="flex items-center justify-between">
                <span className={dailyXPRemaining > 0 ? 'text-green-700' : 'text-red-700'}>Daily Cap</span>
                <span className="font-semibold">{dailyXPRemaining}/500</span>
              </div>
            </div>
            <div className={`flex-1 rounded-lg p-2 ${weeklyXPRemaining > 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
              <div className="flex items-center justify-between">
                <span className={weeklyXPRemaining > 0 ? 'text-blue-700' : 'text-red-700'}>Weekly Cap</span>
                <span className="font-semibold">{weeklyXPRemaining}/2500</span>
              </div>
            </div>
          </div>

          {/* Streak Freezes */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-1 bg-white/50 rounded-lg px-3 py-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{stats.streakDays} day streak</span>
            </div>
            <div className="flex items-center gap-1 bg-white/50 rounded-lg px-3 py-1">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">{stats.streakFreezes} freezes</span>
            </div>
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
            <div className="mt-4 p-3 bg-white/30 rounded-lg">
              <p className="text-sm text-gray-700 font-medium mb-2">
                <Award className="w-4 h-4 inline mr-1" />
                Next rank: {nextRank.emoji} {nextRank.name}
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={stats.accuracy >= nextRank.minAccuracy ? 'text-green-600' : ''}>
                  {stats.accuracy >= nextRank.minAccuracy ? '✓' : '○'} {nextRank.minAccuracy}% accuracy 
                  {stats.accuracy < nextRank.minAccuracy && ` (need ${nextRank.minAccuracy - stats.accuracy}% more)`}
                </li>
                <li className={stats.quizzesCompleted >= nextRank.minQuizzes ? 'text-green-600' : ''}>
                  {stats.quizzesCompleted >= nextRank.minQuizzes ? '✓' : '○'} {nextRank.minQuizzes} quizzes completed
                  {stats.quizzesCompleted < nextRank.minQuizzes && ` (need ${nextRank.minQuizzes - stats.quizzesCompleted} more)`}
                </li>
                {nextRank.requiresAllCategories && (
                  <li className={rankResult.meetsCategoryRequirement ? 'text-green-600' : ''}>
                    {rankResult.meetsCategoryRequirement ? '✓' : '○'} {nextRank.minCategoryAccuracy}%+ in all categories
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* RANKING LADDER CARD */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2 cursor-pointer" onClick={() => setShowRankDetails(!showRankDetails)}>
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Ranking Ladder
            </span>
            {showRankDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {showRankDetails && (
          <CardContent className="space-y-4">
            {/* Accuracy-Based Ranks */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Percent className="w-4 h-4" /> Accuracy Ranks
              </h3>
              <div className="space-y-1">
                {RANK_TIERS.map((tier) => {
                  const isCurrentTier = tier.name === rankResult.tier.name;
                  const meetsAccuracy = stats.accuracy >= tier.minAccuracy;
                  const meetsQuizzes = stats.quizzesCompleted >= tier.minQuizzes;
                  const isAchievable = meetsAccuracy && meetsQuizzes;
                  return (
                    <div 
                      key={tier.name}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                        isCurrentTier 
                          ? `bg-gradient-to-r ${tier.bgGradient} border-2 border-yellow-400 shadow-sm` 
                          : isAchievable 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{tier.emoji}</span>
                        <div>
                          <span className={`font-medium ${isCurrentTier ? tier.color : ''}`}>
                            {tier.name}
                          </span>
                          {isCurrentTier && (
                            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold ml-2">
                              YOU
                            </span>
                          )}
                          <div className="text-xs text-gray-500">
                            {tier.minQuizzes > 0 && `${tier.minQuizzes}+ quizzes`}
                            {tier.requiresAllCategories && ' • All categories'}
                          </div>
                        </div>
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
                  const isAchieved = effectiveXP >= level.xpRequired;
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
          </CardContent>
        )}
      </Card>

      {/* XP BALANCE SYSTEM CARD */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2 cursor-pointer" onClick={() => setShowXPDetails(!showXPDetails)}>
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              XP Balance System
            </span>
            {showXPDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {showXPDetails && (
          <CardContent className="space-y-4 text-sm">
            {/* Base XP */}
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-semibold text-green-800 mb-2">Base XP Earnings</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Correct Answer</span>
                  <span className="font-medium text-green-600">+10 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Complete Quiz</span>
                  <span className="font-medium text-blue-600">+50 XP</span>
                </div>
              </div>
            </div>

            {/* Difficulty Multipliers */}
            <div className="bg-orange-50 rounded-lg p-3">
              <h4 className="font-semibold text-orange-800 mb-2">Difficulty Multipliers</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-green-600">Easy</span>
                  <span className="font-medium">×0.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Medium</span>
                  <span className="font-medium">×1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">Hard</span>
                  <span className="font-medium">×1.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Board Exam</span>
                  <span className="font-medium">×2.0</span>
                </div>
              </div>
            </div>

            {/* Diminishing Returns */}
            <div className="bg-purple-50 rounded-lg p-3">
              <h4 className="font-semibold text-purple-800 mb-2">Diminishing Returns</h4>
              <p className="text-xs text-gray-600 mb-2">Repeating the same quiz gives less XP:</p>
              <div className="flex justify-between text-xs">
                <span>1st: 100%</span>
                <span>2nd: 50%</span>
                <span>3rd: 25%</span>
                <span>4th: 10%</span>
                <span>5th+: 5%</span>
              </div>
            </div>

            {/* Streak Bonuses */}
            <div className="bg-yellow-50 rounded-lg p-3">
              <h4 className="font-semibold text-yellow-800 mb-2">Streak Bonuses</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>3+ days</span>
                  <span className="font-medium text-yellow-600">×1.25</span>
                </div>
                <div className="flex justify-between">
                  <span>7+ days</span>
                  <span className="font-medium text-orange-600">×1.5</span>
                </div>
                <div className="flex justify-between">
                  <span>14+ days</span>
                  <span className="font-medium text-orange-600">×1.75</span>
                </div>
                <div className="flex justify-between">
                  <span>30+ days</span>
                  <span className="font-medium text-red-600">×2.0</span>
                </div>
              </div>
            </div>

            {/* Decay & Caps */}
            <div className="bg-red-50 rounded-lg p-3">
              <h4 className="font-semibold text-red-800 mb-2">XP Decay & Caps</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Daily cap: 500 XP (resets midnight)</li>
                <li>• Weekly cap: 2,500 XP (resets Monday)</li>
                <li>• XP decays 1%/day after 7 days inactive</li>
                <li>• Rank drops after 14 days inactive</li>
              </ul>
            </div>

            {/* Streak Protection */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Streak Protection
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Start with 1 free streak freeze</li>
                <li>• Earn +1 freeze every 7-day streak</li>
                <li>• Max 3 freezes stored</li>
                <li>• Auto-used if you miss 1 day with 3+ streak</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* CATEGORY MASTERY CARD */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2 cursor-pointer" onClick={() => setShowCategoryStats(!showCategoryStats)}>
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Category Mastery
            </span>
            {showCategoryStats ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {showCategoryStats && (
          <CardContent className="space-y-3">
            <p className="text-xs text-gray-500 mb-2">
              Top tiers require 80%+ accuracy in all major categories
            </p>
            {MAJOR_CATEGORIES.map((category) => {
              const catStat = stats.categoryStats.find(c => 
                c.category.toLowerCase().includes(category.toLowerCase()) ||
                category.toLowerCase().includes(c.category.toLowerCase())
              );
              const accuracy = catStat?.accuracy || 0;
              const questions = catStat?.totalQuestions || 0;
              const isMastered = accuracy >= 80;
              
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={isMastered ? 'text-green-700 font-medium' : 'text-gray-700'}>
                      {isMastered && '✓ '}{category}
                    </span>
                    <span className={`font-medium ${
                      accuracy >= 80 ? 'text-green-600' :
                      accuracy >= 60 ? 'text-yellow-600' :
                      accuracy > 0 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {questions > 0 ? `${accuracy}%` : 'Not started'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        accuracy >= 80 ? 'bg-green-500' :
                        accuracy >= 60 ? 'bg-yellow-500' :
                        'bg-red-400'
                      }`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{questions} questions answered</p>
                </div>
              );
            })}
            
            {/* Unmet categories warning */}
            {rankResult.unmetCategories.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs">
                <p className="font-medium text-yellow-800">
                  To reach higher tiers, improve these categories:
                </p>
                <ul className="mt-1 text-yellow-700">
                  {rankResult.unmetCategories.map(cat => (
                    <li key={cat}>• {cat}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        )}
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
              <div className="text-xs text-purple-600">All-Time Accuracy</div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Current Streak
              </span>
              <span className="font-semibold text-orange-700">{stats.streakDays} days</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Best Streak
              </span>
              <span className="font-semibold text-yellow-700">{stats.longestStreak} days</span>
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

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Streak Freezes
              </span>
              <span className="font-semibold text-blue-700">{stats.streakFreezes} available</span>
            </div>

            {stats.decayedXP > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                  XP Lost to Decay
                </span>
                <span className="font-semibold text-red-700">{formatXP(stats.decayedXP)}</span>
              </div>
            )}
          </div>

          {/* Quiz Variety Stats */}
          {stats.quizAttempts.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Quiz Variety</h4>
              <div className="text-xs text-gray-600">
                <p>Unique quizzes attempted: {stats.quizAttempts.length}</p>
                <p>Total quiz attempts: {stats.quizAttempts.reduce((sum, q) => sum + q.attempts, 0)}</p>
              </div>
            </div>
          )}

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
