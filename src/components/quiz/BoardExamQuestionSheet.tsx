import React, { useRef, useEffect, useMemo } from "react";
import { Flag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizQuestion } from "@/types/quiz";

/** Letter label for an option index (0→A, 1→B, etc.) */
const optionLetter = (idx: number): string => String.fromCharCode(65 + idx);

interface BoardExamQuestionSheetProps {
  /** Array of quiz questions */
  questions: QuizQuestion[];
  /** 0-based index of current question */
  currentQuestion: number;
  /** User answers array (empty string = unanswered) */
  userAnswers: string[];
  /** Set of flagged question indices */
  flaggedQuestions: Set<number>;
  /** Callback when clicking on a question to navigate */
  onJumpToQuestion: (index: number) => void;
  /** Exam mode: practice or exam */
  examMode?: 'practice' | 'exam';
  /** Set of locked question indices */
  lockedQuestions?: Set<number>;
}

/**
 * BoardExamQuestionSheet — A read-only paper-like question sheet
 * that displays all questions in a two-column board exam format.
 * 
 * Features:
 * - Paper-like appearance (cream background, grid lines)
 * - Two-column layout for questions
 * - Monospace question numbers (01, 02, 03...)
 * - Read-only - NO clicking to answer (use Answer Sheet for that)
 * - Shows options as A, B, C, D, E labels
 * - Current question highlighted
 * - Flagged questions marked
 */
const BoardExamQuestionSheet: React.FC<BoardExamQuestionSheetProps> = ({
  questions,
  currentQuestion,
  userAnswers,
  flaggedQuestions,
  onJumpToQuestion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Split questions into two columns
  const midpoint = Math.ceil(questions.length / 2);
  const leftColumnQuestions = questions.slice(0, midpoint);
  const rightColumnQuestions = questions.slice(midpoint);

  // Auto-scroll to current question
  useEffect(() => {
    const currentRef = questionRefs.current[currentQuestion];
    if (currentRef) {
      currentRef.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentQuestion]);

  return (
    <div
      ref={containerRef}
      className="border-2 border-gray-400 rounded-none shadow-lg overflow-hidden flex flex-col h-full"
      style={{
        background: "linear-gradient(to bottom, #FFFEF9 0%, #F8F6F0 100%)",
        fontFamily: "'Times New Roman', Times, serif",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header - Official exam paper style */}
      <div
        className="px-3 py-2 border-b-2 border-gray-400 flex-shrink-0 text-center"
        style={{
          background: "linear-gradient(to bottom, #F0EDE5 0%, #E8E4DC 100%)",
        }}
      >
        <h2 className="text-xs font-bold text-gray-800 uppercase tracking-[0.2em]">
          EXAMINATION QUESTIONNAIRE
        </h2>
        <p className="text-[8px] text-gray-500 mt-0.5 tracking-wide">
          DO NOT WRITE ANYTHING ON THIS QUESTIONNAIRE • ANSWER ON THE ANSWER SHEET ONLY
        </p>
      </div>

      {/* Instructions */}
      <div className="px-3 py-1.5 border-b border-gray-300 bg-yellow-50/50 text-[8px] text-gray-600 flex-shrink-0">
        <p className="font-semibold">DIRECTIONS:</p>
        <p>Read each question carefully. Choose the letter of the correct answer and shade the corresponding circle on your Answer Sheet.</p>
      </div>

      {/* Question Grid - Two columns */}
      <div className="overflow-y-auto flex-1 p-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-0">
          {/* Left Column */}
          <div className="space-y-0 border-r border-gray-200 pr-2 lg:pr-3">
            {leftColumnQuestions.map((question, colIdx) => {
              const idx = colIdx;
              return (
                <QuestionItem
                  key={idx}
                  ref={(el) => (questionRefs.current[idx] = el)}
                  question={question}
                  index={idx}
                  totalQuestions={questions.length}
                  isCurrent={idx === currentQuestion}
                  isFlagged={flaggedQuestions.has(idx)}
                  isAnswered={!!userAnswers[idx]}
                  selectedAnswer={userAnswers[idx]}
                  onClick={() => onJumpToQuestion(idx)}
                />
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-0 pl-0 lg:pl-1">
            {rightColumnQuestions.map((question, colIdx) => {
              const idx = midpoint + colIdx;
              return (
                <QuestionItem
                  key={idx}
                  ref={(el) => (questionRefs.current[idx] = el)}
                  question={question}
                  index={idx}
                  totalQuestions={questions.length}
                  isCurrent={idx === currentQuestion}
                  isFlagged={flaggedQuestions.has(idx)}
                  isAnswered={!!userAnswers[idx]}
                  selectedAnswer={userAnswers[idx]}
                  onClick={() => onJumpToQuestion(idx)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 border-t-2 border-gray-400 text-[9px] text-gray-500 text-center flex-shrink-0"
        style={{ background: "linear-gradient(to bottom, #F0EDE5 0%, #E8E4DC 100%)" }}
      >
        <span className="italic">— END OF QUESTIONNAIRE —</span>
      </div>
    </div>
  );
};

/** Single question display item */
interface QuestionItemProps {
  question: QuizQuestion;
  index: number;
  totalQuestions: number;
  isCurrent: boolean;
  isFlagged: boolean;
  isAnswered: boolean;
  selectedAnswer: string;
  onClick: () => void;
}

const QuestionItem = React.forwardRef<HTMLDivElement, QuestionItemProps>(
  ({ question, index, totalQuestions, isCurrent, isFlagged, isAnswered, selectedAnswer, onClick }, ref) => {
    // Monospace padded number
    const displayNumber = String(index + 1).padStart(totalQuestions >= 100 ? 3 : 2, "0");

    // Get the selected option letter if answered
    const selectedLetter = useMemo(() => {
      if (!selectedAnswer || !question.options) return null;
      const optionIdx = question.options.indexOf(selectedAnswer);
      return optionIdx >= 0 ? optionLetter(optionIdx) : null;
    }, [selectedAnswer, question.options]);

    return (
      <div
        ref={ref}
        className={cn(
          "py-1 px-1 border-b border-gray-200 cursor-pointer transition-all duration-150",
          isCurrent && "bg-blue-50 border-l-4 border-l-blue-500 -ml-1 pl-2",
          !isCurrent && isFlagged && "bg-orange-50/50",
          !isCurrent && !isFlagged && "hover:bg-yellow-50/30"
        )}
        onClick={onClick}
        role="button"
        aria-label={`Question ${index + 1}${isCurrent ? ", current" : ""}${isFlagged ? ", flagged" : ""}`}
      >
        {/* Question Header */}
        <div className="flex items-start gap-1 mb-0.5">
          {/* Question Number */}
          <span
            className={cn(
              "font-bold text-[11px] tabular-nums font-mono flex-shrink-0",
              isCurrent ? "text-blue-700" : "text-gray-700"
            )}
          >
            {displayNumber}.
          </span>

          {/* Indicators */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            {isFlagged && (
              <Flag className="w-2.5 h-2.5 text-orange-500 fill-orange-200" aria-label="Flagged" />
            )}
            {isCurrent && (
              <Eye className="w-2.5 h-2.5 text-blue-500" aria-label="Current question" />
            )}
            {isAnswered && selectedLetter && (
              <span className="text-[8px] font-bold text-green-600 bg-green-100 px-1 py-0.5 rounded">
                {selectedLetter}
              </span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <p className="text-[10px] text-gray-800 leading-tight mb-1 pl-4">
          {question.question}
        </p>

        {/* Options (read-only display) */}
        {question.options && question.options.length > 0 && (
          <div className="pl-4 space-y-0">
            {question.options.map((option, optIdx) => {
              const letter = optionLetter(optIdx);
              const isSelected = selectedAnswer === option;

              return (
                <div
                  key={optIdx}
                  className={cn(
                    "flex items-start gap-0.5 text-[9px] leading-tight py-0 px-0.5 rounded",
                    isSelected && "bg-blue-100 font-medium"
                  )}
                >
                  <span className="font-semibold text-gray-600 flex-shrink-0 w-3">
                    {letter}.
                  </span>
                  <span className={cn(
                    "text-gray-700",
                    isSelected && "text-blue-800"
                  )}>
                    {option}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Essay indicator */}
        {question.type === "essay" && (
          <div className="pl-4 mt-0.5">
            <p className="text-[8px] text-gray-500 italic">
              (Essay question — write your answer on the answer sheet)
            </p>
          </div>
        )}
      </div>
    );
  }
);

QuestionItem.displayName = "QuestionItem";

export default BoardExamQuestionSheet;
