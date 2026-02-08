/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPREHENSIVE RANKING SYSTEM WITH BALANCE MECHANICS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Features:
 * 1. XP Decay - 1% daily decay after 7 days inactive
 * 2. Diminishing Returns - Repeated quizzes give less XP
 * 3. Difficulty Multipliers - Harder quizzes give more XP
 * 4. Category Mastery - Must excel in all categories for top tier
 * 5. XP Caps - Daily (500 XP) and weekly (2500 XP) limits
 * 6. Streak Protection - Freeze items and streak multipliers
 * 7. Recency Weighting - Recent accuracy weighted 70%, all-time 30%
 * 8. Rank Decay - Drop tier after 14 days inactive
 * 9. Minimum Quiz Requirements - Volume requirements per tier
 * 10. Confidence Intervals - Rank certainty based on quiz count
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface QuizAttemptRecord {
  quizId: string;
  attempts: number;
  lastAttempt: string; // ISO date
}

export interface CategoryStats {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface RecentQuizRecord {
  date: string; // ISO date
  totalQuestions: number;
  correctAnswers: number;
  quizId: string;
  category: string;
}

export interface ExtendedStats {
  // Basic stats
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  streakDays: number;
  longestStreak: number;
  totalTime: number; // in seconds
  quizzesCompleted: number;
  
  // New tracking fields
  lastActivityDate: string; // ISO date
  quizAttempts: QuizAttemptRecord[]; // Track attempts per quiz for diminishing returns
  categoryStats: CategoryStats[]; // Per-category tracking
  recentQuizzes: RecentQuizRecord[]; // Last 30 days for recency weighting
  
  // XP tracking
  rawXP: number; // Before decay
  dailyXPEarned: number;
  dailyXPDate: string; // ISO date to reset daily cap
  weeklyXPEarned: number;
  weeklyXPStartDate: string; // ISO date for weekly reset
  
  // Streak protection
  streakFreezes: number; // Available freeze items
  lastStreakFreezeUsed: string | null; // ISO date
  
  // Decay tracking
  lastDecayApplied: string; // ISO date
  decayedXP: number; // XP lost to decay
  
  // Rank requirements tracking
  rankMaintenanceWarning: boolean; // True if close to rank decay
  daysUntilRankDecay: number;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'board-exam';

export interface RankTier {
  name: string;
  emoji: string;
  minAccuracy: number;
  minQuizzes: number; // Minimum quiz requirement
  requiresAllCategories: boolean;
  minCategoryAccuracy: number;
  color: string;
  bgGradient: string;
}

export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
}

export interface XPGainResult {
  baseXP: number;
  difficultyMultiplier: number;
  diminishingMultiplier: number;
  streakBonus: number;
  cappedXP: number;
  wasFullyCapped: boolean;
  dailyCapRemaining: number;
  weeklyCapRemaining: number;
}

export interface RankResult {
  tier: RankTier;
  confidence: 'low' | 'medium' | 'high';
  confidencePercent: number;
  effectiveAccuracy: number; // Recency-weighted
  meetsQuizRequirement: boolean;
  meetsCategoryRequirement: boolean;
  unmetCategories: string[];
  isAtRisk: boolean; // Rank decay warning
  daysUntilDecay: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const RANK_TIERS: RankTier[] = [
  { 
    name: 'Topnotcher', 
    emoji: '🏆', 
    minAccuracy: 90, 
    minQuizzes: 50,
    requiresAllCategories: true,
    minCategoryAccuracy: 80,
    color: 'text-yellow-600', 
    bgGradient: 'from-yellow-100 to-amber-200' 
  },
  { 
    name: 'Distinguished', 
    emoji: '🎖️', 
    minAccuracy: 85, 
    minQuizzes: 35,
    requiresAllCategories: true,
    minCategoryAccuracy: 75,
    color: 'text-purple-600', 
    bgGradient: 'from-purple-100 to-purple-200' 
  },
  { 
    name: 'Board Passer', 
    emoji: '🏅', 
    minAccuracy: 75, 
    minQuizzes: 20,
    requiresAllCategories: false,
    minCategoryAccuracy: 0,
    color: 'text-green-600', 
    bgGradient: 'from-green-100 to-emerald-200' 
  },
  { 
    name: 'Competent', 
    emoji: '🎯', 
    minAccuracy: 70, 
    minQuizzes: 10,
    requiresAllCategories: false,
    minCategoryAccuracy: 0,
    color: 'text-blue-600', 
    bgGradient: 'from-blue-100 to-blue-200' 
  },
  { 
    name: 'Studious', 
    emoji: '📖', 
    minAccuracy: 60, 
    minQuizzes: 5,
    requiresAllCategories: false,
    minCategoryAccuracy: 0,
    color: 'text-cyan-600', 
    bgGradient: 'from-cyan-100 to-cyan-200' 
  },
  { 
    name: 'Reviewee', 
    emoji: '📝', 
    minAccuracy: 50, 
    minQuizzes: 2,
    requiresAllCategories: false,
    minCategoryAccuracy: 0,
    color: 'text-orange-600', 
    bgGradient: 'from-orange-100 to-orange-200' 
  },
  { 
    name: 'Seedling', 
    emoji: '🌱', 
    minAccuracy: 0, 
    minQuizzes: 0,
    requiresAllCategories: false,
    minCategoryAccuracy: 0,
    color: 'text-gray-600', 
    bgGradient: 'from-gray-100 to-gray-200' 
  },
];

export const LEVELS: LevelInfo[] = [
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

// Balance constants
const XP_DECAY_START_DAYS = 7; // Start decay after 7 days inactive
const XP_DECAY_RATE = 0.01; // 1% per day
const DAILY_XP_CAP = 500;
const WEEKLY_XP_CAP = 2500;
const RANK_DECAY_DAYS = 14; // Drop tier after 14 days inactive
const RECENCY_WEIGHT = 0.7; // 70% weight for recent accuracy
const RECENCY_DAYS = 30; // Consider last 30 days as "recent"

// Difficulty multipliers
const DIFFICULTY_MULTIPLIERS: Record<DifficultyLevel, number> = {
  'easy': 0.5,
  'medium': 1.0,
  'hard': 1.5,
  'board-exam': 2.0,
};

// Diminishing returns on repeated quizzes
const DIMINISHING_RETURNS = [1.0, 0.5, 0.25, 0.1, 0.05]; // 1st, 2nd, 3rd, 4th, 5+ attempts

// Streak multipliers
const STREAK_MULTIPLIERS: [number, number][] = [
  [30, 2.0],  // 30+ days = 2x bonus
  [14, 1.75], // 14+ days = 1.75x
  [7, 1.5],   // 7+ days = 1.5x
  [3, 1.25],  // 3+ days = 1.25x
  [0, 1.0],   // Default
];

// Confidence thresholds based on quiz count
const CONFIDENCE_THRESHOLDS = {
  high: 30,   // 30+ quizzes = high confidence
  medium: 10, // 10+ quizzes = medium confidence
  low: 0,     // <10 quizzes = low confidence
};

// Major categories that need mastery for top tiers
export const MAJOR_CATEGORIES = [
  'Education',
  'Psychology',
  'Assessment',
  'Theory',
  'Clinical',
  'IO Psychology',
  'Developmental',
];

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════════════════

const EXTENDED_STATS_KEY = 'quizmaster_extended_stats';

export const getDefaultExtendedStats = (): ExtendedStats => {
  const today = new Date().toISOString().split('T')[0];
  return {
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    accuracy: 0,
    streakDays: 0,
    longestStreak: 0,
    totalTime: 0,
    quizzesCompleted: 0,
    lastActivityDate: today,
    quizAttempts: [],
    categoryStats: [],
    recentQuizzes: [],
    rawXP: 0,
    dailyXPEarned: 0,
    dailyXPDate: today,
    weeklyXPEarned: 0,
    weeklyXPStartDate: today,
    streakFreezes: 1, // Start with 1 free freeze
    lastStreakFreezeUsed: null,
    lastDecayApplied: today,
    decayedXP: 0,
    rankMaintenanceWarning: false,
    daysUntilRankDecay: RANK_DECAY_DAYS,
  };
};

export const getExtendedStats = (): ExtendedStats => {
  try {
    const stored = localStorage.getItem(EXTENDED_STATS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all fields exist
      return { ...getDefaultExtendedStats(), ...parsed };
    }
    
    // Migration: Check if old stats exist
    const oldStats = localStorage.getItem('quizmaster_local_stats');
    if (oldStats) {
      const old = JSON.parse(oldStats);
      const migrated = migrateFromOldStats(old);
      saveExtendedStats(migrated);
      return migrated;
    }
  } catch (e) {
    console.error('Failed to load extended stats:', e);
  }
  return getDefaultExtendedStats();
};

export const saveExtendedStats = (stats: ExtendedStats): void => {
  try {
    localStorage.setItem(EXTENDED_STATS_KEY, JSON.stringify(stats));
    // Also save to old format for backward compatibility
    localStorage.setItem('quizmaster_local_stats', JSON.stringify({
      totalQuestions: stats.totalQuestions,
      correctAnswers: stats.correctAnswers,
      wrongAnswers: stats.wrongAnswers,
      accuracy: stats.accuracy,
      streakDays: stats.streakDays,
      longestStreak: stats.longestStreak,
      totalTime: stats.totalTime,
      quizzesCompleted: stats.quizzesCompleted,
    }));
  } catch (e) {
    console.error('Failed to save extended stats:', e);
  }
};

/** Migrate from old stats format */
const migrateFromOldStats = (old: Record<string, unknown>): ExtendedStats => {
  const defaults = getDefaultExtendedStats();
  return {
    ...defaults,
    totalQuestions: (old.totalQuestions as number) || 0,
    correctAnswers: (old.correctAnswers as number) || 0,
    wrongAnswers: (old.wrongAnswers as number) || 0,
    accuracy: (old.accuracy as number) || 0,
    streakDays: (old.streakDays as number) || 0,
    longestStreak: (old.longestStreak as number) || 0,
    totalTime: (old.totalTime as number) || 0,
    quizzesCompleted: (old.quizzesCompleted as number) || 0,
    rawXP: calculateRawXP(old),
  };
};

const calculateRawXP = (stats: Record<string, unknown>): number => {
  return (
    ((stats.correctAnswers as number) || 0) * 10 +
    ((stats.quizzesCompleted as number) || 0) * 50 +
    ((stats.longestStreak as number) || 0) * 25 +
    Math.floor(((stats.totalTime as number) || 0) / 60) * 2
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// XP CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Get diminishing returns multiplier for a quiz */
const getDiminishingMultiplier = (quizId: string, attempts: QuizAttemptRecord[]): number => {
  const record = attempts.find(a => a.quizId === quizId);
  if (!record) return DIMINISHING_RETURNS[0];
  const attemptIndex = Math.min(record.attempts, DIMINISHING_RETURNS.length - 1);
  return DIMINISHING_RETURNS[attemptIndex];
};

/** Get streak multiplier */
const getStreakMultiplier = (streakDays: number): number => {
  for (const [minDays, multiplier] of STREAK_MULTIPLIERS) {
    if (streakDays >= minDays) return multiplier;
  }
  return 1.0;
};

/** Calculate XP gain with all modifiers */
export const calculateXPGain = (
  baseCorrectAnswers: number,
  baseQuizBonus: number,
  quizId: string,
  difficulty: DifficultyLevel,
  stats: ExtendedStats
): XPGainResult => {
  const today = new Date().toISOString().split('T')[0];
  
  // Reset daily/weekly caps if needed
  let dailyRemaining = DAILY_XP_CAP - stats.dailyXPEarned;
  let weeklyRemaining = WEEKLY_XP_CAP - stats.weeklyXPEarned;
  
  if (stats.dailyXPDate !== today) {
    dailyRemaining = DAILY_XP_CAP;
  }
  
  const weekStart = getWeekStart(new Date());
  if (stats.weeklyXPStartDate !== weekStart) {
    weeklyRemaining = WEEKLY_XP_CAP;
  }
  
  // Base XP
  const baseXP = (baseCorrectAnswers * 10) + baseQuizBonus;
  
  // Apply difficulty multiplier
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty];
  const afterDifficulty = baseXP * difficultyMultiplier;
  
  // Apply diminishing returns
  const diminishingMultiplier = getDiminishingMultiplier(quizId, stats.quizAttempts);
  const afterDiminishing = afterDifficulty * diminishingMultiplier;
  
  // Apply streak bonus
  const streakMultiplier = getStreakMultiplier(stats.streakDays);
  const streakBonus = afterDiminishing * (streakMultiplier - 1);
  const afterStreak = afterDiminishing + streakBonus;
  
  // Apply caps
  const cappedByDaily = Math.min(afterStreak, dailyRemaining);
  const cappedByWeekly = Math.min(cappedByDaily, weeklyRemaining);
  const cappedXP = Math.max(0, Math.round(cappedByWeekly));
  
  const wasFullyCapped = cappedXP < afterStreak;
  
  return {
    baseXP,
    difficultyMultiplier,
    diminishingMultiplier,
    streakBonus: Math.round(streakBonus),
    cappedXP,
    wasFullyCapped,
    dailyCapRemaining: Math.max(0, dailyRemaining - cappedXP),
    weeklyCapRemaining: Math.max(0, weeklyRemaining - cappedXP),
  };
};

/** Apply XP decay based on inactivity */
export const applyXPDecay = (stats: ExtendedStats): ExtendedStats => {
  const today = new Date();
  const lastActivity = new Date(stats.lastActivityDate);
  const daysSinceActivity = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceActivity <= XP_DECAY_START_DAYS) {
    return stats;
  }
  
  const lastDecay = new Date(stats.lastDecayApplied);
  const daysSinceDecay = Math.floor((today.getTime() - lastDecay.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceDecay < 1) {
    return stats;
  }
  
  // Apply decay for each day since last decay application
  const decayDays = Math.min(daysSinceDecay, daysSinceActivity - XP_DECAY_START_DAYS);
  if (decayDays <= 0) return stats;
  
  const decayMultiplier = Math.pow(1 - XP_DECAY_RATE, decayDays);
  const newRawXP = Math.round(stats.rawXP * decayMultiplier);
  const decayAmount = stats.rawXP - newRawXP;
  
  return {
    ...stats,
    rawXP: newRawXP,
    decayedXP: stats.decayedXP + decayAmount,
    lastDecayApplied: today.toISOString().split('T')[0],
  };
};

/** Get effective XP after decay */
export const getEffectiveXP = (stats: ExtendedStats): number => {
  const decayed = applyXPDecay(stats);
  return decayed.rawXP;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ACCURACY CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Calculate recency-weighted accuracy */
export const calculateEffectiveAccuracy = (stats: ExtendedStats): number => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - RECENCY_DAYS * 24 * 60 * 60 * 1000);
  
  // Filter recent quizzes
  const recentQuizzes = stats.recentQuizzes.filter(q => 
    new Date(q.date) >= thirtyDaysAgo
  );
  
  // Calculate recent accuracy
  let recentTotal = 0;
  let recentCorrect = 0;
  recentQuizzes.forEach(q => {
    recentTotal += q.totalQuestions;
    recentCorrect += q.correctAnswers;
  });
  const recentAccuracy = recentTotal > 0 ? (recentCorrect / recentTotal) * 100 : 0;
  
  // All-time accuracy
  const allTimeAccuracy = stats.accuracy;
  
  // If no recent data, use all-time
  if (recentTotal === 0) {
    return allTimeAccuracy;
  }
  
  // Weighted combination
  const effectiveAccuracy = (RECENCY_WEIGHT * recentAccuracy) + ((1 - RECENCY_WEIGHT) * allTimeAccuracy);
  
  return Math.round(effectiveAccuracy);
};

// ═══════════════════════════════════════════════════════════════════════════════
// RANK CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Calculate confidence level based on quiz count */
const getConfidence = (quizCount: number): { level: 'low' | 'medium' | 'high'; percent: number } => {
  if (quizCount >= CONFIDENCE_THRESHOLDS.high) {
    return { level: 'high', percent: 95 };
  } else if (quizCount >= CONFIDENCE_THRESHOLDS.medium) {
    // Linear interpolation between medium and high
    const range = CONFIDENCE_THRESHOLDS.high - CONFIDENCE_THRESHOLDS.medium;
    const progress = (quizCount - CONFIDENCE_THRESHOLDS.medium) / range;
    return { level: 'medium', percent: Math.round(70 + progress * 25) };
  } else {
    // Linear interpolation for low confidence
    const progress = quizCount / CONFIDENCE_THRESHOLDS.medium;
    return { level: 'low', percent: Math.round(40 + progress * 30) };
  }
};

/** Check if category mastery requirements are met */
const checkCategoryMastery = (
  stats: ExtendedStats, 
  tier: RankTier
): { met: boolean; unmetCategories: string[] } => {
  if (!tier.requiresAllCategories) {
    return { met: true, unmetCategories: [] };
  }
  
  const unmet: string[] = [];
  
  for (const majorCategory of MAJOR_CATEGORIES) {
    const catStat = stats.categoryStats.find(c => 
      c.category.toLowerCase().includes(majorCategory.toLowerCase()) ||
      majorCategory.toLowerCase().includes(c.category.toLowerCase())
    );
    
    if (!catStat || catStat.accuracy < tier.minCategoryAccuracy) {
      unmet.push(majorCategory);
    }
  }
  
  return { met: unmet.length === 0, unmetCategories: unmet };
};

/** Calculate days until rank decay */
const calculateDaysUntilRankDecay = (stats: ExtendedStats): number => {
  const today = new Date();
  const lastActivity = new Date(stats.lastActivityDate);
  const daysSinceActivity = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, RANK_DECAY_DAYS - daysSinceActivity);
};

/** Get full rank result with all checks */
export const getRankResult = (stats: ExtendedStats): RankResult => {
  const effectiveAccuracy = calculateEffectiveAccuracy(stats);
  const confidence = getConfidence(stats.quizzesCompleted);
  const daysUntilDecay = calculateDaysUntilRankDecay(stats);
  const isAtRisk = daysUntilDecay <= 3 && daysUntilDecay > 0;
  
  // Apply rank decay if inactive too long
  let adjustedAccuracy = effectiveAccuracy;
  if (daysUntilDecay === 0) {
    // Force drop one tier by reducing effective accuracy
    adjustedAccuracy = Math.max(0, effectiveAccuracy - 10);
  }
  
  // Find matching tier
  let matchedTier: RankTier = RANK_TIERS[RANK_TIERS.length - 1];
  
  for (const tier of RANK_TIERS) {
    // Check accuracy requirement
    if (adjustedAccuracy < tier.minAccuracy) continue;
    
    // Check quiz count requirement
    if (stats.quizzesCompleted < tier.minQuizzes) continue;
    
    // Check category mastery
    const catCheck = checkCategoryMastery(stats, tier);
    if (!catCheck.met) continue;
    
    matchedTier = tier;
    break;
  }
  
  const categoryCheck = checkCategoryMastery(stats, matchedTier);
  
  return {
    tier: matchedTier,
    confidence: confidence.level,
    confidencePercent: confidence.percent,
    effectiveAccuracy,
    meetsQuizRequirement: stats.quizzesCompleted >= matchedTier.minQuizzes,
    meetsCategoryRequirement: categoryCheck.met,
    unmetCategories: categoryCheck.unmetCategories,
    isAtRisk,
    daysUntilDecay,
  };
};

/** Get next achievable rank tier */
export const getNextRankTier = (stats: ExtendedStats): RankTier | null => {
  const current = getRankResult(stats);
  const currentIndex = RANK_TIERS.findIndex(t => t.name === current.tier.name);
  
  if (currentIndex <= 0) return null; // Already at highest tier
  
  return RANK_TIERS[currentIndex - 1];
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Get current level info */
export const getLevelInfo = (xp: number): { 
  current: LevelInfo; 
  next: LevelInfo | null; 
  progress: number;
  xpToNext: number;
} => {
  let current = LEVELS[0];
  let next: LevelInfo | null = LEVELS[1];
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  
  let progress = 100;
  let xpToNext = 0;
  
  if (next) {
    const xpInCurrentLevel = xp - current.xpRequired;
    const xpNeededForNext = next.xpRequired - current.xpRequired;
    progress = Math.round((xpInCurrentLevel / xpNeededForNext) * 100);
    xpToNext = next.xpRequired - xp;
  }
  
  return { current, next, progress, xpToNext };
};

// ═══════════════════════════════════════════════════════════════════════════════
// STREAK MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/** Check if streak freeze should be used */
export const shouldUseStreakFreeze = (stats: ExtendedStats): boolean => {
  if (stats.streakFreezes <= 0) return false;
  
  const today = new Date();
  const lastActivity = new Date(stats.lastActivityDate);
  const daysSince = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  // Use freeze if missed exactly 1 day and have a streak worth protecting
  return daysSince === 1 && stats.streakDays >= 3;
};

/** Use a streak freeze */
export const useStreakFreeze = (stats: ExtendedStats): ExtendedStats => {
  if (stats.streakFreezes <= 0) return stats;
  
  return {
    ...stats,
    streakFreezes: stats.streakFreezes - 1,
    lastStreakFreezeUsed: new Date().toISOString().split('T')[0],
    lastActivityDate: new Date().toISOString().split('T')[0],
  };
};

/** Award streak freeze (e.g., weekly login bonus) */
export const awardStreakFreeze = (stats: ExtendedStats): ExtendedStats => {
  const maxFreezes = 3;
  return {
    ...stats,
    streakFreezes: Math.min(stats.streakFreezes + 1, maxFreezes),
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ COMPLETION UPDATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface QuizCompletionData {
  quizId: string;
  quizTitle: string;
  category: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
}

/** Update stats after completing a quiz */
export const updateStatsAfterQuizCompletion = (
  data: QuizCompletionData
): { stats: ExtendedStats; xpGain: XPGainResult } => {
  let stats = getExtendedStats();
  const today = new Date().toISOString().split('T')[0];
  
  // Apply any pending XP decay first
  stats = applyXPDecay(stats);
  
  // Reset daily cap if new day
  if (stats.dailyXPDate !== today) {
    stats.dailyXPEarned = 0;
    stats.dailyXPDate = today;
  }
  
  // Reset weekly cap if new week
  const weekStart = getWeekStart(new Date());
  if (stats.weeklyXPStartDate !== weekStart) {
    stats.weeklyXPEarned = 0;
    stats.weeklyXPStartDate = weekStart;
  }
  
  // Update quiz attempts for diminishing returns
  const attemptIndex = stats.quizAttempts.findIndex(a => a.quizId === data.quizId);
  if (attemptIndex >= 0) {
    stats.quizAttempts[attemptIndex].attempts += 1;
    stats.quizAttempts[attemptIndex].lastAttempt = today;
  } else {
    stats.quizAttempts.push({
      quizId: data.quizId,
      attempts: 1,
      lastAttempt: today,
    });
  }
  
  // Calculate XP gain with all modifiers
  const xpGain = calculateXPGain(
    data.correctAnswers,
    50, // Quiz completion bonus
    data.quizId,
    data.difficulty,
    stats
  );
  
  // Update basic stats
  const wrongAnswers = data.totalQuestions - data.correctAnswers;
  stats.totalQuestions += data.totalQuestions;
  stats.correctAnswers += data.correctAnswers;
  stats.wrongAnswers += wrongAnswers;
  stats.accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
    : 0;
  stats.totalTime += data.timeSpentSeconds;
  stats.quizzesCompleted += 1;
  
  // Update streak
  const lastQuizDate = localStorage.getItem('quizmaster_last_quiz_date');
  if (lastQuizDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastQuizDate === yesterday) {
      stats.streakDays += 1;
    } else if (shouldUseStreakFreeze(stats)) {
      stats = useStreakFreeze(stats);
    } else {
      stats.streakDays = 1;
    }
    localStorage.setItem('quizmaster_last_quiz_date', today);
  }
  stats.longestStreak = Math.max(stats.longestStreak, stats.streakDays);
  
  // Award weekly streak freeze if streak reaches 7
  if (stats.streakDays > 0 && stats.streakDays % 7 === 0) {
    stats = awardStreakFreeze(stats);
  }
  
  // Update XP
  stats.rawXP += xpGain.cappedXP;
  stats.dailyXPEarned += xpGain.cappedXP;
  stats.weeklyXPEarned += xpGain.cappedXP;
  
  // Update category stats
  const catIndex = stats.categoryStats.findIndex(c => c.category === data.category);
  if (catIndex >= 0) {
    stats.categoryStats[catIndex].totalQuestions += data.totalQuestions;
    stats.categoryStats[catIndex].correctAnswers += data.correctAnswers;
    stats.categoryStats[catIndex].accuracy = Math.round(
      (stats.categoryStats[catIndex].correctAnswers / stats.categoryStats[catIndex].totalQuestions) * 100
    );
  } else {
    stats.categoryStats.push({
      category: data.category,
      totalQuestions: data.totalQuestions,
      correctAnswers: data.correctAnswers,
      accuracy: Math.round((data.correctAnswers / data.totalQuestions) * 100),
    });
  }
  
  // Add to recent quizzes (keep last 100)
  stats.recentQuizzes.unshift({
    date: today,
    quizId: data.quizId,
    totalQuestions: data.totalQuestions,
    correctAnswers: data.correctAnswers,
    category: data.category,
  });
  if (stats.recentQuizzes.length > 100) {
    stats.recentQuizzes = stats.recentQuizzes.slice(0, 100);
  }
  
  // Update activity date and rank decay status
  stats.lastActivityDate = today;
  stats.daysUntilRankDecay = RANK_DECAY_DAYS;
  stats.rankMaintenanceWarning = false;
  
  // Save stats
  saveExtendedStats(stats);
  
  return { stats, xpGain };
};

// ═══════════════════════════════════════════════════════════════════════════════
// BOARD READINESS SCORE
// ═══════════════════════════════════════════════════════════════════════════════

/** Calculate comprehensive board readiness score */
export const calculateBoardReadinessScore = (stats: ExtendedStats): number => {
  const effectiveAccuracy = calculateEffectiveAccuracy(stats);
  
  // Normalize each component to 0-100 scale
  const accuracyScore = effectiveAccuracy;
  const volumeScore = Math.min(stats.totalQuestions / 500, 1) * 100;
  const streakScore = Math.min(stats.longestStreak / 30, 1) * 100;
  const timeScore = Math.min(stats.totalTime / 36000, 1) * 100; // 10 hours max
  const completionScore = Math.min(stats.quizzesCompleted / 20, 1) * 100;
  
  // Category coverage score
  const categoryCoverage = stats.categoryStats.length / MAJOR_CATEGORIES.length;
  const coverageScore = Math.min(categoryCoverage, 1) * 100;
  
  // Weighted composite
  const score = (
    (0.40 * accuracyScore) +
    (0.15 * volumeScore) +
    (0.15 * streakScore) +
    (0.10 * timeScore) +
    (0.10 * completionScore) +
    (0.10 * coverageScore)
  );
  
  return Math.round(score);
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Get start of current week (Monday) */
const getWeekStart = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
};

/** Format XP with K notation for large numbers */
export const formatXP = (xp: number): string => {
  if (xp >= 10000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toLocaleString();
};

/** Get difficulty label and color */
export const getDifficultyInfo = (difficulty: DifficultyLevel): { label: string; color: string; multiplier: number } => {
  const info = {
    'easy': { label: 'Easy', color: 'text-green-600', multiplier: 0.5 },
    'medium': { label: 'Medium', color: 'text-yellow-600', multiplier: 1.0 },
    'hard': { label: 'Hard', color: 'text-orange-600', multiplier: 1.5 },
    'board-exam': { label: 'Board Exam', color: 'text-red-600', multiplier: 2.0 },
  };
  return info[difficulty];
};

/** Reset all stats */
export const resetAllStats = (): void => {
  const defaults = getDefaultExtendedStats();
  saveExtendedStats(defaults);
  localStorage.removeItem('quizmaster_last_quiz_date');
};

// ═══════════════════════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY - Legacy updateStatsAfterQuiz function
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Legacy function for backward compatibility with existing code.
 * Wraps the new updateStatsAfterQuizCompletion with sensible defaults.
 */
export const updateStatsAfterQuiz = (
  totalAnswered: number,
  correctCount: number,
  timeSpentSeconds: number
): void => {
  // Generate a unique quiz ID based on timestamp (for basic tracking)
  const quizId = `legacy_quiz_${Date.now()}`;
  
  // Use medium difficulty as default for legacy calls
  updateStatsAfterQuizCompletion({
    quizId,
    quizTitle: 'Quiz Session',
    category: 'General',
    difficulty: 'medium',
    totalQuestions: totalAnswered,
    correctAnswers: correctCount,
    timeSpentSeconds,
  });
};
