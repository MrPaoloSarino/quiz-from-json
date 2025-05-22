import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/quiz";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizCardProps {
  question: QuizQuestion;
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
  return (
    <Card className="w-full max-w-xl mx-auto animate-bounce-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <CardTitle className="text-xl mt-2">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              className={`w-full justify-start h-auto py-3 px-4 text-left font-normal ${
                selectedOption === option
                  ? showFeedback
                    ? option === question.answer
                      ? "bg-quiz-success text-white hover:bg-quiz-success"
                      : "bg-quiz-error text-white hover:bg-quiz-error"
                    : "bg-quiz-primary text-white hover:bg-quiz-primary/90"
                  : option === question.answer && showFeedback
                  ? "bg-quiz-success text-white hover:bg-quiz-success"
                  : "bg-quiz-neutral text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => {
                if (!showFeedback) onAnswer(option);
              }}
              disabled={showFeedback}
            >
              <div className="flex justify-between items-center w-full">
                <span
                  style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                >{option}</span>
                {showFeedback && option === question.answer && (
                  <CheckCircle className="h-5 w-5 text-white" />
                )}
                {showFeedback && selectedOption === option && option !== question.answer && (
                  <XCircle className="h-5 w-5 text-white" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
