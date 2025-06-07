import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuizQuestion } from "@/types/quiz";
import { toast } from "sonner";
import { exportQuizToFile, importQuizFromFile } from "@/utils/quizFileHandler";

interface JsonInputProps {
  onQuizStart: (questions: QuizQuestion[]) => void;
}

const JsonInput: React.FC<JsonInputProps> = ({ onQuizStart }) => {
  const [jsonInput, setJsonInput] = useState<string>(`[
  {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5"],
    "answer": "4",
    "type": "multiple"
  },
  {
    "question": "Capital of France?",
    "options": ["Paris", "Rome", "Berlin"],
    "answer": "Paris",
    "type": "multiple"
  },
  {
    "question": "Explain the theory of relativity.",
    "type": "essay"
  },
  {
    "question": "Describe your most meaningful learning experience and why it was impactful.",
    "type": "essay"
  }
]`);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(jsonInput);
      } catch (err) {
        setError("Invalid JSON format. Please check your input for syntax errors (e.g., missing commas, brackets, or quotes).");
        return;
      }
      if (!validateQuestions(parsedQuestions)) {
        setError("Invalid format. Each multiple choice question must have a 'question' string, 'options' array of strings, and an 'answer' string that is included in the options. Essay questions must have a 'question' string and 'type': 'essay'.");
        return;
      }
      if (parsedQuestions.length === 0) {
        setError("Quiz must contain at least one question.");
        return;
      }
      onQuizStart(parsedQuestions);
      toast.success("Quiz loaded successfully!");
    } catch (err) {
      setError("Unexpected error. Please check your input.");
    }
  };

  const handleExport = () => {
    try {
      const parsedQuestions = JSON.parse(jsonInput);
      if (!validateQuestions(parsedQuestions)) {
        toast.error("Invalid quiz format. Please fix the errors before exporting.");
        return;
      }
      
      exportQuizToFile(parsedQuestions);
      toast.success("Quiz exported successfully!");
    } catch (err) {
      toast.error("Error exporting quiz");
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const questions = await importQuizFromFile(file);
      if (!validateQuestions(questions)) {
        toast.error("Invalid quiz format in file");
        return;
      }
      
      setJsonInput(JSON.stringify(questions, null, 2));
      toast.success("Quiz imported successfully!");
    } catch (err) {
      toast.error("Error importing quiz file");
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      <CardFooter className="flex gap-2">
        <Button 
          onClick={handleStartQuiz}
          className="flex-1 bg-quiz-primary hover:bg-quiz-secondary text-white"
        >
          Start Quiz
        </Button>
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex-1"
        >
          Export Quiz
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="flex-1"
        >
          Import Quiz
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </CardFooter>
    </Card>
  );
};

export default JsonInput;
