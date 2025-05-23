export interface QuizQuestion {
  question: string;
  options?: string[];
  answer?: string;
  type?: 'multiple' | 'essay';
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestion: number;
  score: number;
  showResults: boolean;
  userAnswers: string[];
  feedback: string | null;
  essayRatings: number[];
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
