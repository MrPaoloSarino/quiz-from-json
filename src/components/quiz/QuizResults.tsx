
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
}

const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  score,
  onRestart,
  onNewQuiz,
}) => {
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <Card className="w-full max-w-xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-5xl font-bold mb-2">{percentage}%</div>
          <p className="text-xl">
            You scored {score} out of {questions.length}
          </p>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Question Summary</h3>
          {questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.answer;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  isCorrect ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"
                }`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{question.question}</p>
                    {!isCorrect && (
                      <div className="mt-2 text-sm">
                        <p className="text-red-600">
                          Your answer: {userAnswers[index]}
                        </p>
                        <p className="text-green-600">
                          Correct answer: {question.answer}
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
