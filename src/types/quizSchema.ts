import { z } from 'zod';

// QuizQuestion schema (basic, for import and AI)
export const QuizQuestionSchema = z.object({
  question: z.string().min(1, 'Question text is required'),
  options: z.array(z.string()).min(2, 'At least two options required').optional(),
  answer: z.string().optional(),
  type: z.enum(['multiple', 'essay', 'fill-blank', 'drag-drop', 'sequence', 'matching']).optional(),
});

export type QuizQuestionInput = z.infer<typeof QuizQuestionSchema>;

// EnhancedQuizQuestion schema (for internal use)
export const EnhancedQuizQuestionSchema = QuizQuestionSchema.extend({
  id: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()),
  category: z.string(),
  estimatedTime: z.number(),
  explanation: z.string().optional(),
  hints: z.array(z.string()).optional(),
  lastSeen: z.date().optional(),
  attempts: z.number(),
  successRate: z.number(),
  nextReviewDate: z.date().optional(),
  averageTime: z.number(),
  commonMistakes: z.array(z.string()),
  learningObjectives: z.array(z.string()),
  spacedRepetition: z.object({
    lastReviewDate: z.date(),
    nextReviewDate: z.date(),
    interval: z.number(),
    easeFactor: z.number(),
    consecutiveCorrect: z.number(),
    reviewHistory: z.array(z.object({
      date: z.date(),
      performance: z.enum(['again', 'hard', 'good', 'easy']),
      timeSpent: z.number(),
      confidence: z.number(),
      isCorrect: z.boolean(),
    })),
  }),
  analytics: z.object({
    strengthScore: z.number(),
    lastRecallSuccess: z.boolean(),
    recallAttempts: z.number(),
    recallSuccesses: z.number(),
    averageRecallTime: z.number(),
    lastInterleaved: z.date(),
    relatedConcepts: z.array(z.string()),
  }),
  activeRecallPrompts: z.array(z.string()),
  elaborations: z.array(z.string()),
  feynmanExplanation: z.string().optional(),
  isAnswerLocked: z.boolean(),
  submissionTime: z.number().optional(),
  answerHistory: z.array(z.object({
    answer: z.string(),
    timestamp: z.number(),
    isCorrect: z.boolean(),
  })),
});

export type EnhancedQuizQuestionInput = z.infer<typeof EnhancedQuizQuestionSchema>;

// Array schemas
export const QuizQuestionArraySchema = z.array(QuizQuestionSchema);
export const EnhancedQuizQuestionArraySchema = z.array(EnhancedQuizQuestionSchema); 