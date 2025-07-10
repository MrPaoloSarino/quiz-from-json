import { z } from "zod";

/**
 * Flashcard represents a single card with a front (prompt) and back (answer).
 */
export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

/**
 * FlashcardDeck groups multiple flashcards under a title.
 */
export interface FlashcardDeck {
  id: string;
  title: string;
  description?: string;
  cards: Flashcard[];
}

// Zod schemas for runtime validation
export const FlashcardSchema = z.object({
  id: z.string(),
  front: z.string(),
  back: z.string(),
});

export const FlashcardDeckSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  cards: z.array(FlashcardSchema),
});

// Activity type for registry integration
export type FlashcardActivity = FlashcardDeck; 