import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/quiz";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: string[];
  score: number;
  onRestart: () => void;
  onNewQuiz: () => void;
  essayRatings: number[];
}

const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  score,
  onRestart,
  onNewQuiz,
  essayRatings,
}) => {
  // Calculate total possible score
  const totalPossible = questions.reduce((total, question) => {
    return total + (question.type === 'essay' ? 10 : 1);
  }, 0);
  
  const percentage = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;

  return (
    <Card className="w-full max-w-xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-5xl font-bold mb-2">{percentage}%</div>
          <p className="text-xl">
            You scored {score} out of {totalPossible}
          </p>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Question Summary</h3>
          {questions.map((question, index) => {
            const isEssay = question.type === 'essay';
            const isCorrect = !isEssay && userAnswers[index] === question.answer;
            const essayRating = isEssay ? essayRatings[index] : null;
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  isEssay 
                    ? "bg-blue-50 border border-blue-100" 
                    : isCorrect 
                    ? "bg-green-50 border border-green-100" 
                    : "bg-red-50 border border-red-100"
                }`}
              >
                <div className="flex items-start gap-2">
                  {isEssay ? (
                    <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      E
                    </div>
                  ) : isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{question.question}</p>
                    {isEssay ? (
                      <div className="mt-2 text-sm">
                        <p className="text-gray-600 mb-1">Your answer:</p>
                        <p className="text-gray-800 italic bg-gray-50 p-2 rounded text-xs">
                          {userAnswers[index] ? userAnswers[index].substring(0, 150) + (userAnswers[index].length > 150 ? '...' : '') : 'No answer provided'}
                        </p>
                        {essayRating !== null && essayRating !== undefined ? (
                          <p className="text-blue-600 font-medium mt-2">
                            AI Rating: {essayRating}/10
                          </p>
                        ) : (
                          <p className="text-gray-500 mt-2">No AI rating available</p>
                        )}
                      </div>
                    ) : !isCorrect ? (
                      <div className="mt-2 text-sm">
                        <p className="text-red-600">
                          Your answer: {userAnswers[index]}
                        </p>
                        <p className="text-green-600">
                          Correct answer: {question.answer}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 text-sm">
                        <p className="text-green-600">
                          Correct! Your answer: {userAnswers[index]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={onRestart}
          variant="outline"
          className="w-full"
        >
          Restart Quiz
        </Button>
        <Button
          onClick={onNewQuiz}
          className="w-full bg-quiz-primary hover:bg-quiz-secondary"
        >
          New Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizResults;
