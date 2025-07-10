import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import FlashcardActivity from "@/components/flashcard/FlashcardActivity";
import type { FlashcardDeck } from "@/types/flashcard";
import LocalStorageBackup from "@/utils/localStorageBackup";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const FlashcardDashboard: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingDeck, setEditingDeck] = useState<FlashcardDeck | null>(null);
  const [editCards, setEditCards] = useState<FlashcardDeck['cards']>([]);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");

  const loadDecks = async () => {
    setLoading(true);
    const allDecks = await LocalStorageBackup.getFlashcardDecks();
    setDecks(allDecks);
    setLoading(false);
  };

  useEffect(() => {
    loadDecks();
  }, []);

  const handleCreateDeck = async () => {
    if (!newTitle.trim()) return;
    await LocalStorageBackup.saveFlashcardDeck({
      title: newTitle,
      description: newDescription,
      cards: [],
    });
    setNewTitle("");
    setNewDescription("");
    loadDecks();
  };

  const handleDeleteDeck = async (deckId: string) => {
    await LocalStorageBackup.deleteFlashcardDeck(deckId);
    if (selectedDeck?.id === deckId) setSelectedDeck(null);
    loadDecks();
  };

  const handleEditDeck = (deck: FlashcardDeck) => {
    setEditingDeck(deck);
    setEditCards([...deck.cards]);
    setEditTitle(deck.title);
    setEditDescription(deck.description || "");
    setEditFront("");
    setEditBack("");
  };

  const handleAddCard = () => {
    if (!editFront.trim() || !editBack.trim()) return;
    setEditCards(cards => [
      ...cards,
      { id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, front: editFront, back: editBack }
    ]);
    setEditFront("");
    setEditBack("");
  };

  const handleDeleteCard = (id: string) => {
    console.log("Deleting card with id:", id);
    setEditCards(cards => {
      const updated = cards.filter(card => card.id !== id);
      console.log("Updated cards after delete:", updated);
      return updated;
    });
  };

  const handleEditCard = (id: string, front: string, back: string) => {
    setEditCards(cards => cards.map(card => card.id === id ? { ...card, front, back } : card));
  };

  const handleSaveDeck = async () => {
    if (!editingDeck) return;
    await LocalStorageBackup.updateFlashcardDeck(editingDeck.id, {
      title: editTitle,
      description: editDescription,
      cards: editCards,
    });
    setEditingDeck(null);
    setEditCards([]);
    setEditTitle("");
    setEditDescription("");
    loadDecks();
  };

  const handleCancelEdit = () => {
    setEditingDeck(null);
    setEditCards([]);
    setEditTitle("");
    setEditDescription("");
  };

  if (selectedDeck) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Button variant="ghost" onClick={() => setSelectedDeck(null)} className="mb-4">← Back to Decks</Button>
        <FlashcardActivity deck={selectedDeck} />
      </div>
    );
  }

  // SortableCard component for drag-and-drop
  const SortableCard: React.FC<{
    card: { id: string; front: string; back: string };
    onEdit: (id: string, front: string, back: string) => void;
    onDelete: (id: string) => void;
  }> = ({ card, onEdit, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? '#f3f4f6' : undefined,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex gap-2 items-center p-2 rounded border bg-white">
        <Input
          value={card.front}
          onChange={e => onEdit(card.id, e.target.value, card.back)}
          placeholder="Front"
          className="w-48"
        />
        <Input
          value={card.back}
          onChange={e => onEdit(card.id, card.front, e.target.value)}
          placeholder="Back"
          className="w-48"
        />
        <Button size="icon" variant="ghost" onClick={() => onDelete(card.id)} aria-label="Delete card">🗑️</Button>
        <span className="cursor-grab text-gray-400" title="Drag to reorder">↕️</span>
      </div>
    );
  };

  if (editingDeck) {
    const handleDragEnd = (event: any) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = editCards.findIndex(card => card.id === active.id);
        const newIndex = editCards.findIndex(card => card.id === over.id);
        setEditCards(cards => arrayMove(cards, oldIndex, newIndex));
      }
    };
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Edit Deck: {editingDeck.title}</h2>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Deck title"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className="w-48"
          />
          <Input
            placeholder="Description (optional)"
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Cards</h3>
          {editCards.length === 0 && <div className="text-muted-foreground mb-2">No cards yet. Add one below!</div>}
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={editCards.map(card => card.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 mb-4" key={editCards.map(card => card.id).join('-')}>
                {editCards.map(card => (
                  <SortableCard key={card.id} card={card} onEdit={handleEditCard} onDelete={handleDeleteCard} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <div className="flex gap-2 mb-2">
            <Input
              value={editFront}
              onChange={e => setEditFront(e.target.value)}
              placeholder="Front"
              className="w-48"
            />
            <Input
              value={editBack}
              onChange={e => setEditBack(e.target.value)}
              placeholder="Back"
              className="w-48"
            />
            <Button onClick={handleAddCard} disabled={!editFront.trim() || !editBack.trim()}>+ Add Card</Button>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSaveDeck} disabled={!editTitle.trim()}>Save Deck</Button>
          <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Flashcards</h1>
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Deck title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          className="w-48"
        />
        <Input
          placeholder="Description (optional)"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleCreateDeck} disabled={!newTitle.trim() || loading}>
          + Add Deck
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : decks.length === 0 ? (
        <div className="text-muted-foreground">No flashcard decks yet. Create one above!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {decks.map(deck => (
            <Card key={deck.id} className="relative">
              <CardHeader>
                <CardTitle>{deck.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">{deck.description}</div>
                <Badge variant="outline">{deck.cards.length} cards</Badge>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button size="sm" onClick={() => setSelectedDeck(deck)}>
                  Study
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEditDeck(deck)}>
                  Edit
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDeleteDeck(deck.id)} aria-label="Delete deck">
                  🗑️
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardDashboard; 