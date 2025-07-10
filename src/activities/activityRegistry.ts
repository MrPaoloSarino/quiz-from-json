import type { LearningActivityType } from '@/types/learning';
import { z } from 'zod';

export interface ActivityModule {
  type: LearningActivityType;
  displayName: string;
  description?: string;
  icon?: React.ReactNode;
  schema: z.ZodTypeAny;
}

// Zod schemas for activity data
export const quizActivitySchema = z.object({
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    answer: z.string(),
    type: z.string().optional(),
  })),
  // Add more quiz-specific fields as needed
});

export const reflectionActivitySchema = z.object({
  journalText: z.string(),
  date: z.string(),
  // Add more reflection-specific fields as needed
});

// Registry of all supported activity types
export const activityRegistry: ActivityModule[] = [
  {
    type: 'quiz',
    displayName: 'Quiz',
    description: 'Test your knowledge with questions and answers.',
    schema: quizActivitySchema,
  },
  {
    type: 'reflection',
    displayName: 'Reflection Journal',
    description: 'Write and track your learning reflections.',
    schema: reflectionActivitySchema,
  },
  // Add more activity types here as needed
]; 