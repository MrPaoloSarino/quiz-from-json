import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/quiz";
import { CheckCircle, XCircle, Lock } from "lucide-react";
import { Progress } from '@/components/ui/progress';
import { EnhancedQuizQuestion } from '@/types/user';
import { Brain, Clock, BarChart, Zap, History } from 'lucide-react';
import { useLearning } from '@/contexts/LearningContext';
import { toast } from "sonner";

interface QuizCardProps {
  question: EnhancedQuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: string) => void;
  showFeedback: boolean;
  selectedOption: string | null;
  isCorrect: boolean | null;
  onEssayChange?: (text: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showFeedback,
  selectedOption,
  isCorrect,
  onEssayChange,
}) => {
  // Get learning context
  const { state: learningState } = useLearning();

  // Defensive defaults in case analytics or spaced repetition data is missing (e.g., for legacy quizzes)
  const analytics = question.analytics ?? {
    strengthScore: 0,
    lastRecallSuccess: false,
    recallAttempts: 0,
    recallSuccesses: 0,
    averageRecallTime: 0,
    lastInterleaved: new Date(),
    relatedConcepts: []
  };

  const spaced = question.spacedRepetition ?? {
    nextReviewDate: new Date(),
    lastReviewDate: new Date(),
    interval: 1,
    easeFactor: 2.5,
    consecutiveCorrect: 0,
    reviewHistory: []
  };

  const strengthScore = Math.round(analytics.strengthScore * 100);
  const recallRate = Math.round((analytics.recallSuccesses / Math.max(1, analytics.recallAttempts)) * 100);
  const avgTime = Math.round(analytics.averageRecallTime);
  const daysUntilReview = Math.ceil((spaced.nextReviewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // Get adaptive settings
  const timeAllowed = learningState.adaptive.timeAllowed;
  const scaffoldingLevel = learningState.adaptive.scaffoldingLevel;
  const hintAvailability = learningState.adaptive.hintAvailability;

  return (
    <Card className="p-6 space-y-6">
      {/* Question Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Question {questionNumber} of {totalQuestions}
        </h3>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: 'var(--cerebrum-text-muted)' }} />
          <span className="text-sm" style={{ color: 'var(--cerebrum-text-muted)' }}>
            {timeAllowed}s
          </span>
        </div>
      </div>

      {/* Learning Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4" style={{ background: 'var(--cerebrum-bg-secondary)', borderRadius: '0.5rem' }}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" style={{ color: 'var(--cerebrum-secondary)' }} />
            <span className="text-sm font-medium">Mastery</span>
          </div>
          <Progress value={strengthScore} className="h-2" />
          <span className="text-xs" style={{ color: 'var(--cerebrum-text-muted)' }}>{strengthScore}%</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: 'var(--cerebrum-accent)' }} />
            <span className="text-sm font-medium">Recall</span>
          </div>
          <Progress value={recallRate} className="h-2" />
          <span className="text-xs" style={{ color: 'var(--cerebrum-text-muted)' }}>{recallRate}%</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: 'var(--cerebrum-success)' }} />
            <span className="text-sm font-medium">Speed</span>
          </div>
          <Progress 
            value={Math.min(100, (avgTime / timeAllowed) * 100)} 
            className="h-2" 
          />
          <span className="text-sm">{avgTime}s avg</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" style={{ color: 'var(--cerebrum-focus)' }} />
            <span className="text-sm font-medium">Next Review</span>
          </div>
          <span className="text-sm">{daysUntilReview} days</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <p className="text-lg flex-1">{question.question}</p>
          {question.isAnswerLocked && (
            <div className="flex items-center gap-2" style={{ color: 'var(--cerebrum-text-muted)' }}>
              <Lock className="w-4 h-4" />
              <span className="text-sm">Answer Locked</span>
            </div>
          )}
        </div>
        
        {question.type === 'multiple' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = option === question.answer;
              const isAnswerLocked = question.isAnswerLocked;
              
              // Get the actual correctness from answer history when locked
              let wasSelectedWrong = false;
              if (isAnswerLocked && isSelected) {
                // Check answer history for this specific answer
                const lastAnswer = question.answerHistory?.slice(-1)[0];
                wasSelectedWrong = lastAnswer && !lastAnswer.isCorrect;
              }
              
              // Determine styling based on state
              let buttonStyle: React.CSSProperties = {};
              let buttonClasses = "w-full min-h-[44px] h-auto whitespace-normal p-4 justify-start text-left border-2 transition-all duration-200";
              
              if (isAnswerLocked) {
                if (isCorrectAnswer) {
                  // Always highlight the correct answer in green when locked
                  buttonStyle.background = 'var(--cerebrum-success, #10B981)';
                  buttonStyle.color = '#fff';
                  buttonStyle.border = '1px solid var(--cerebrum-success, #10B981)';
                } else if (isSelected && wasSelectedWrong) {
                  // Highlight the wrong selected answer in red
                  buttonStyle.background = 'var(--cerebrum-error, #EF4444)';
                  buttonStyle.color = '#fff';
                  buttonStyle.border = '1px solid var(--cerebrum-error, #EF4444)';
                } else {
                  // Other options remain neutral
                  buttonStyle.background = 'var(--cerebrum-bg-secondary)';
                  buttonStyle.color = 'var(--cerebrum-text-muted)';
                  buttonStyle.border = '1px solid var(--cerebrum-bg-tertiary)';
                }
                buttonClasses += " cursor-not-allowed";
              } else if (isSelected) {
                // Selected but not locked yet
                buttonClasses += " bg-blue-50 border-blue-300 text-blue-800";
              }
              
              return (
                <Button
                  key={index}
                  onClick={() => onAnswer(option)}
                  variant="outline"
                  className={buttonClasses}
                  style={buttonStyle}
                  disabled={showFeedback || question.isAnswerLocked}
                  aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                >
                  <div className="grid grid-cols-[40px_1fr_auto] items-center w-full gap-2">
                    <span className="font-bold text-lg text-left" style={{ width: 32, display: 'inline-block' }}>
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="font-medium break-words text-left">{option}</span>
                    {question.isAnswerLocked && (
                      <span className="ml-2 flex items-center gap-1">
                        {isCorrectAnswer ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-xs font-semibold text-green-700 hidden sm:inline">
                              CORRECT
                            </span>
                          </>
                        ) : isSelected && wasSelectedWrong ? (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-xs font-semibold text-red-700 hidden sm:inline">
                              WRONG
                            </span>
                          </>
                        ) : null}
                      </span>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        )}

        {question.type === 'essay' && (
          <EssayInput 
            onSubmit={onAnswer} 
            disabled={showFeedback || question.isAnswerLocked} 
            initialValue={selectedOption || ''} 
            isLocked={question.isAnswerLocked}
            scaffoldingLevel={scaffoldingLevel}
            hintAvailability={hintAvailability}
            onTextChange={onEssayChange}
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

      {/* Learning Support */}
      {scaffoldingLevel > 0.3 && !question.isAnswerLocked && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Learning Support:</h4>
          <div className="space-y-2">
            {question.learningObjectives.map((objective, index) => (
              <p key={index} className="text-sm text-gray-600">
                • {objective}
              </p>
            ))}
            {hintAvailability > 0.5 && (
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => toast.info("Hint: Focus on the key concepts mentioned in the question.")}
              >
                Get Hint
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

interface EssayInputProps {
  onSubmit: (text: string) => void;
  disabled: boolean;
  initialValue: string;
  isLocked: boolean;
  scaffoldingLevel: number;
  hintAvailability: number;
  onTextChange?: (text: string) => void;
}

function EssayInput({ 
  onSubmit, 
  disabled, 
  initialValue, 
  isLocked,
  scaffoldingLevel,
  hintAvailability,
  onTextChange
}: EssayInputProps) {
  const [value, setValue] = useState(initialValue);

  const handleTextChange = (newValue: string) => {
    setValue(newValue);
    onTextChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast.error("This question has been answered and cannot be changed");
      return;
    }
    if (!disabled && value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <textarea
          className={`w-full p-2 border rounded min-h-[100px] ${
            isLocked ? 'bg-gray-50 cursor-not-allowed' : ''
          }`}
          value={value}
          onChange={e => !isLocked && handleTextChange(e.target.value)}
          disabled={disabled || isLocked}
          placeholder={isLocked ? "Answer locked" : "Type your answer here..."}
        />
        {isLocked && (
          <div className="absolute top-2 right-2 flex items-center gap-2 text-gray-500">
            <Lock className="w-4 h-4" />
          </div>
        )}
      </div>
      
      {scaffoldingLevel > 0.3 && !isLocked && (
        <div className="text-sm text-gray-600 space-y-2">
          <p>Suggested structure:</p>
          <ul className="list-disc pl-5">
            <li>Start with a clear introduction</li>
            <li>Provide supporting evidence</li>
            <li>Conclude with a summary</li>
          </ul>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <Button 
          type="submit" 
          className={`bg-quiz-primary text-white ${isLocked ? 'opacity-50' : ''}`}
          disabled={disabled || !value.trim() || isLocked}
        >
          {isLocked ? 'Answer Locked' : 'Submit Answer'}
        </Button>
        
        {hintAvailability > 0.5 && !isLocked && (
          <Button
            type="button"
            variant="ghost"
            className="text-blue-600 hover:text-blue-700"
            onClick={() => toast.info("Tip: Make sure to address all parts of the question in your answer.")}
          >
            Get Writing Tips
          </Button>
        )}
      </div>
    </form>
  );
}

export default QuizCard;
