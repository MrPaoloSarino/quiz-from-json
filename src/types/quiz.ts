import { EnhancedQuizQuestion } from './user';

export interface QuizQuestion {
  question: string;
  options?: string[];
  answer?: string;
  type?: 'multiple' | 'essay' | 'fill-blank' | 'drag-drop' | 'sequence' | 'matching';
}

export interface QuizState {
  questions: EnhancedQuizQuestion[];
  currentQuestion: number;
  score: number;
  showResults: boolean;
  userAnswers: string[];
  feedback: string | null;
  essayRatings: number[];
  isInterleaved: boolean;
  startTime: Date;
  activeRecallPrompts: string[];
  showActiveRecall: boolean;
  showConfirmation: boolean;
  lockedAnswers: {
    [questionId: string]: {
      answer: string;
      timestamp: number;
      isCorrect: boolean;
    };
  };
  endedEarly: boolean;
  totalAnswered: number;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}
