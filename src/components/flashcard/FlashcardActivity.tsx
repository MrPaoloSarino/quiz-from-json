import React, { useState, useEffect, useRef } from "react";
import type { FlashcardDeck } from "@/types/flashcard";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface FlashcardActivityProps {
  deck: FlashcardDeck;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

type FlashcardState = "idle" | "flipped" | "marked";

const FlashcardActivity: React.FC<FlashcardActivityProps> = ({ deck }) => {
  const [shuffle, setShuffle] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [playAll, setPlayAll] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [order, setOrder] = useState<number[]>(() => deck.cards.map((_, i) => i));
  const playAllRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState<{ correct: number[]; incorrect: number[] }>({ correct: [], incorrect: [] });
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<null | "correct" | "incorrect">(null);
  const [cardState, setCardState] = useState<FlashcardState>("idle");

  // Debug: Track state changes
  useEffect(() => {
    console.log("[AUDIT] flipped state changed:", flipped);
  }, [flipped]);

  useEffect(() => {
    console.log("[AUDIT] cardState changed:", cardState);
  }, [cardState]);

  // Sync cardState with flipped state
  useEffect(() => {
    if (flipped && cardState === "idle") {
      console.log("[AUDIT] Setting cardState to flipped");
      setCardState("flipped");
    } else if (!flipped && cardState === "flipped") {
      console.log("[AUDIT] Setting cardState to idle");
      setCardState("idle");
    }
  }, [flipped, cardState]);
  const card = deck.cards[order[current]];

  // Reset all state on deck change
  useEffect(() => {
    console.log("[FlashcardActivity] Deck changed, resetting state");
    setProgress({ correct: [], incorrect: [] });
    setCompleted(false);
    setCurrent(0);
    setFlipped(false);
    setCardState("idle");
    setShowFeedback(null);
    const newOrder = deck.cards.map((_, i) => i);
    if (shuffle) {
      setOrder(shuffleArray(newOrder));
    } else {
      setOrder(newOrder);
    }
  }, [deck]);

  // Handle shuffle toggle
  useEffect(() => {
    if (shuffle) {
      setOrder(shuffleArray(deck.cards.map((_, i) => i)));
    } else {
      setOrder(deck.cards.map((_, i) => i));
    }
  }, [shuffle, deck]);

  // Detect completion
  useEffect(() => {
    if (progress.correct.length + progress.incorrect.length === order.length && order.length > 0) {
      setCompleted(true);
      setPlayAll(false);
      if (playAllRef.current) {
        clearInterval(playAllRef.current);
        playAllRef.current = null;
      }
    }
  }, [progress, order.length]);

  // Play All mode: auto-advance, pause on manual interaction
  useEffect(() => {
    if (playAll && !completed && order.length > 1) {
      playAllRef.current = setInterval(() => {
        setFlipped(false);
        setCurrent(c => (c + 1 < order.length ? c + 1 : 0));
      }, 2000);
    } else if (playAllRef.current) {
      clearInterval(playAllRef.current);
      playAllRef.current = null;
    }
    return () => {
      if (playAllRef.current) {
        clearInterval(playAllRef.current);
        playAllRef.current = null;
      }
    };
  }, [playAll, order.length, completed]);

  // Reset state on card change
  useEffect(() => {
    console.log("[FlashcardActivity] Card/order changed, resetting card state");
    setCardState("idle");
    setShowFeedback(null);
  }, [current, order]);

  useEffect(() => {
    // Debug: log initial state relevant to Flip button
    console.log("[FlashcardActivity] Initial state:", {
      cardState,
      flipped,
      current,
      isMarked,
      completed,
      orderLength: order.length,
      progress,
      order,
      deckCardsLength: deck.cards.length,
    });
  }, []);

  useEffect(() => {
    // Debug: log state on card change
    console.log("[FlashcardActivity] Card changed:", {
      cardState,
      flipped,
      current,
      isMarked,
      completed,
      orderLength: order.length,
      progress,
      order,
      deckCardsLength: deck.cards.length,
    });
  }, [current, order]);

  // Prevent marking if already marked or not flipped
  const isMarked = progress.correct.includes(order[current]) || progress.incorrect.includes(order[current]);
  const canMark = flipped && !isMarked && !completed && order.length > 0;

  // Mark answer and auto-advance, prevent double marking
  const handleMark = (isCorrect: boolean) => {
    if (cardState !== "flipped") return;
    setProgress(prev => {
      const alreadyMarked = prev.correct.includes(order[current]) || prev.incorrect.includes(order[current]);
      if (alreadyMarked) return prev;
      return isCorrect
        ? { ...prev, correct: [...prev.correct, order[current]] }
        : { ...prev, incorrect: [...prev.incorrect, order[current]] };
    });
    setShowFeedback(isCorrect ? "correct" : "incorrect");
    setCardState("marked");
  };

  // Only allow flipping if not completed and not already marked
  const handleFlip = () => {
    console.log("[AUDIT] handleFlip called!");
    console.log("[AUDIT] handleFlip conditions:", {
      completed,
      isMarked,
      orderLength: order.length,
      shouldFlip: !completed && !isMarked && order.length > 0
    });
    if (!completed && !isMarked && order.length > 0) {
      console.log("[AUDIT] Flipping card - setting flipped state");
      setFlipped((f) => !f);
    } else {
      console.log("[AUDIT] Flip blocked by conditions");
    }
  };

  // Handle empty or 1-card decks
  if (order.length === 0) {
    return <div className="text-muted-foreground">No cards in this deck.</div>;
  }

  // Completion summary
  if (completed) {
    const total = order.length;
    const correct = progress.correct.length;
    const incorrect = progress.incorrect.length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl font-bold">You’ve completed this deck!</div>
        <div className="text-lg">Correct: {correct} / {total} ({percent}%)</div>
        <div className="text-lg">Incorrect: {incorrect}</div>
        <Button onClick={() => {
          setProgress({ correct: [], incorrect: [] });
          setCompleted(false);
          setCurrent(0);
          setFlipped(false);
        }}>Restart</Button>
      </div>
    );
  }

  const handleNext = () => {
    if (playAll) setPlayAll(false);
    setFlipped(false);
    setCurrent((c) => (c + 1 < order.length ? c + 1 : 0));
    setCardState("idle");
    setShowFeedback(null);
  };
  const handlePrev = () => {
    if (playAll) setPlayAll(false);
    setFlipped(false);
    setCurrent((c) => (c - 1 >= 0 ? c - 1 : order.length - 1));
    setCardState("idle");
    setShowFeedback(null);
  };

  if (!card) return <div>No cards in this deck.</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Progress bar and stats */}
      <div className="w-full max-w-md flex flex-col gap-1 mb-2">
        <Progress value={((progress.correct.length + progress.incorrect.length) / order.length) * 100} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Progress: {progress.correct.length + progress.incorrect.length} / {order.length}
          </span>
          <span>
            Correct: {progress.correct.length} | Incorrect: {progress.incorrect.length}
          </span>
        </div>
      </div>
      {/* Play mode controls */}
      <div className="flex gap-2 mb-2">
        <Button variant={shuffle ? "default" : "outline"} onClick={() => setShuffle(s => !s)}>
          Shuffle
        </Button>
        <Button variant={reverse ? "default" : "outline"} onClick={() => setReverse(r => !r)}>
          Reverse
        </Button>
        <Button variant={playAll ? "default" : "outline"} onClick={() => setPlayAll(p => !p)}>
          Play All
        </Button>
      </div>
      {/* Card UI */}
      <div className="w-full max-w-md" style={{ perspective: "1200px" }}>
        <div
          className={`relative w-full h-48 transition-transform duration-500 [transform-style:preserve-3d] ${cardState === "flipped" ? "rotate-y-180" : ""} ${showFeedback === "correct" ? 'border-4 border-green-500' : showFeedback === "incorrect" ? 'border-4 border-red-500' : ''}`}
          tabIndex={0}
          aria-label="Flashcard"
          style={{ cursor: 'default' }}
        >
          {/* Feedback overlay */}
          {cardState === "marked" && showFeedback && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              {showFeedback === "correct" ? (
                <Check className="w-16 h-16 text-green-500 opacity-80 animate-bounce" />
              ) : (
                <X className="w-16 h-16 text-red-500 opacity-80 animate-bounce" />
              )}
            </div>
          )}
          {/* Front */}
          <div className="absolute inset-0 z-10 flex flex-col h-full w-full [backface-visibility:hidden]">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{deck.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-2xl text-center min-h-[80px]">{reverse ? card.back : card.front}</div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Card {current + 1} of {order.length}
                </span>
                {cardState === "idle" && (() => {
                  const isDisabled = completed || order.length === 0;
                  console.log("[AUDIT] Rendering Flip button (front):", {
                    cardState,
                    isDisabled,
                    completed,
                    orderLength: order.length,
                    shouldShow: cardState === "idle"
                  });
                  return (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleFlip} 
                      disabled={isDisabled}
                    >
                      Flip
                    </Button>
                  );
                })()}
              </CardFooter>
            </Card>
          </div>
          {/* Back */}
          <div className="absolute inset-0 z-20 flex flex-col h-full w-full [backface-visibility:hidden] rotate-y-180">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{deck.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-2xl text-center min-h-[80px]">{reverse ? card.front : card.back}</div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Card {current + 1} of {order.length}
                </span>
                {cardState === "flipped" && (() => {
                  const isDisabled = completed || order.length === 0;
                  console.log("[AUDIT] Rendering Flip button (back):", {
                    cardState,
                    isDisabled,
                    completed,
                    orderLength: order.length,
                    shouldShow: cardState === "flipped"
                  });
                  return (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleFlip} 
                      disabled={isDisabled}
                    >
                      Flip
                    </Button>
                  );
                })()}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      {/* Mark buttons only in flipped state */}
      {cardState === "flipped" && (
        <div className="flex gap-2 mt-2">
          <Button variant="default" onClick={() => handleMark(true)}>
            <Check className="text-green-600 mr-1 w-4 h-4" /> Correct
          </Button>
          <Button variant="destructive" onClick={() => handleMark(false)}>
            <X className="mr-1 w-4 h-4" /> Incorrect
          </Button>
        </div>
      )}
      {/* Next/Prev only in marked state */}
      {cardState === "marked" && (
        <div className="flex gap-2 mt-2">
          <Button variant="secondary" onClick={() => { handlePrev(); }} disabled={order.length <= 1}>
            Previous
          </Button>
          <Button variant="secondary" onClick={() => { handleNext(); }} disabled={order.length <= 1}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlashcardActivity;

// Add the following to your global CSS (e.g., index.css or App.css):
// .rotate-y-180 { transform: rotateY(180deg); } 