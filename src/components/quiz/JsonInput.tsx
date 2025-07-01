import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuizQuestion } from "@/types/quiz";
import { toast } from "sonner";
import { exportQuizToFile, importQuizFromFile } from "@/utils/quizFileHandler";
import { GoogleDriveUserStorage } from '@/utils/googleDriveStorage';

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
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizDescription, setQuizDescription] = useState<string>('');
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

  const handleSaveToCloud = async () => {
    if (!quizTitle.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    try {
      const parsedQuestions = JSON.parse(jsonInput);
      if (!validateQuestions(parsedQuestions)) {
        toast.error("Invalid quiz format. Please fix the errors before saving.");
        return;
      }

      await GoogleDriveUserStorage.importLegacyQuiz(
        quizTitle.trim(),
        parsedQuestions,
        quizDescription.trim() || undefined
      );

      toast.success("Quiz saved to cloud successfully!");
      setQuizTitle('');
      setQuizDescription('');
    } catch (err) {
      console.error('Failed to save quiz:', err);
      toast.error("Error saving quiz to cloud");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quizTitle" className="block text-sm font-medium mb-2">
                Quiz Title *
              </label>
              <Input
                id="quizTitle"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title..."
              />
            </div>
            <div>
              <label htmlFor="quizDescription" className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <Input
                id="quizDescription"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="jsonInput" className="block text-sm font-medium mb-2">
              Quiz Questions (JSON Format):
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
      <CardFooter className="flex flex-col gap-3">
        <div className="flex gap-2 w-full">
          <Button 
            onClick={handleStartQuiz}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Quiz
          </Button>
          <Button
            onClick={handleSaveToCloud}
            variant="outline"
            className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
          >
            Save to Cloud
          </Button>
        </div>
        
        <div className="flex gap-2 w-full">
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex-1"
          >
            Export File
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex-1"
          >
            Import File
          </Button>
        </div>
        
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
