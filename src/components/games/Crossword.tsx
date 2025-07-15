import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface WordClue {
  id: string;
  word: string;
  clue: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
  revealed: boolean;
}

interface CrosswordProps {
  onBack: () => void;
}

const Crossword: React.FC<CrosswordProps> = ({ onBack }) => {
  const [wordClues, setWordClues] = useState<WordClue[]>([]);

  const [csvInput, setCsvInput] = useState('');
  const [grid, setGrid] = useState<string[][]>([]);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [hintGrid, setHintGrid] = useState<boolean[][]>([]);
  const [gridSize, setGridSize] = useState(20);
  const [showInput, setShowInput] = useState(true);



  const removeWordClue = (id: string) => {
    setWordClues(wordClues.filter(wc => wc.id !== id));
  };

  const processCsvInput = () => {
    if (!csvInput.trim()) return;
    
    const lines = csvInput.trim().split('\n');
    const newWordClues: WordClue[] = [];
    
    lines.forEach((line, index) => {
      const parts = line.split(',');
      if (parts.length >= 2) {
        const word = parts[0].trim().toUpperCase();
        const clue = parts.slice(1).join(',').trim(); // Handle commas in clues
        
        if (word && clue) {
          newWordClues.push({
            id: `csv-${Date.now()}-${index}`,
            word,
            clue,
            direction: 'across',
            startRow: 0,
            startCol: 0,
            revealed: false
          });
        }
      }
    });
    
    setWordClues([...wordClues, ...newWordClues]);
    setCsvInput('');
  };

  const calculateOptimalGridSize = (words: WordClue[]) => {
    if (words.length === 0) return 15;
    
    const maxWordLength = Math.max(...words.map(w => w.word.length));
    const wordCount = words.length;
    
    // Base size calculation
    let optimalSize = Math.max(
      maxWordLength + 4, // Ensure longest word fits with padding
      Math.ceil(Math.sqrt(wordCount * 8)), // Scale with word count
      12 // Minimum size
    );
    
    // Adjust based on word count
    if (wordCount <= 5) optimalSize = Math.min(optimalSize, 15);
    else if (wordCount <= 10) optimalSize = Math.min(optimalSize, 18);
    else if (wordCount <= 20) optimalSize = Math.min(optimalSize, 22);
    else optimalSize = Math.min(optimalSize, 25);
    
    return optimalSize;
  };

  const generateCrossword = () => {
    if (wordClues.length === 0) return;

    const optimalSize = calculateOptimalGridSize(wordClues);
    setGridSize(optimalSize);
    
    const newGrid: string[][] = Array(optimalSize).fill(null).map(() => Array(optimalSize).fill(''));
    const placedWords: WordClue[] = [];

    // Simple placement algorithm
    const shuffledWords = [...wordClues].sort(() => Math.random() - 0.5);
    
    for (const wordClue of shuffledWords) {
      let placed = false;
      const attempts = 100;
      
      for (let attempt = 0; attempt < attempts && !placed; attempt++) {
        const direction = Math.random() > 0.5 ? 'across' : 'down';
        const word = wordClue.word;
        
        if (direction === 'across') {
          const maxCol = gridSize - word.length;
          const row = Math.floor(Math.random() * gridSize);
          const col = Math.floor(Math.random() * maxCol);
          
          // Check if placement is valid
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row][col + i] !== '' && newGrid[row][col + i] !== word[i]) {
              canPlace = false;
              break;
            }
          }
          
          if (canPlace) {
            // Place the word
            for (let i = 0; i < word.length; i++) {
              newGrid[row][col + i] = word[i];
            }
            placedWords.push({
              ...wordClue,
              direction,
              startRow: row,
              startCol: col
            });
            placed = true;
          }
        } else {
          const maxRow = gridSize - word.length;
          const row = Math.floor(Math.random() * maxRow);
          const col = Math.floor(Math.random() * gridSize);
          
          // Check if placement is valid
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row + i][col] !== '' && newGrid[row + i][col] !== word[i]) {
              canPlace = false;
              break;
            }
          }
          
          if (canPlace) {
            // Place the word
            for (let i = 0; i < word.length; i++) {
              newGrid[row + i][col] = word[i];
            }
            placedWords.push({
              ...wordClue,
              direction,
              startRow: row,
              startCol: col
            });
            placed = true;
          }
        }
      }
    }

    setGrid(newGrid);
    setUserGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill('')));
    setWordClues(placedWords);
    setShowInput(false);
    
    // Auto-generate hints
    setTimeout(() => {
      const autoHintGrid = Array(optimalSize).fill(null).map(() => Array(optimalSize).fill(false));
      const letterCells: { row: number; col: number }[] = [];
      
      // Collect all letter cells
      for (let row = 0; row < optimalSize; row++) {
        for (let col = 0; col < optimalSize; col++) {
          if (newGrid[row][col] !== '') {
            letterCells.push({ row, col });
          }
        }
      }
      
      // Randomly select 25% of letter cells as hints
      const hintCount = Math.floor(letterCells.length * 0.25);
      const shuffledCells = [...letterCells].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < Math.min(hintCount, shuffledCells.length); i++) {
        const { row, col } = shuffledCells[i];
        autoHintGrid[row][col] = true;
      }
      
      setHintGrid(autoHintGrid);
    }, 100);
  };

  const toggleReveal = (id: string) => {
    setWordClues(wordClues.map(wc => 
      wc.id === id ? { ...wc, revealed: !wc.revealed } : wc
    ));
  };



  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newUserGrid = [...userGrid];
    newUserGrid[rowIndex][colIndex] = value.toUpperCase().slice(-1); // Only keep last character
    setUserGrid(newUserGrid);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    if (e.key === 'Backspace' && userGrid[rowIndex][colIndex] === '') {
      // Move to previous cell on backspace if current cell is empty
      const prevCell = document.querySelector(`input[data-row="${rowIndex}"][data-col="${colIndex - 1}"]`) as HTMLInputElement;
      if (prevCell) {
        prevCell.focus();
      }
    } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      // Move to next cell after typing a letter
      setTimeout(() => {
        const nextCell = document.querySelector(`input[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`) as HTMLInputElement;
        if (nextCell) {
          nextCell.focus();
        }
      }, 0);
    }
  };

  const renderGrid = () => {
    const shouldShowAnswer = (rowIndex: number, colIndex: number) => {
      // Check if this cell is part of any revealed word
      return wordClues.some(wc => {
        if (!wc.revealed) return false;
        
        if (wc.direction === 'across') {
          return rowIndex === wc.startRow && 
                 colIndex >= wc.startCol && 
                 colIndex < wc.startCol + wc.word.length;
        } else {
          return colIndex === wc.startCol && 
                 rowIndex >= wc.startRow && 
                 rowIndex < wc.startRow + wc.word.length;
        }
      });
    };

    const getWordNumber = (rowIndex: number, colIndex: number) => {
      // Sort words by grid position (top to bottom, left to right) for proper numbering
      const sortedWords = [...wordClues].sort((a, b) => {
        if (a.startRow !== b.startRow) return a.startRow - b.startRow;
        return a.startCol - b.startCol;
      });

      // Find if this is the start of a word and return its sequential number
      const wordAtPosition = sortedWords.find(wc => 
        wc.startRow === rowIndex && wc.startCol === colIndex
      );
      if (wordAtPosition) {
        return sortedWords.indexOf(wordAtPosition) + 1;
      }
      return null;
    };

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div style={{ display: 'inline-block', fontSize: 0 }}>
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex" style={{ lineHeight: 0, fontSize: 0 }}>
              {row.map((cell, colIndex) => {
                const showAnswer = shouldShowAnswer(rowIndex, colIndex);
                const isHint = hintGrid[rowIndex]?.[colIndex] || false;
                const wordNumber = getWordNumber(rowIndex, colIndex);
                const isLetterCell = cell !== '';
                
                if (!isLetterCell) {
                  // Empty/blocked cell
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="w-10 h-10 border border-gray-300 bg-gray-200"
                    />
                  );
                }

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="w-10 h-10 border border-gray-300 bg-white relative"
                  >
                    {wordNumber && (
                      <span className="absolute top-0 left-0 text-xs text-blue-600 font-bold leading-none">
                        {wordNumber}
                      </span>
                    )}
                    <input
                      type="text"
                      data-row={rowIndex}
                      data-col={colIndex}
                      value={showAnswer ? cell : (isHint ? cell : (userGrid[rowIndex]?.[colIndex] || ''))}
                      onChange={(e) => !showAnswer && !isHint && handleCellChange(rowIndex, colIndex, e.target.value)}
                      onKeyDown={(e) => !showAnswer && !isHint && handleKeyDown(e, rowIndex, colIndex)}
                      className={`w-full h-full text-center text-sm font-bold border-none outline-none ${
                        isHint ? 'bg-blue-100 text-blue-800' : 'bg-white'
                      }`}
                      maxLength={1}
                      disabled={showAnswer || isHint}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClues = () => {
    // Sort words by grid position (top to bottom, left to right) for proper numbering
    const sortedWords = [...wordClues].sort((a, b) => {
      if (a.startRow !== b.startRow) return a.startRow - b.startRow;
      return a.startCol - b.startCol;
    });

    // Assign sequential numbers to each word
    const numberedWords = sortedWords.map((word, index) => ({
      ...word,
      number: index + 1
    }));

    const acrossClues = numberedWords.filter(wc => wc.direction === 'across');
    const downClues = numberedWords.filter(wc => wc.direction === 'down');

    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-bold mb-2 text-sm">Across</h3>
          <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-2">
            {acrossClues.map((wc) => (
              <div key={wc.id} className="text-xs">
                <div className="flex items-start gap-1">
                  <span className="font-semibold text-xs">{wc.number}.</span>
                  <span className="flex-1 text-xs">{wc.clue}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleReveal(wc.id)}
                    className="p-0 h-4 w-4 text-xs"
                  >
                    {wc.revealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                </div>
                {wc.revealed && (
                  <div className="text-gray-800 font-bold text-xs ml-3">
                    {wc.word}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2 text-sm">Down</h3>
          <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-2">
            {downClues.map((wc) => (
              <div key={wc.id} className="text-xs">
                <div className="flex items-start gap-1">
                  <span className="font-semibold text-xs">{wc.number}.</span>
                  <span className="flex-1 text-xs">{wc.clue}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleReveal(wc.id)}
                    className="p-0 h-4 w-4 text-xs"
                  >
                    {wc.revealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                </div>
                {wc.revealed && (
                  <div className="text-gray-800 font-bold text-xs ml-3">
                    {wc.word}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">Crossword Puzzle</h1>
      </div>

      {showInput && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bulk Add (CSV Format)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter words and clues (one per line)
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Format: WORD,Clue description
                </p>
                <Textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="APPLE,A red or green fruit&#10;BANANA,Yellow curved fruit&#10;ORANGE,Citrus fruit"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={processCsvInput} className="w-full" disabled={!csvInput.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add All Words
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {wordClues.length > 0 && showInput && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Word List ({wordClues.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-y-auto space-y-2 mb-4">
              {wordClues.map((wc) => (
                <div key={wc.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="font-semibold">{wc.word}</span>
                  <span className="text-gray-600">-</span>
                  <span className="flex-1">{wc.clue}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeWordClue(wc.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={generateCrossword} className="w-full">
              Generate Crossword
            </Button>
          </CardContent>
        </Card>
      )}

      {grid.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Crossword Grid - 2/3 width */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="max-h-[70vh] overflow-auto">
                {renderGrid()}
              </div>
            </div>
            
            {/* Clues - 1/3 width */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Clues</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderClues()}
                </CardContent>
              </Card>
            </div>
          </div>

          <Button onClick={() => setShowInput(true)} variant="outline" className="w-full">
            Add More Words
          </Button>
        </div>
      )}
    </div>
  );
};

export default Crossword;