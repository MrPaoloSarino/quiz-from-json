import React, { useCallback, useMemo, useEffect, useRef, useState } from "react";
import { Flag, Lock, Unlock, Eye, Clock, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

/**
 * Single question entry for the answer sheet.
 */
interface OMRQuestionEntry {
  /** 0-based index */
  index: number;
  /** Display label, e.g. "A","B","C","D","E" or "T","F" */
  optionLabels: string[];
  /** Which option label the user selected (empty string = unanswered) */
  selectedLabel: string;
  /** Whether the question is flagged for review */
  isFlagged: boolean;
  /** Whether this is the currently active question */
  isCurrent: boolean;
  /** Whether the answer is locked (already submitted) */
  isLocked: boolean;
  /** Question type (essay, multiple, true-false, etc.) */
  questionType: 'multiple' | 'essay' | 'true-false' | 'fill-blank' | 'other';
}

/** Exam interaction mode */
export type ExamMode = "practice" | "exam";

interface BoardExamAnswerSheetProps {
  /** Total questions */
  totalQuestions: number;
  /** 0-based index of current question */
  currentQuestion: number;
  /** User answers array (empty string = unanswered) */
  userAnswers: string[];
  /** Array of options per question (used to derive labels) */
  questionsOptions: (string[] | undefined)[];
  /** Array of question types */
  questionTypes?: (string | undefined)[];
  /** Set of 0-based question indices that are flagged */
  flaggedQuestions: Set<number>;
  /** Callback when user clicks a question number to jump */
  onJumpToQuestion: (index: number) => void;
  /** Callback when user toggles flag on a question */
  onToggleFlag: (index: number) => void;
  /** Callback when user selects an answer via the sheet */
  onSelectAnswer?: (questionIndex: number, optionLabel: string) => void;
  /** Callback when user submits an essay answer */
  onEssayAnswer?: (questionIndex: number, essayText: string) => void;
  /** Whether the sheet is in compact mode (mobile) */
  compact?: boolean;
  /** Current exam mode */
  examMode?: ExamMode;
  /** Callback when exam mode changes */
  onExamModeChange?: (mode: ExamMode) => void;
  /** Set of locked question indices (for exam mode) */
  lockedQuestions?: Set<number>;
  /** Callback when user locks/confirms an answer */
  onLockAnswer?: (questionIndex: number) => void;
}

/** Letter label for an option index (0→A, 1→B, etc.) */
const optionLetter = (idx: number): string => String.fromCharCode(65 + idx);

/**
 * BoardExamAnswerSheet — A realistic paper-like board exam bubble sheet.
 * 
 * Features:
 * - Two-column layout (1-50 left, 51-100 right)
 * - Monospace numbers (01, 02, 03) with consistent row height
 * - Practice/Exam mode toggle
 * - Keyboard-first controls (1-100 jump, A-E select, arrows, F flag)
 * - Filled bubbles for answered questions
 * - Accessible button/radio semantics with focus rings
 */
const BoardExamAnswerSheet: React.FC<BoardExamAnswerSheetProps> = ({
  totalQuestions,
  currentQuestion,
  userAnswers,
  questionsOptions,
  questionTypes = [],
  flaggedQuestions,
  onJumpToQuestion,
  onToggleFlag,
  onSelectAnswer,
  onEssayAnswer,
  compact = false,
  examMode = "practice",
  onExamModeChange,
  lockedQuestions = new Set(),
  onLockAnswer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [jumpInput, setJumpInput] = useState<string>("");
  const [showJumpInput, setShowJumpInput] = useState(false);
  const [essayModalOpen, setEssayModalOpen] = useState(false);
  const [essayQuestionIndex, setEssayQuestionIndex] = useState<number | null>(null);
  const [essayDraft, setEssayDraft] = useState<string>("");

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState<number>(60);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimerSetup, setIsTimerSetup] = useState<boolean>(true);
  const [timerInputMinutes, setTimerInputMinutes] = useState<string>("60");

  /** Detect if options represent true/false */
  const isTrueFalse = (options: string[] | undefined): boolean => {
    if (!options || options.length !== 2) return false;
    const lower = options.map(o => o.toLowerCase().trim());
    return (lower.includes('true') && lower.includes('false')) ||
           (lower.includes('t') && lower.includes('f')) ||
           (lower.includes('yes') && lower.includes('no'));
  };

  /** Build entries for each question */
  const entries: OMRQuestionEntry[] = useMemo(() => {
    return Array.from({ length: totalQuestions }, (_, i) => {
      const options = questionsOptions[i];
      const qType = questionTypes[i];
      
      // Determine question type
      let questionType: OMRQuestionEntry['questionType'] = 'multiple';
      if (qType === 'essay') {
        questionType = 'essay';
      } else if (qType === 'fill-blank') {
        questionType = 'fill-blank';
      } else if (isTrueFalse(options)) {
        questionType = 'true-false';
      } else if (!options || options.length === 0) {
        questionType = 'other';
      }

      // Determine option labels based on type
      let optionLabels: string[];
      if (questionType === 'true-false') {
        optionLabels = ['T', 'F'];
      } else if (questionType === 'essay' || questionType === 'fill-blank' || questionType === 'other') {
        optionLabels = [];
      } else {
        optionLabels = options
          ? options.map((_, oi) => optionLetter(oi))
          : ['A', 'B', 'C', 'D'];
      }

      // Derive which label was selected
      let selectedLabel = "";
      if (userAnswers[i] && options) {
        const selectedIndex = options.indexOf(userAnswers[i]);
        if (selectedIndex >= 0) {
          if (questionType === 'true-false') {
            selectedLabel = selectedIndex === 0 ? 'T' : 'F';
          } else {
            selectedLabel = optionLetter(selectedIndex);
          }
        }
      }

      return {
        index: i,
        optionLabels,
        selectedLabel,
        isFlagged: flaggedQuestions.has(i),
        isCurrent: i === currentQuestion,
        isLocked: lockedQuestions.has(i) || (examMode === "exam" && !!userAnswers[i]),
        questionType,
      };
    });
  }, [totalQuestions, currentQuestion, userAnswers, questionsOptions, questionTypes, flaggedQuestions, lockedQuestions, examMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if container or children are focused
      if (!containerRef.current?.contains(document.activeElement) && 
          document.activeElement !== document.body) {
        return;
      }

      const key = e.key.toUpperCase();

      // Number keys 1-9 for direct jump (with Ctrl for 10s, Shift for 100s)
      if (/^[0-9]$/.test(e.key)) {
        if (showJumpInput) {
          return; // Let input handle it
        }
        e.preventDefault();
        setShowJumpInput(true);
        setJumpInput(e.key);
        return;
      }

      // A-E for answer selection
      if (/^[A-E]$/.test(key) && onSelectAnswer) {
        e.preventDefault();
        const entry = entries[currentQuestion];
        if (entry && entry.optionLabels.includes(key)) {
          if (examMode === "practice" || !entry.isLocked) {
            onSelectAnswer(currentQuestion, key);
          }
        }
        return;
      }

      // Arrow keys for navigation
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentQuestion > 0) {
          onJumpToQuestion(currentQuestion - 1);
        }
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        if (currentQuestion < totalQuestions - 1) {
          onJumpToQuestion(currentQuestion + 1);
        }
        return;
      }

      // F for flag
      if (key === "F") {
        e.preventDefault();
        onToggleFlag(currentQuestion);
        return;
      }

      // L for lock (exam mode)
      if (key === "L" && examMode === "exam" && onLockAnswer) {
        e.preventDefault();
        onLockAnswer(currentQuestion);
        return;
      }

      // Escape to cancel jump input
      if (e.key === "Escape" && showJumpInput) {
        setShowJumpInput(false);
        setJumpInput("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, totalQuestions, entries, examMode, onSelectAnswer, onJumpToQuestion, onToggleFlag, onLockAnswer, showJumpInput]);

  // Handle jump input submission
  const handleJumpSubmit = useCallback(() => {
    const questionNum = parseInt(jumpInput, 10);
    if (!isNaN(questionNum) && questionNum >= 1 && questionNum <= totalQuestions) {
      onJumpToQuestion(questionNum - 1);
    }
    setShowJumpInput(false);
    setJumpInput("");
  }, [jumpInput, totalQuestions, onJumpToQuestion]);

  const handleJump = useCallback(
    (idx: number) => {
      onJumpToQuestion(idx);
    },
    [onJumpToQuestion]
  );

  const handleFlag = useCallback(
    (e: React.MouseEvent, idx: number) => {
      e.stopPropagation();
      onToggleFlag(idx);
    },
    [onToggleFlag]
  );

  const handleBubbleClick = useCallback(
    (questionIndex: number, optionLabel: string) => {
      const entry = entries[questionIndex];
      if (!entry) return;

      // In exam mode, can't change locked answers
      // Double-check both the entry.isLocked and if there's already an answer
      if (examMode === "exam") {
        if (entry.isLocked) {
          return;
        }
        // Also check if already answered (prevents race condition)
        if (entry.selectedLabel && entry.selectedLabel.trim() !== '') {
          return;
        }
      }

      if (onSelectAnswer) {
        onSelectAnswer(questionIndex, optionLabel);
      }
      onJumpToQuestion(questionIndex);
    },
    [entries, examMode, onSelectAnswer, onJumpToQuestion]
  );

  /** Open essay input modal for a question */
  const handleEssayClick = useCallback(
    (questionIndex: number) => {
      const entry = entries[questionIndex];
      if (!entry) return;

      // In exam mode, can't change locked answers
      if (examMode === "exam") {
        if (entry.isLocked) {
          return;
        }
        // Also check if already has an answer (prevents race condition)
        if (userAnswers[questionIndex] && userAnswers[questionIndex].trim() !== '') {
          return;
        }
      }

      setEssayQuestionIndex(questionIndex);
      setEssayDraft(userAnswers[questionIndex] || "");
      setEssayModalOpen(true);
      onJumpToQuestion(questionIndex);
    },
    [entries, examMode, userAnswers, onJumpToQuestion]
  );

  /** Submit essay answer */
  const handleEssaySubmit = useCallback(() => {
    if (essayQuestionIndex !== null && onEssayAnswer) {
      onEssayAnswer(essayQuestionIndex, essayDraft);
    }
    setEssayModalOpen(false);
    setEssayQuestionIndex(null);
    setEssayDraft("");
  }, [essayQuestionIndex, essayDraft, onEssayAnswer]);

  // Stats
  const answeredCount = useMemo(
    () => userAnswers.filter((a) => a && a.trim() !== "").length,
    [userAnswers]
  );
  const flaggedCount = flaggedQuestions.size;
  const unansweredCount = totalQuestions - answeredCount;

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning && !isTimerSetup) {
      interval = setInterval(() => {
        setTimerSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            setTimerMinutes((prevMinutes) => {
              if (prevMinutes === 0) {
                // Timer reached zero
                setIsTimerRunning(false);
                return 0;
              }
              return prevMinutes - 1;
            });
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isTimerSetup]);

  // Timer helper functions
  const handleStartTimer = () => {
    const mins = parseInt(timerInputMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      setTimerMinutes(mins);
      setTimerSeconds(0);
      setIsTimerSetup(false);
      setIsTimerRunning(true);
    }
  };

  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setIsTimerSetup(true);
    setTimerMinutes(60);
    setTimerSeconds(0);
    setTimerInputMinutes("60");
  };

  const formatTime = (min: number, sec: number): string => {
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const isTimerLow = timerMinutes < 5 && !isTimerSetup;
  const isTimerExpired = timerMinutes === 0 && timerSeconds === 0 && !isTimerSetup;

  // Split into two columns (1-50 left, 51-100 right for 100 questions)
  const midpoint = Math.ceil(totalQuestions / 2);
  const leftColumn = entries.slice(0, midpoint);
  const rightColumn = entries.slice(midpoint);

  return (
    <TooltipProvider delayDuration={200}>
      <div
        ref={containerRef}
        className={cn(
          "border-2 border-gray-400 rounded-none shadow-lg overflow-hidden flex flex-col",
          compact ? "max-h-[50vh]" : "max-h-[calc(100vh-180px)]"
        )}
        style={{
          // Paper-like appearance
          background: "linear-gradient(to bottom, #FFFEF9 0%, #F8F6F0 100%)",
          fontFamily: "'Courier New', Courier, monospace",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.1)",
        }}
        role="region"
        aria-label="Board Exam Answer Sheet"
        tabIndex={0}
      >
        {/* Header - looks like an official form */}
        <div
          className="px-4 py-3 border-b-2 border-gray-400 flex-shrink-0"
          style={{ 
            background: "linear-gradient(to bottom, #F0EDE5 0%, #E8E4DC 100%)",
            borderBottom: "2px solid #999"
          }}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-[0.2em]">
              ANSWER SHEET
            </h3>
            {/* Mode Toggle */}
            {onExamModeChange && (
              <div className="flex items-center gap-1">
                <button
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-bold rounded-l border transition-all",
                    examMode === "practice"
                      ? "bg-green-600 text-white border-green-700"
                      : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
                  )}
                  onClick={() => onExamModeChange("practice")}
                  aria-pressed={examMode === "practice"}
                >
                  <Unlock className="w-3 h-3 inline mr-0.5" />
                  PRACTICE
                </button>
                <button
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-bold rounded-r border transition-all",
                    examMode === "exam"
                      ? "bg-red-600 text-white border-red-700"
                      : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
                  )}
                  onClick={() => onExamModeChange("exam")}
                  aria-pressed={examMode === "exam"}
                >
                  <Lock className="w-3 h-3 inline mr-0.5" />
                  EXAM
                </button>
              </div>
            )}
          </div>
          <p className="text-[9px] text-gray-500 text-center mt-1 tracking-wide uppercase">
            Shade the circle completely • Use No. 2 pencil only
          </p>
        </div>

        {/* Timer Bar */}
        <div
          className={cn(
            "px-3 py-2 border-b border-gray-300 flex items-center justify-between gap-2 flex-shrink-0",
            isTimerExpired && "bg-red-100",
            isTimerLow && !isTimerExpired && "bg-orange-50",
            !isTimerLow && !isTimerExpired && "bg-blue-50/50"
          )}
        >
          <div className="flex items-center gap-2">
            <Clock className={cn(
              "w-4 h-4",
              isTimerExpired ? "text-red-600" : isTimerLow ? "text-orange-500" : "text-blue-600"
            )} />
            <span className="text-[10px] font-semibold text-gray-600 uppercase">Timer</span>
          </div>
          
          {isTimerSetup ? (
            /* Timer Setup Mode */
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={timerInputMinutes}
                onChange={(e) => setTimerInputMinutes(e.target.value)}
                min="1"
                max="999"
                className="w-14 px-1.5 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-center tabular-nums"
                placeholder="60"
                aria-label="Timer minutes"
              />
              <span className="text-[10px] text-gray-500">min</span>
              <button
                onClick={handleStartTimer}
                className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-green-600 text-white rounded border border-green-700 hover:bg-green-700 transition-all"
                aria-label="Start timer"
              >
                <Play className="w-3 h-3" />
                START
              </button>
            </div>
          ) : (
            /* Timer Running/Paused Mode */
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-lg font-bold tabular-nums font-mono",
                  isTimerExpired ? "text-red-600" : isTimerLow ? "text-orange-600 animate-pulse" : "text-gray-800"
                )}
              >
                {formatTime(timerMinutes, timerSeconds)}
              </span>
              
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleToggleTimer}
                      className={cn(
                        "p-1 rounded border transition-all",
                        isTimerRunning
                          ? "bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600"
                          : "bg-green-500 text-white border-green-600 hover:bg-green-600"
                      )}
                      aria-label={isTimerRunning ? "Pause timer" : "Resume timer"}
                    >
                      {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {isTimerRunning ? "Pause" : "Resume"}
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleResetTimer}
                      className="p-1 rounded border bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300 transition-all"
                      aria-label="Reset timer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Reset timer
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {isTimerExpired && (
                <span className="text-[10px] font-bold text-red-600 uppercase animate-pulse">
                  TIME'S UP!
                </span>
              )}
            </div>
          )}
        </div>

        {/* Legend Bar */}
        <div
          className="px-2 py-1 border-b border-gray-300 flex flex-wrap items-center justify-between gap-1 text-[8px] flex-shrink-0"
          style={{ background: "#FAF8F2" }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-0.5">
              <span
                className="inline-block w-3 h-3 rounded-full border-2 border-gray-500 bg-white"
                aria-hidden="true"
              />
              <span className="text-gray-600">({unansweredCount})</span>
            </span>
            <span className="flex items-center gap-0.5">
              <span
                className="inline-block w-3 h-3 rounded-full bg-gray-900 border-2 border-gray-900"
                aria-hidden="true"
              />
              <span className="text-gray-600">({answeredCount})</span>
            </span>
            <span className="flex items-center gap-0.5">
              <Flag className="w-2.5 h-2.5 text-orange-500" aria-hidden="true" />
              <span className="text-orange-600">({flaggedCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-blue-500" aria-hidden="true" />
              <span className="text-blue-600">Current</span>
            </span>
          </div>
        </div>

        {/* Jump Input (shown when typing numbers) */}
        {showJumpInput && (
          <div className="px-3 py-2 border-b border-gray-300 bg-blue-50 flex items-center gap-2">
            <span className="text-xs text-gray-600">Jump to:</span>
            <input
              type="text"
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value.replace(/\D/g, "").slice(0, 3))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleJumpSubmit();
                } else if (e.key === "Escape") {
                  setShowJumpInput(false);
                  setJumpInput("");
                }
              }}
              onBlur={handleJumpSubmit}
              autoFocus
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="1-100"
              aria-label="Question number to jump to"
            />
            <span className="text-[10px] text-gray-400">Press Enter to jump</span>
          </div>
        )}

        {/* Keyboard shortcuts hint */}
        <div className="px-2 py-1 border-b border-gray-200 text-[9px] text-gray-400 bg-gray-50 flex-shrink-0">
          <span className="font-semibold">Keys:</span> A-E answer • ↑↓ navigate • F flag • 1-9 jump
        </div>

        {/* Bubble Grid - Paper-like with grid lines */}
        <div 
          className="overflow-y-auto flex-1 px-2 py-1" 
          role="list"
          style={{
            background: `
              linear-gradient(to right, #e5e5e5 1px, transparent 1px),
              linear-gradient(to bottom, #e5e5e5 1px, transparent 1px),
              linear-gradient(to bottom, #FFFEF9 0%, #F8F6F0 100%)
            `,
            backgroundSize: "100% 28px, 100% 28px, 100% 100%",
          }}
        >
          <div
            className={cn(
              "grid gap-x-2",
              totalQuestions > 10 ? "grid-cols-2" : "grid-cols-1"
            )}
          >
            {/* Left Column */}
            <div className="border-r border-gray-300 pr-2" role="group" aria-label={`Questions 1 to ${midpoint}`}>
              {leftColumn.map((entry) => (
                <OMRRow
                  key={entry.index}
                  entry={entry}
                  onJump={handleJump}
                  onFlag={handleFlag}
                  onBubbleClick={handleBubbleClick}
                  onEssayClick={handleEssayClick}
                  compact={compact}
                  examMode={examMode}
                  totalQuestions={totalQuestions}
                />
              ))}
            </div>

            {/* Right Column */}
            {rightColumn.length > 0 && (
              <div
                className="pl-2"
                role="group"
                aria-label={`Questions ${midpoint + 1} to ${totalQuestions}`}
              >
                {rightColumn.map((entry) => (
                  <OMRRow
                    key={entry.index}
                    entry={entry}
                    onJump={handleJump}
                    onFlag={handleFlag}
                    onBubbleClick={handleBubbleClick}
                    onEssayClick={handleEssayClick}
                    compact={compact}
                    examMode={examMode}
                    totalQuestions={totalQuestions}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-3 py-2 border-t-2 border-gray-400 text-[9px] text-gray-500 text-center flex-shrink-0"
          style={{ background: "linear-gradient(to bottom, #F0EDE5 0%, #E8E4DC 100%)" }}
        >
          <div className="flex justify-between items-center">
            <span>Click bubble to answer • Click ESSAY to write</span>
            <span className="font-bold">
              {answeredCount}/{totalQuestions} Complete
            </span>
          </div>
        </div>
      </div>

      {/* Essay Input Modal */}
      {essayModalOpen && essayQuestionIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setEssayModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                Question {essayQuestionIndex + 1} — Essay Answer
              </h3>
              <button
                onClick={() => setEssayModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 flex-1 overflow-y-auto">
              <textarea
                value={essayDraft}
                onChange={(e) => setEssayDraft(e.target.value)}
                className="w-full h-48 p-3 border-2 border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Write your essay answer here..."
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-2">
                {essayDraft.length} characters
              </p>
            </div>
            
            {/* Modal Footer */}
            <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setEssayModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEssaySubmit}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
              >
                Save Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
};

/** Single row in the OMR sheet with realistic bubble styling */
interface OMRRowProps {
  entry: OMRQuestionEntry;
  onJump: (index: number) => void;
  onFlag: (e: React.MouseEvent, index: number) => void;
  onBubbleClick: (questionIndex: number, optionLabel: string) => void;
  onEssayClick: (questionIndex: number) => void;
  compact?: boolean;
  examMode: ExamMode;
  totalQuestions: number;
}

const OMRRow: React.FC<OMRRowProps> = React.memo(
  ({ entry, onJump, onFlag, onBubbleClick, onEssayClick, compact, examMode, totalQuestions }) => {
    const { index, optionLabels, selectedLabel, isFlagged, isCurrent, isLocked, questionType } =
      entry;

    // Monospace padded number (01, 02, ... 99, 100)
    const displayNumber = String(index + 1).padStart(totalQuestions >= 100 ? 3 : 2, "0");

    const rowRef = useRef<HTMLDivElement>(null);

    // Scroll into view when current
    useEffect(() => {
      if (isCurrent && rowRef.current) {
        rowRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "nearest" 
        });
      }
    }, [isCurrent]);

    return (
      <div
        ref={rowRef}
        className={cn(
          "flex items-center gap-0.5 h-6 px-1 transition-all duration-150 group",
          isCurrent && "bg-blue-100 border-l-3 border-l-blue-500 -mx-1 px-2",
          !isCurrent && isFlagged && "bg-orange-50",
          !isCurrent && !isFlagged && "hover:bg-yellow-50/70"
        )}
        role="listitem"
        aria-label={`Question ${index + 1}${isFlagged ? ", flagged for review" : ""}${selectedLabel ? `, answered ${selectedLabel}` : ", unanswered"}${isLocked ? ", locked" : ""}`}
        onClick={() => onJump(index)}
        onContextMenu={(e) => {
          e.preventDefault();
          onFlag(e, index);
        }}
      >
        {/* Question Number */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "text-[10px] font-bold w-6 text-right tabular-nums select-none flex-shrink-0 font-mono",
                "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 rounded",
                isCurrent ? "text-blue-700" : "text-gray-700",
                isFlagged && "text-orange-600"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onFlag(e, index);
              }}
              aria-label={`Question ${index + 1}, ${isFlagged ? "click to unflag" : "click to flag for review"}`}
            >
              {isFlagged ? (
                <Flag className="w-3.5 h-3.5 text-orange-500 inline fill-orange-200" />
              ) : (
                displayNumber
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {isFlagged
              ? `Unflag Q${index + 1}`
              : `Flag Q${index + 1} for review`}
          </TooltipContent>
        </Tooltip>

        {/* Separator */}
        <span className="text-gray-400 text-[8px] flex-shrink-0 mx-0.5 font-light">
          .
        </span>

        {/* Content based on question type */}
        {(questionType === 'essay' || questionType === 'fill-blank' || questionType === 'other') ? (
          /* Essay/Fill-blank: Show clickable label instead of bubbles */
          <div className="flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (questionType === 'essay' || questionType === 'fill-blank') {
                  onEssayClick(index);
                }
              }}
              className={cn(
                "text-[8px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wide transition-all",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                questionType === 'essay' && "bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200 focus:ring-purple-400 cursor-pointer",
                questionType === 'fill-blank' && "bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200 focus:ring-amber-400 cursor-pointer",
                questionType === 'other' && "bg-gray-100 text-gray-600 border border-gray-300 cursor-default"
              )}
              aria-label={`${questionType === 'essay' ? 'Click to write essay answer' : questionType === 'fill-blank' ? 'Click to fill in answer' : 'Other question type'} for question ${index + 1}`}
              disabled={questionType === 'other'}
            >
              {questionType === 'essay' ? 'ESSAY' : questionType === 'fill-blank' ? 'FILL-IN' : 'OTHER'}
            </button>
            {selectedLabel && (
              <span className="ml-1.5 text-[7px] text-green-600 font-medium">✓</span>
            )}
          </div>
        ) : (
          /* Multiple choice / True-False: Show bubbles */
          <div 
            className="flex items-center gap-0.5" 
            role="radiogroup" 
            aria-label={`Answer options for question ${index + 1}`}
          >
            {optionLabels.map((label) => {
              const isFilled = selectedLabel === label;
              const canInteract = examMode === "practice" || !isLocked;
              const isTF = questionType === 'true-false';

              return (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center justify-center transition-all duration-100 select-none",
                        "focus:outline-none focus:ring-2 focus:ring-offset-1",
                        // True/False uses wider rectangular shape
                        isTF 
                          ? (compact ? "w-5 h-4 text-[7px] rounded" : "w-6 h-5 text-[8px] rounded")
                          : (compact ? "w-4 h-4 text-[7px] rounded-full" : "w-5 h-5 text-[8px] rounded-full"),
                        // Filled state - solid black/dark fill like real OMR
                        isFilled && "bg-gray-900 text-white border-2 border-gray-900 font-bold shadow-inner",
                        // Empty state
                        !isFilled && "border-2 border-gray-500 text-gray-600 bg-white",
                        // Hover when interactive
                        !isFilled && canInteract && "hover:border-gray-700 hover:bg-gray-100 cursor-pointer",
                        // Current question highlight for unfilled
                        isCurrent && !isFilled && "border-blue-400 text-blue-500",
                        // Locked/disabled state
                        !canInteract && !isFilled && "opacity-50 cursor-not-allowed",
                        // Focus ring color
                        isFilled ? "focus:ring-gray-500" : "focus:ring-blue-400"
                      )}
                      role="radio"
                      aria-checked={isFilled}
                      aria-label={`Question ${index + 1}, choice ${label}${isFilled ? ", selected" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canInteract) {
                          onBubbleClick(index, label);
                        }
                      }}
                      disabled={!canInteract}
                      tabIndex={isCurrent ? 0 : -1}
                    >
                      {label}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-[10px]">
                    <span>Q{index + 1} — {isTF ? (label === 'T' ? 'True' : 'False') : `Option ${label}`}</span>
                    {isFilled && <span className="ml-1 text-green-600">(selected)</span>}
                    {!canInteract && <span className="ml-1 text-red-500">(locked)</span>}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}

        {/* Status indicators on the right */}
        <div className="ml-auto flex items-center gap-1 flex-shrink-0">
          {/* Lock indicator for exam mode */}
          {examMode === "exam" && isLocked && selectedLabel && (
            <Lock className="w-3 h-3 text-gray-400" aria-hidden="true" />
          )}
          {/* Eye indicator for current */}
          {isCurrent && (
            <Eye className="w-3 h-3 text-blue-500" aria-hidden="true" />
          )}
          {/* Checkmark for answered (non-current) */}
          {!isCurrent && selectedLabel && (
            <span className="text-[10px] text-gray-400">✓</span>
          )}
        </div>
      </div>
    );
  }
);

OMRRow.displayName = "OMRRow";

export default BoardExamAnswerSheet;
