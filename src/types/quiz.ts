
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestion: number;
  score: number;
  showResults: boolean;
  userAnswers: string[];
  feedback: string | null;
}

export interface GeminiResponse {
  content: {
    parts: {
      text: string;
    }[];
  };
}
