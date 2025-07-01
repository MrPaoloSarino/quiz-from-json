import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/quiz";
import { CheckCircle, XCircle } from "lucide-react";
import { Progress } from '@/components/ui/progress';
import { EnhancedQuizQuestion } from '@/types/user';
import { Brain, Clock, BarChart, Zap, History } from 'lucide-react';

interface QuizCardProps {
  question: EnhancedQuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: string) => void;
  showFeedback: boolean;
  selectedOption: string | null;
  isCorrect: boolean | null;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showFeedback,
  selectedOption,
  isCorrect,
}) => {
  // Calculate metrics
  const strengthScore = Math.round(question.analytics.strengthScore * 100);
  const recallRate = Math.round((question.analytics.recallSuccesses / Math.max(1, question.analytics.recallAttempts)) * 100);
  const avgTime = Math.round(question.analytics.averageRecallTime);
  const daysUntilReview = Math.ceil((question.spacedRepetition.nextReviewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="p-6 space-y-6">
      {/* Question Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Question {questionNumber} of {totalQuestions}
        </h3>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">
            {question.estimatedTime}s
          </span>
        </div>
      </div>

      {/* Learning Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Strength</span>
          </div>
          <Progress value={strengthScore} className="h-2" />
          <span className="text-xs text-gray-500">{strengthScore}%</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Recall</span>
          </div>
          <Progress value={recallRate} className="h-2" />
          <span className="text-xs text-gray-500">{recallRate}%</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Avg Time</span>
          </div>
          <span className="text-sm">{avgTime}s</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">Next Review</span>
          </div>
          <span className="text-sm">{daysUntilReview} days</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="space-y-4">
        <p className="text-lg">{question.question}</p>
        
        {question.type === 'multiple' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => onAnswer(option)}
                variant={selectedOption === option ? (isCorrect ? 'success' : 'destructive') : 'outline'}
                className="w-full justify-start text-left"
                disabled={showFeedback}
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        {question.type === 'essay' && (
          <textarea
            className="w-full h-32 p-2 border rounded"
            placeholder="Type your answer here..."
            disabled={showFeedback}
            onChange={(e) => onAnswer(e.target.value)}
          />
        )}
      </div>

      {/* Related Topics */}
      {question.analytics.relatedConcepts.length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Related Topics:</h4>
          <div className="flex flex-wrap gap-2">
            {question.analytics.relatedConcepts.map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

function EssayInput({ onSubmit, disabled, initialValue }: { onSubmit: (text: string) => void, disabled: boolean, initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!disabled && value.trim()) onSubmit(value.trim());
      }}
      className="space-y-2"
    >
      <textarea
        className="w-full p-2 border rounded min-h-[100px]"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer here..."
      />
      <Button type="submit" className="bg-quiz-primary text-white" disabled={disabled || !value.trim()}>
        Submit Answer
      </Button>
    </form>
  );
}

export default QuizCard;
