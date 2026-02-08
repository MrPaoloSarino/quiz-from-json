import React, { useCallback, useMemo } from "react";
import { Flag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

/**
 * Single question entry for the answer sheet.
 */
interface OMRQuestionEntry {
  /** 0-based index */
  index: number;
  /** Display label, e.g. "A","B","C","D" */
  optionLabels: string[];
  /** Which option label the user selected (empty string = unanswered) */
  selectedLabel: string;
  /** Whether the question is flagged for review */
  isFlagged: boolean;
  /** Whether this is the currently active question */
  isCurrent: boolean;
  /** Whether the answer is locked (already submitted) */
  isLocked: boolean;
}

interface OMRAnswerSheetProps {
  /** Total questions */
  totalQuestions: number;
  /** 0-based index of current question */
  currentQuestion: number;
  /** User answers array (empty string = unanswered) */
  userAnswers: string[];
  /** Array of options per question (used to derive labels) */
  questionsOptions: (string[] | undefined)[];
  /** Set of 0-based question indices that are flagged */
  flaggedQuestions: Set<number>;
  /** Callback when user clicks a question number to jump */
  onJumpToQuestion: (index: number) => void;
  /** Callback when user toggles flag on a question */
  onToggleFlag: (index: number) => void;
  /** Whether the sheet is in compact mode (mobile) */
  compact?: boolean;
}

/** Letter label for an option index (0→A, 1→B, etc.) */
const optionLetter = (idx: number): string => String.fromCharCode(65 + idx);

/**
 * OMR Answer Sheet — right-side panel that mimics a paper board-exam bubble sheet.
 * Renders numbered rows with A–E bubbles. Clicking a row number jumps to that question.
 */
const OMRAnswerSheet: React.FC<OMRAnswerSheetProps> = ({
  totalQuestions,
  currentQuestion,
  userAnswers,
  questionsOptions,
  flaggedQuestions,
  onJumpToQuestion,
  onToggleFlag,
  compact = false,
}) => {
  /** Build entries for each question */
  const entries: OMRQuestionEntry[] = useMemo(() => {
    return Array.from({ length: totalQuestions }, (_, i) => {
      const options = questionsOptions[i];
      const optionLabels = options
        ? options.map((_, oi) => optionLetter(oi))
        : ["A", "B", "C", "D"]; // fallback for essay / non-MC

      // Derive which label was selected
      let selectedLabel = "";
      if (userAnswers[i] && options) {
        const selectedIndex = options.indexOf(userAnswers[i]);
        if (selectedIndex >= 0) {
          selectedLabel = optionLetter(selectedIndex);
        }
      }

      return {
        index: i,
        optionLabels,
        selectedLabel,
        isFlagged: flaggedQuestions.has(i),
        isCurrent: i === currentQuestion,
        isLocked: !!userAnswers[i],
      };
    });
  }, [totalQuestions, currentQuestion, userAnswers, questionsOptions, flaggedQuestions]);

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

  // Stats
  const answeredCount = useMemo(
    () => userAnswers.filter((a) => a && a.trim() !== "").length,
    [userAnswers]
  );
  const flaggedCount = flaggedQuestions.size;

  // Split into two columns for large sets (like real OMR sheets)
  const midpoint = Math.ceil(totalQuestions / 2);
  const leftColumn = entries.slice(0, midpoint);
  const rightColumn = entries.slice(midpoint);

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "border-2 border-gray-300 rounded-lg shadow-md overflow-hidden flex flex-col",
          compact ? "max-h-[50vh]" : "max-h-[calc(100vh-200px)]"
        )}
        style={{
          background: "#FFFDF7",
          fontFamily: "'Courier New', Courier, monospace",
        }}
        role="region"
        aria-label="Answer Sheet"
      >
        {/* Header */}
        <div
          className="px-4 py-3 border-b-2 border-gray-300 flex-shrink-0"
          style={{ background: "#F5F0E8" }}
        >
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest text-center">
            ✎ Answer Sheet
          </h3>
          <p className="text-[10px] text-gray-500 text-center mt-1 tracking-wide">
            Shade the circle of the correct answer
          </p>
        </div>

        {/* Legend */}
        <div
          className="px-3 py-2 border-b border-gray-200 flex items-center justify-between gap-2 text-[10px] flex-shrink-0"
          style={{ background: "#FAF8F2" }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full border-2 border-gray-400"
                aria-hidden="true"
              />
              Unanswered
            </span>
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full bg-gray-800 border-2 border-gray-800"
                aria-hidden="true"
              />
              Answered
            </span>
            <span className="flex items-center gap-1">
              <Flag className="w-3 h-3 text-amber-500" aria-hidden="true" />
              Flagged
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-blue-500" aria-hidden="true" />
              Current
            </span>
          </div>
          <div className="text-gray-500">
            {answeredCount}/{totalQuestions}
            {flaggedCount > 0 && (
              <span className="ml-1 text-amber-600">
                ({flaggedCount} flagged)
              </span>
            )}
          </div>
        </div>

        {/* Bubble Grid */}
        <div className="overflow-y-auto flex-1 px-2 py-2" role="list">
          <div
            className={cn(
              "grid gap-x-4",
              totalQuestions > 10 ? "grid-cols-2" : "grid-cols-1"
            )}
          >
            {/* Left Column */}
            <div className="space-y-0" role="group" aria-label="Questions column 1">
              {leftColumn.map((entry) => (
                <OMRRow
                  key={entry.index}
                  entry={entry}
                  onJump={handleJump}
                  onFlag={handleFlag}
                  compact={compact}
                />
              ))}
            </div>

            {/* Right Column */}
            {rightColumn.length > 0 && (
              <div
                className="space-y-0 border-l border-gray-200 pl-3"
                role="group"
                aria-label="Questions column 2"
              >
                {rightColumn.map((entry) => (
                  <OMRRow
                    key={entry.index}
                    entry={entry}
                    onJump={handleJump}
                    onFlag={handleFlag}
                    compact={compact}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-3 py-2 border-t-2 border-gray-300 text-[10px] text-gray-400 text-center flex-shrink-0"
          style={{ background: "#F5F0E8" }}
        >
          Click question number to jump • Right-click to flag
        </div>
      </div>
    </TooltipProvider>
  );
};

/** Single row in the OMR sheet */
interface OMRRowProps {
  entry: OMRQuestionEntry;
  onJump: (index: number) => void;
  onFlag: (e: React.MouseEvent, index: number) => void;
  compact?: boolean;
}

const OMRRow: React.FC<OMRRowProps> = React.memo(
  ({ entry, onJump, onFlag, compact }) => {
    const { index, optionLabels, selectedLabel, isFlagged, isCurrent, isLocked } =
      entry;

    const displayNumber = String(index + 1).padStart(2, "0");

    return (
      <div
        className={cn(
          "flex items-center gap-1 py-[3px] px-1 rounded-sm transition-colors duration-150 group cursor-pointer",
          isCurrent && "bg-blue-50 border-l-2 border-blue-400",
          !isCurrent && "hover:bg-yellow-50/50 border-l-2 border-transparent"
        )}
        role="listitem"
        aria-label={`Question ${index + 1}${isFlagged ? ", flagged for review" : ""}${selectedLabel ? `, answered ${selectedLabel}` : ", unanswered"}`}
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
                "text-xs font-bold w-6 text-right tabular-nums select-none flex-shrink-0",
                isCurrent ? "text-blue-600" : "text-gray-600",
                isFlagged && "text-amber-600"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onFlag(e, index);
              }}
              aria-label={`Toggle flag for question ${index + 1}`}
            >
              {isFlagged ? (
                <Flag className="w-3 h-3 text-amber-500 inline" />
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

        {/* Separator dot */}
        <span className="text-gray-300 text-[8px] flex-shrink-0 mx-[1px]">
          │
        </span>

        {/* Bubbles */}
        <div className="flex items-center gap-[3px]">
          {optionLabels.map((label) => {
            const isFilled = selectedLabel === label;
            return (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-full transition-all duration-150 select-none",
                      compact ? "w-4 h-4 text-[7px]" : "w-5 h-5 text-[9px]",
                      isFilled
                        ? "bg-gray-800 text-white border-2 border-gray-800 font-bold shadow-sm"
                        : "border-[1.5px] border-gray-400 text-gray-500 hover:border-gray-600 hover:bg-gray-50",
                      isCurrent &&
                        !isFilled &&
                        "border-blue-300 text-blue-400"
                    )}
                    role="radio"
                    aria-checked={isFilled}
                    aria-label={`Option ${label}`}
                  >
                    {label}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Q{index + 1} — {label}
                  {isFilled && " (selected)"}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Lock indicator */}
        {isLocked && !isCurrent && (
          <span className="text-[8px] text-gray-300 ml-auto flex-shrink-0">
            ✓
          </span>
        )}
      </div>
    );
  }
);

OMRRow.displayName = "OMRRow";

export default OMRAnswerSheet;
