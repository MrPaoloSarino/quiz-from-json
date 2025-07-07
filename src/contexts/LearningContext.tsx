  import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { LearningState, Assumption } from '@/types/learning';
import {
  calculateNextReview,
  assessCognitiveLoad,
  determineMasteryLevel,
  adjustDifficulty,
  updateAnalytics
} from '@/utils/learningEngine';

// Initial state
// Add to initial state
const initialLearningState: LearningState = {
  spacedRepetition: {
    initialInterval: 24,  // hours
    easeFactor: 2.5,
    intervalModifier: {
      perfect: 2.5,
      good: 2.0,
      medium: 1.5,
      hard: 1.0
    },
    optimalSpacing: {
      easy: 7,
      medium: 4,
      hard: 2,
      struggling: 1
    }
  },
  memoryStage: {
    sensory: {
      duration: 500,      // milliseconds
      capacity: Infinity,
      characteristics: ['brief', 'unfiltered', 'raw']
    },
    shortTerm: {
      duration: 30,       // seconds
      capacity: 7,        // Miller's Law (7±2)
      characteristics: ['limited', 'conscious', 'working']
    },
    longTerm: {
      retentionRate: 0.7,
      connections: 0,
      lastReview: new Date()
    }
  },
  cognitiveLoad: {
    intrinsic: {
      elementInteractivity: 0.5,
      priorKnowledge: 0.5,
      conceptualDifficulty: 0.5
    },
    extraneous: {
      interfaceComplexity: 0.3,
      distractions: 0.2,
      presentationClarity: 0.8
    },
    germane: {
      schemaConstruction: 0.5,
      mentalModels: 0.5,
      patternRecognition: 0.5
    }
  },
  mastery: {
    currentLevel: {
      level: 'novice',
      characteristics: ['relies_on_rules', 'needs_context'],
      requirements: {
        accuracy: 0.5,
        speed: 2.0,
        consistency: 0.5
      },
      supportNeeded: ['clear_instructions', 'immediate_feedback']
    },
    masteryScore: 0,
    retentionRate: 0,
    confidenceScore: 3,
    lastAssessment: new Date(),
    improvements: []
  },
  adaptive: {
    currentDifficulty: 0.5,
    scaffoldingLevel: 0.5,
    timeAllowed: 120,     // seconds
    hintAvailability: 0.5,
    adaptationRules: [
      {
        metric: 'performance',
        threshold: 0.8,
        adjustment: 0.1
      }
    ]
  },
  feedback: {
    timing: 'immediate',
    detail: 'basic',
    components: {
      correctness: true,
      explanation: true,
      examples: true,
      misconceptions: true,
      improvement: true
    },
    style: 'encouraging'
  },
  analytics: {
    performance: {
      accuracy: 0,
      speed: 1,
      consistency: 0,
      improvement: 0
    },
    cognitive: {
      loadLevel: 0.5,
      attentionSpan: 30,
      fatigueIndex: 0,
      optimalTimes: []
    },
    behavioral: {
      studyPatterns: {
        timeOfDay: [],
        duration: [],
        frequency: 0
      },
      strugglePoints: [],
      revisionFrequency: 0
    }
  }
};

// Action types
// Add new action types
type LearningAction =
  | { type: 'ADD_AI_EXPLANATION'; payload: { questionId: string; explanation: AIExplanation } }
  | { type: 'QUEUE_EXPLANATION'; payload: { questionId: string; question: string; userAnswer: string } }
  | { type: 'SET_EXPLANATION_STATUS'; payload: { isProcessing: boolean; currentQuestionId: string | null; error: string | null } }
  | { type: 'UPDATE_SPACED_REPETITION'; payload: { performance: 'perfect' | 'good' | 'medium' | 'hard' } }
  | { type: 'UPDATE_COGNITIVE_LOAD'; payload: { timeSpent: number; performance: number } }
  | { type: 'UPDATE_MASTERY'; payload: { accuracy: number; speed: number; timeSpent: number } }
  | { type: 'UPDATE_ADAPTIVE_SETTINGS'; payload: { performance: number; timeSpent: number; confidence: number } }
  | { type: 'UPDATE_ANALYTICS'; payload: { performance: number; timeSpent: number } }
  | { type: 'RESET_STATE' }
  | { type: 'ADD_ASSUMPTION'; payload: { assumption: Assumption } }
  | { type: 'UPDATE_ASSUMPTION'; payload: { id: string; updates: Partial<Assumption> } }
  | { type: 'REMOVE_ASSUMPTION'; payload: { id: string } };

// Add this type definition at the top or near the action types
// If you want to move it to types/learning.ts later, you can
export type AIExplanation = {
  text: string;
  source?: string;
  confidence?: number;
};

// Reducer
const learningReducer = (state: LearningState, action: LearningAction): LearningState => {
  switch (action.type) {
    case 'UPDATE_SPACED_REPETITION':
      const newInterval = calculateNextReview(
        state.spacedRepetition,
        action.payload.performance,
        state.spacedRepetition.initialInterval
      );
      return {
        ...state,
        spacedRepetition: {
          ...state.spacedRepetition,
          initialInterval: newInterval
        }
      };

    case 'UPDATE_COGNITIVE_LOAD':
      const newLoad = assessCognitiveLoad(
        state.cognitiveLoad.intrinsic.elementInteractivity,
        state.cognitiveLoad.intrinsic.priorKnowledge,
        state.cognitiveLoad.extraneous.interfaceComplexity,
        action.payload.timeSpent,
        state.adaptive.timeAllowed
      );
      return {
        ...state,
        cognitiveLoad: newLoad
      };

    case 'UPDATE_MASTERY':
      const newMasteryLevel = determineMasteryLevel(
        action.payload.accuracy,
        action.payload.speed,
        state.mastery.currentLevel.requirements.consistency
      );
      return {
        ...state,
        mastery: {
          ...state.mastery,
          currentLevel: newMasteryLevel,
          masteryScore: action.payload.accuracy,
          lastAssessment: new Date(),
          improvements: [
            ...state.mastery.improvements,
            {
              date: new Date(),
              metric: 'accuracy',
              change: action.payload.accuracy - state.mastery.masteryScore
            }
          ]
        }
      };

    case 'UPDATE_ADAPTIVE_SETTINGS':
      const newSettings = adjustDifficulty(
        state.adaptive,
        action.payload.performance,
        action.payload.timeSpent,
        action.payload.confidence
      );
      return {
        ...state,
        adaptive: newSettings
      };

    case 'UPDATE_ANALYTICS':
      const newAnalytics = updateAnalytics(
        state.analytics,
        action.payload.performance,
        action.payload.timeSpent,
        new Date()
      );
      return {
        ...state,
        analytics: newAnalytics
      };

    case 'RESET_STATE':
      return initialLearningState;

    case 'ADD_ASSUMPTION':
      return {
        ...state,
        assumptions: [...(state.assumptions || []), action.payload.assumption]
      };
    case 'UPDATE_ASSUMPTION':
      return {
        ...state,
        assumptions: (state.assumptions || []).map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        )
      };
    case 'REMOVE_ASSUMPTION':
      return {
        ...state,
        assumptions: (state.assumptions || []).filter(a => a.id !== action.payload.id)
      };

    default:
      return state;
  }
};

// Context
const LearningContext = createContext<{
  state: LearningState;
  dispatch: React.Dispatch<LearningAction>;
} | undefined>(undefined);

// Provider component
export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(learningReducer, initialLearningState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('learningState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState) as LearningState;
        // Convert date strings back to Date objects
        parsed.mastery.lastAssessment = new Date(parsed.mastery.lastAssessment);
        parsed.memoryStage.longTerm.lastReview = new Date(parsed.memoryStage.longTerm.lastReview);
        parsed.mastery.improvements = parsed.mastery.improvements.map((imp) => ({
          ...imp,
          date: new Date(imp.date)
        }));
        
        // Type-safe updates
        if (parsed.analytics) {
          dispatch({
            type: 'UPDATE_ANALYTICS',
            payload: {
              performance: parsed.analytics.performance.accuracy,
              timeSpent: parsed.analytics.performance.speed * 60 // convert to seconds
            }
          });
        }
        
        if (parsed.mastery) {
          dispatch({
            type: 'UPDATE_MASTERY',
            payload: {
              accuracy: parsed.mastery.masteryScore,
              speed: parsed.mastery.currentLevel.requirements.speed,
              timeSpent: 0 // No historical time data
            }
          });
        }
        
        if (parsed.adaptive) {
          dispatch({
            type: 'UPDATE_ADAPTIVE_SETTINGS',
            payload: {
              performance: parsed.analytics.performance.accuracy,
              timeSpent: parsed.analytics.performance.speed * 60,
              confidence: parsed.mastery.confidenceScore
            }
          });
        }
        
        if (parsed.cognitiveLoad) {
          dispatch({
            type: 'UPDATE_COGNITIVE_LOAD',
            payload: {
              timeSpent: parsed.analytics.performance.speed * 60,
              performance: parsed.analytics.performance.accuracy
            }
          });
        }
      } catch (error) {
        console.error('Error loading learning state:', error);
      }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('learningState', JSON.stringify(state));
  }, [state]);

  return (
    <LearningContext.Provider value={{ state, dispatch }}>
      {children}
    </LearningContext.Provider>
  );
};

// Custom hook for using the learning context
export const useLearning = () => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};