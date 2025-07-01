import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuizQuestion } from "@/types/quiz";
import { toast } from "sonner";
import { exportQuizToFile, importQuizFromFile } from "@/utils/quizFileHandler";
import StorageManager from '@/utils/storageManager';

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

  const validateQuestions = (questions: unknown[]): questions is QuizQuestion[] => {
    console.log('🔍 [DEBUG] validateQuestions called with:', questions);
    console.log('🔍 [DEBUG] Input type:', typeof questions);
    console.log('🔍 [DEBUG] Is array:', Array.isArray(questions));
    
    if (!Array.isArray(questions)) {
      console.error('❌ [DEBUG] Input is not an array');
      return false;
    }
    
    console.log('🔍 [DEBUG] Array length:', questions.length);
    
    const validationResults = questions.map((q: unknown, index: number) => {
      console.log(`🔍 [DEBUG] Validating question ${index}:`, q);
      
      // Check basic structure first
      if (!q || typeof q !== 'object') {
        console.error(`❌ [DEBUG] Question ${index} is not an object:`, q);
        return false;
      }
      
      const questionObj = q as Record<string, unknown>;
      console.log(`🔍 [DEBUG] Question ${index} object:`, questionObj);
      
      if (typeof questionObj.question !== 'string') {
        console.error(`❌ [DEBUG] Question ${index} missing or invalid 'question' field:`, questionObj.question);
        return false;
      }
      
      if ((questionObj.question as string).trim().length === 0) {
        console.error(`❌ [DEBUG] Question ${index} has empty question text`);
        return false;
      }
      
      const question = questionObj;
      console.log(`🔍 [DEBUG] Question ${index} type:`, question.type);
      
      if (question.type === 'essay') {
        console.log(`🔍 [DEBUG] Question ${index} is essay type`);
        // Essay questions must have a question and type, options and answer are optional
        const isValid = (
          question.type === 'essay' &&
          (!question.options || Array.isArray(question.options)) &&
          (!question.answer || typeof question.answer === 'string')
        );
        console.log(`🔍 [DEBUG] Essay question ${index} validation result:`, isValid);
        return isValid;
      }
      
      console.log(`🔍 [DEBUG] Question ${index} is multiple choice type`);
      // Default to multiple choice - require all fields
      const hasOptions = Array.isArray(question.options);
      const optionsLength = hasOptions ? (question.options as unknown[]).length : 0;
      const hasValidOptions = hasOptions && (question.options as unknown[]).every((opt: unknown) => typeof opt === 'string' && (opt as string).trim().length > 0);
      const hasAnswer = typeof question.answer === 'string';
      const answerInOptions = hasAnswer && hasOptions && (question.options as string[]).includes(question.answer as string);
      
      console.log(`🔍 [DEBUG] Question ${index} validation details:`, {
        hasOptions,
        optionsLength,
        hasValidOptions,
        hasAnswer,
        answerInOptions,
        options: question.options,
        answer: question.answer
      });
      
      const isValid = hasOptions && optionsLength > 0 && hasValidOptions && hasAnswer && (question.answer as string).trim().length > 0 && answerInOptions;
      console.log(`🔍 [DEBUG] Multiple choice question ${index} validation result:`, isValid);
      
      return isValid;
    });
    
    console.log('🔍 [DEBUG] Individual validation results:', validationResults);
    const overallResult = validationResults.every(result => result);
    console.log('🔍 [DEBUG] Overall validation result:', overallResult);
    
    return overallResult;
  };

  const handleStartQuiz = () => {
    console.log('🚀 [DEBUG] handleStartQuiz called');
    console.log('🚀 [DEBUG] Current jsonInput length:', jsonInput.length);
    console.log('🚀 [DEBUG] Current quizTitle:', quizTitle);
    console.log('🚀 [DEBUG] Current quizDescription:', quizDescription);
    
    try {
      setError(null);
      console.log('🚀 [DEBUG] Error state cleared');
      
      let parsedQuestions;
      try {
        console.log('🚀 [DEBUG] Attempting to parse JSON...');
        parsedQuestions = JSON.parse(jsonInput);
        console.log('🚀 [DEBUG] JSON parsed successfully. Type:', typeof parsedQuestions);
        console.log('🚀 [DEBUG] Parsed questions:', parsedQuestions);
        console.log('🚀 [DEBUG] Questions count:', Array.isArray(parsedQuestions) ? parsedQuestions.length : 'Not an array');
      } catch (err: unknown) {
        console.error('❌ [DEBUG] JSON parsing failed:', err);
        console.log('🚀 [DEBUG] Raw JSON input that failed:', jsonInput);
        setError("Invalid JSON format. Please check your input for syntax errors (e.g., missing commas, brackets, or quotes).");
        return;
      }
      
      console.log('🚀 [DEBUG] Starting validation...');
      const isValid = validateQuestions(parsedQuestions);
      console.log('🚀 [DEBUG] Validation result:', isValid);
      
      if (!isValid) {
        console.error('❌ [DEBUG] Question validation failed');
        console.log('🚀 [DEBUG] Failed questions:', parsedQuestions);
        setError("Invalid format. Each multiple choice question must have a 'question' string, 'options' array of strings, and an 'answer' string that is included in the options. Essay questions must have a 'question' string and 'type': 'essay'.");
        return;
      }
      
      if (parsedQuestions.length === 0) {
        console.error('❌ [DEBUG] Empty questions array');
        setError("Quiz must contain at least one question.");
        return;
      }
      
      console.log('🚀 [DEBUG] All validations passed. Calling onQuizStart...');
      console.log('🚀 [DEBUG] Questions being passed to onQuizStart:', parsedQuestions);
      
      onQuizStart(parsedQuestions);
      
      console.log('✅ [DEBUG] onQuizStart called successfully');
      toast.success("Quiz loaded successfully!");
      
    } catch (err) {
      console.error('❌ [DEBUG] Unexpected error in handleStartQuiz:', err);
      console.log('🚀 [DEBUG] Error stack:', err instanceof Error ? err.stack : 'No stack available');
      setError("Unexpected error. Please check your input.");
    }
  };

  const handleSaveToCloud = async () => {
    console.log('💾 [DEBUG] handleSaveToCloud called');
    console.log('💾 [DEBUG] Current state:', {
      quizTitle,
      quizDescription,
      jsonInputLength: jsonInput.length,
      hasError: !!error
    });
    
    if (!quizTitle.trim()) {
      console.error('❌ [DEBUG] Quiz title is empty');
      toast.error("Please enter a quiz title");
      return;
    }

    try {
      console.log('💾 [DEBUG] Parsing JSON for save...');
      const parsedQuestions = JSON.parse(jsonInput);
      console.log('💾 [DEBUG] Parsed questions:', parsedQuestions);
      console.log('💾 [DEBUG] Questions count:', parsedQuestions.length);
      
      console.log('💾 [DEBUG] Starting validation...');
      const isValid = validateQuestions(parsedQuestions);
      console.log('💾 [DEBUG] Validation result:', isValid);
      
      if (!isValid) {
        console.error('❌ [DEBUG] Validation failed');
        toast.error("Invalid quiz format. Please fix the errors before saving.");
        return;
      }

      console.log('💾 [DEBUG] Getting storage info...');
      const storageInfo = StorageManager.getStorageInfo();
      console.log('💾 [DEBUG] Storage info:', storageInfo);
      console.log('💾 [DEBUG] Storage mode:', storageInfo.mode);

      console.log('💾 [DEBUG] Preparing to save quiz...');
      console.log('💾 [DEBUG] Save parameters:', {
        title: quizTitle.trim(),
        description: quizDescription.trim() || undefined,
        questionsCount: parsedQuestions.length
      });
      
      const quizId = await StorageManager.importLegacyQuiz(
        quizTitle.trim(),
        parsedQuestions,
        quizDescription.trim() || undefined
      );

      console.log('✅ [DEBUG] Quiz saved successfully');
      console.log('✅ [DEBUG] Quiz ID:', quizId);
      
      const storageType = storageInfo.mode === 'local_storage' ? 'locally' : 'to cloud';
      console.log('💾 [DEBUG] Storage type used:', storageType);
      
      toast.success(`Quiz saved ${storageType} successfully! (ID: ${quizId.slice(-8)})`);
      
      // Clear form after successful save
      console.log('💾 [DEBUG] Clearing form...');
      setQuizTitle('');
      setQuizDescription('');
      console.log('✅ [DEBUG] Form cleared');
      
    } catch (err) {
      console.error('❌ [DEBUG] Error in handleSaveToCloud:', err);
      console.log('❌ [DEBUG] Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack available',
        type: typeof err
      });
      toast.error("Error saving quiz. Please try again.");
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
