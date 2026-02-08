import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { FileText, LayoutPanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** Available quiz layout modes */
export type QuizLayoutMode = "standard" | "board-exam";

interface QuizLayoutToggleProps {
  /** Current active layout mode */
  mode: QuizLayoutMode;
  /** Callback when layout mode changes */
  onModeChange: (mode: QuizLayoutMode) => void;
}

/**
 * QuizLayoutToggle — a small toggle letting the user switch between
 * "Standard" (single-column) and "Board Exam" (split with OMR sheet) layouts.
 * Purely optional; defaults to standard.
 */
const QuizLayoutToggle: React.FC<QuizLayoutToggleProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="inline-flex items-center border rounded-lg p-0.5 bg-muted/50"
        role="radiogroup"
        aria-label="Quiz layout mode"
      >
        {/* Standard mode */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 gap-1.5 rounded-md text-xs font-medium transition-all",
                mode === "standard"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onModeChange("standard")}
              role="radio"
              aria-checked={mode === "standard"}
              aria-label="Standard layout"
            >
              <LayoutPanelLeft className="w-3.5 h-3.5" />
              Standard
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Classic single-column quiz view
          </TooltipContent>
        </Tooltip>

        {/* Board Exam mode */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 gap-1.5 rounded-md text-xs font-medium transition-all",
                mode === "board-exam"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onModeChange("board-exam")}
              role="radio"
              aria-checked={mode === "board-exam"}
              aria-label="Board exam layout"
            >
              <FileText className="w-3.5 h-3.5" />
              Board Exam
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Split view with OMR answer sheet (like Psychometrician board exams)
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default QuizLayoutToggle;
