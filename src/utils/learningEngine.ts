import {
  SpacedRepetitionConfig,
  MemoryStage,
  CognitiveLoadMetrics,
  MasteryLevel,
  LearningProgress,
  AdaptiveSettings,
  FeedbackConfig,
  LearningAnalytics,
  LearningState
} from '@/types/learning';

// Spaced Repetition Algorithm (based on SuperMemo SM-2)
export const calculateNextReview = (
  config: SpacedRepetitionConfig,
  performance: 'perfect' | 'good' | 'medium' | 'hard',
  currentInterval: number
): number => {
  const modifier = config.intervalModifier[performance];
  const newInterval = currentInterval * modifier * config.easeFactor;
  return Math.max(config.initialInterval, Math.round(newInterval));
};

// Cognitive Load Assessment
export const assessCognitiveLoad = (
  elementInteractivity: number,
  priorKnowledge: number,
  interfaceComplexity: number,
  timeSpent: number,
  expectedTime: number
): CognitiveLoadMetrics => {
  return {
    intrinsic: {
      elementInteractivity,
      priorKnowledge,
      conceptualDifficulty: 1 - priorKnowledge
    },
    extraneous: {
      interfaceComplexity,
      distractions: timeSpent > expectedTime * 1.5 ? 0.8 : 0.2,
      presentationClarity: 1 - interfaceComplexity
    },
    germane: {
      schemaConstruction: priorKnowledge * 0.7,
      mentalModels: elementInteractivity * 0.6,
      patternRecognition: priorKnowledge * 0.8
    }
  };
};

// Mastery Level Determination
export const determineMasteryLevel = (
  accuracy: number,
  speed: number,
  consistency: number
): MasteryLevel => {
  if (accuracy >= 0.95 && speed <= 0.8 && consistency >= 0.9) {
    return {
      level: 'expert',
      characteristics: ['automatic_performance', 'intuitive_grasp', 'innovative_solutions'],
      requirements: { accuracy: 0.95, speed: 0.8, consistency: 0.9 },
      supportNeeded: ['research_opportunities', 'teaching_others']
    };
  } else if (accuracy >= 0.85 && speed <= 1.0 && consistency >= 0.8) {
    return {
      level: 'proficient',
      characteristics: ['intuitive_understanding', 'holistic_perspective'],
      requirements: { accuracy: 0.85, speed: 1.0, consistency: 0.8 },
      supportNeeded: ['real_world_problems', 'mentoring_others']
    };
  } else if (accuracy >= 0.75 && speed <= 1.2 && consistency >= 0.7) {
    return {
      level: 'competent',
      characteristics: ['sees_whole_picture', 'independent_planning'],
      requirements: { accuracy: 0.75, speed: 1.2, consistency: 0.7 },
      supportNeeded: ['complex_scenarios', 'decision_making']
    };
  } else if (accuracy >= 0.65 && speed <= 1.5 && consistency >= 0.6) {
    return {
      level: 'advanced_beginner',
      characteristics: ['recognizes_patterns', 'situational_perception'],
      requirements: { accuracy: 0.65, speed: 1.5, consistency: 0.6 },
      supportNeeded: ['guided_practice', 'case_studies']
    };
  } else {
    return {
      level: 'novice',
      characteristics: ['relies_on_rules', 'needs_context'],
      requirements: { accuracy: 0.5, speed: 2.0, consistency: 0.5 },
      supportNeeded: ['clear_instructions', 'immediate_feedback']
    };
  }
};

// Adaptive Difficulty Adjustment
export const adjustDifficulty = (
  settings: AdaptiveSettings,
  performance: number,
  timeSpent: number,
  confidence: number
): AdaptiveSettings => {
  const newSettings = { ...settings };

  // Adjust difficulty based on performance
  if (performance >= 0.85 && timeSpent < settings.timeAllowed * 0.8) {
    newSettings.currentDifficulty = Math.min(1, settings.currentDifficulty + 0.1);
    newSettings.scaffoldingLevel = Math.max(0, settings.scaffoldingLevel - 0.1);
  } else if (performance <= 0.6 || timeSpent > settings.timeAllowed * 1.2) {
    newSettings.currentDifficulty = Math.max(0, settings.currentDifficulty - 0.1);
    newSettings.scaffoldingLevel = Math.min(1, settings.scaffoldingLevel + 0.1);
  }

  // Adjust time allowed based on performance pattern
  newSettings.timeAllowed = Math.round(
    settings.timeAllowed * (1 + (0.7 - performance) * 0.2)
  );

  // Adjust hint availability based on confidence
  newSettings.hintAvailability = Math.min(1, Math.max(0,
    settings.hintAvailability + (3 - confidence) * 0.1
  ));

  return newSettings;
};

// Feedback Generation
export const generateFeedback = (
  config: FeedbackConfig,
  performance: number,
  timeSpent: number,
  masteryLevel: MasteryLevel
): string[] => {
  const feedback: string[] = [];

  if (config.components.correctness) {
    feedback.push(performance >= 0.8 
      ? "Excellent work! Your understanding is solid."
      : "Keep practicing! There's room for improvement.");
  }

  if (config.components.explanation && performance < 0.8) {
    feedback.push("Focus on understanding the core concepts before moving forward.");
  }

  if (config.components.misconceptions && performance < 0.7) {
    feedback.push("Review the fundamental principles to address any misconceptions.");
  }

  if (config.components.improvement) {
    if (timeSpent > 120) {
      feedback.push("Try to improve your speed while maintaining accuracy.");
    }
    if (masteryLevel.level === 'novice') {
      feedback.push("Start with the basics and gradually increase complexity.");
    }
  }

  return feedback;
};

// Learning Analytics Update
export const updateAnalytics = (
  current: LearningAnalytics,
  performance: number,
  timeSpent: number,
  timestamp: Date
): LearningAnalytics => {
  const newAnalytics = { ...current };

  // Update performance metrics
  newAnalytics.performance = {
    accuracy: (current.performance.accuracy * 0.7 + performance * 0.3),
    speed: (current.performance.speed * 0.7 + (timeSpent / 60) * 0.3),
    consistency: calculateConsistency(current.performance.accuracy, performance),
    improvement: calculateImprovement(current.performance.accuracy, performance)
  };

  // Update cognitive metrics
  newAnalytics.cognitive = {
    ...current.cognitive,
    loadLevel: calculateLoadLevel(timeSpent, performance),
    attentionSpan: updateAttentionSpan(current.cognitive.attentionSpan, timeSpent),
    fatigueIndex: calculateFatigueIndex(timeSpent, performance)
  };

  // Update behavioral metrics
  newAnalytics.behavioral = {
    ...current.behavioral,
    studyPatterns: updateStudyPatterns(current.behavioral.studyPatterns, timestamp),
    revisionFrequency: current.behavioral.revisionFrequency + 1
  };

  return newAnalytics;
};

// Helper functions
const calculateConsistency = (previousAccuracy: number, currentAccuracy: number): number => {
  return 1 - Math.abs(previousAccuracy - currentAccuracy);
};

const calculateImprovement = (previousAccuracy: number, currentAccuracy: number): number => {
  return Math.max(0, currentAccuracy - previousAccuracy);
};

const calculateLoadLevel = (timeSpent: number, performance: number): number => {
  return Math.min(1, (timeSpent / 120) * (1 - performance));
};

const updateAttentionSpan = (currentSpan: number, timeSpent: number): number => {
  return Math.round((currentSpan * 0.7 + timeSpent * 0.3) / 60);
};

const calculateFatigueIndex = (timeSpent: number, performance: number): number => {
  return Math.min(1, (timeSpent / 180) * (1 - performance));
};

const updateStudyPatterns = (
  current: LearningAnalytics['behavioral']['studyPatterns'],
  timestamp: Date
): LearningAnalytics['behavioral']['studyPatterns'] => {
  const hour = timestamp.getHours();
  return {
    timeOfDay: [...new Set([...current.timeOfDay, `${hour}:00`])],
    duration: [...current.duration, 1],
    frequency: current.frequency + 1
  };
}; 