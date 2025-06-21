import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { QuizQuestion } from "@/types/quiz";
import { CheckCircle, XCircle, Brain, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import QuestionFeedback from "./QuestionFeedback";

interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: string[];
  score: number;
  onRestart: () => void;
  onNewQuiz: () => void;
  essayRatings: number[];
  onGeneratePrescription?: () => Promise<string>;
  provider: 'openrouter' | 'gemini' | 'openai';
  apiKey: string;
  selectedModel?: string;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  score,
  onRestart,
  onNewQuiz,
  essayRatings,
  onGeneratePrescription,
  provider,
  apiKey,
  selectedModel
}) => {
  const [prescription, setPrescription] = useState<string>("");
  const [loadingPrescription, setLoadingPrescription] = useState<boolean>(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const totalPossible = questions.reduce((total, question) => {
    return total + (question.type === 'essay' ? 10 : 1);
  }, 0);
  
  const percentage = Math.round((score / totalPossible) * 100);

  const toggleQuestionExpansion = (questionIndex: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionIndex)) {
      newExpanded.delete(questionIndex);
    } else {
      newExpanded.add(questionIndex);
    }
    setExpandedQuestions(newExpanded);
  };

  const generatePrescription = async () => {
    if (!onGeneratePrescription) return;
    
    setLoadingPrescription(true);
    try {
      const result = await onGeneratePrescription();
      setPrescription(result);
    } catch (error) {
      console.error("Error generating prescription:", error);
    } finally {
      setLoadingPrescription(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in">
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

        {/* Question-by-Question Review */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Question-by-Question Review
          </h3>
          
          {questions.map((question, index) => {
            const isEssay = question.type === 'essay';
            const isCorrect = !isEssay && userAnswers[index] === question.answer;
            const essayRating = isEssay ? essayRatings[index] : null;
            const isExpanded = expandedQuestions.has(index);

            return (
              <div key={index} className="border rounded-lg overflow-hidden">
                {/* Question Header */}
                <div 
                  className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleQuestionExpansion(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">Question {index + 1}</span>
                      {isEssay ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          essayRating !== null && essayRating >= 7 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {essayRating !== null ? `${essayRating}/10` : 'Not rated'}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {question.question}
                  </p>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    {/* Question Details */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Question:</h4>
                      <p className="text-gray-700">{question.question}</p>
                      
                      {!isEssay && question.options && (
                        <div>
                          <h4 className="font-medium mt-3">Options:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {question.options.map((option, optIndex) => (
                              <li key={optIndex} className={`
                                ${option === question.answer ? 'text-green-600 font-medium' : ''}
                                ${option === userAnswers[index] && option !== question.answer ? 'text-red-600 font-medium' : ''}
                              `}>
                                {option}
                                {option === question.answer && ' ✓'}
                                {option === userAnswers[index] && option !== question.answer && ' ✗'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <h4 className="font-medium text-sm">Your Answer:</h4>
                          <p className="text-sm text-gray-600">
                            {userAnswers[index] || 'No answer provided'}
                          </p>
                        </div>
                        {!isEssay && (
                          <div>
                            <h4 className="font-medium text-sm">Correct Answer:</h4>
                            <p className="text-sm text-green-600 font-medium">
                              {question.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <QuestionFeedback
                      question={question}
                      userAnswer={userAnswers[index] || ''}
                      isCorrect={isEssay ? (essayRating !== null && essayRating >= 7) : isCorrect}
                      questionNumber={index + 1}
                      provider={provider}
                      apiKey={apiKey}
                      selectedModel={selectedModel}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Study Prescription */}
        {onGeneratePrescription && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Study Prescription
              </h3>
              <Button
                onClick={generatePrescription}
                disabled={loadingPrescription}
                className="flex items-center gap-2"
              >
                {loadingPrescription ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                Generate Prescription
              </Button>
            </div>

            {prescription && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {prescription}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={onRestart} variant="outline" className="flex-1">
          Restart Quiz
        </Button>
        <Button onClick={onNewQuiz} className="flex-1">
          New Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizResults;
