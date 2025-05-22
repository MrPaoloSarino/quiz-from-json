import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuizQuestion } from "@/types/quiz";
import { toast } from "sonner";

interface JsonInputProps {
  onQuizStart: (questions: QuizQuestion[]) => void;
}

const JsonInput: React.FC<JsonInputProps> = ({ onQuizStart }) => {
  const [jsonInput, setJsonInput] = useState<string>(`[
  {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5"],
    "answer": "4"
  },
  {
    "question": "Capital of France?",
    "options": ["Paris", "Rome", "Berlin"],
    "answer": "Paris"
  }
]`);
  const [error, setError] = useState<string | null>(null);

  const validateQuestions = (questions: any[]): questions is QuizQuestion[] => {
    if (!Array.isArray(questions)) return false;
    return questions.every(q => {
      if (q.type === 'essay') {
        return typeof q === 'object' && typeof q.question === 'string' && (!q.options || Array.isArray(q.options)) && (!q.answer || typeof q.answer === 'string');
      }
      // Default to multiple choice
      return (
        typeof q === 'object' &&
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.every((opt: any) => typeof opt === 'string') &&
        typeof q.answer === 'string' &&
        q.options.includes(q.answer)
      );
    });
  };

  const handleStartQuiz = () => {
    try {
      setError(null);
      const parsedQuestions = JSON.parse(jsonInput);
      
      if (!validateQuestions(parsedQuestions)) {
        setError("Invalid format. Each question must have a 'question' string, 'options' array of strings, and an 'answer' string that is included in the options.");
        return;
      }
      
      if (parsedQuestions.length === 0) {
        setError("Quiz must contain at least one question.");
        return;
      }

      onQuizStart(parsedQuestions);
      toast.success("Quiz loaded successfully!");
    } catch (err) {
      setError("Invalid JSON. Please check your input.");
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create Your Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="jsonInput" className="block text-sm font-medium mb-2">
              Paste your quiz JSON below:
            </label>
            <Textarea
              id="jsonInput"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={12}
              className="font-mono text-sm"
              placeholder="Paste your JSON quiz data here..."
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleStartQuiz}
          className="w-full bg-quiz-primary hover:bg-quiz-secondary text-white"
        >
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JsonInput;
