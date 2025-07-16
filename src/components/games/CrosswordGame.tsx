import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, X, Eye, EyeOff } from 'lucide-react';

interface WordClue {
  id: string;
  word: string;
  clue: string;
  position?: { row: number; col: number; direction: 'across' | 'down' };
  number?: number;
}

interface CrosswordProps {
  onBack: () => void;
}

const CrosswordGame: React.FC<CrosswordProps> = ({ onBack }) => {
  const [wordClues, setWordClues] = useState<WordClue[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [currentClue, setCurrentClue] = useState('');
  const [grid, setGrid] = useState<string[][]>([]);
  const [userInput, setUserInput] = useState<string[][]>([]);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [gridSize, setGridSize] = useState(15);
  const [showAnswers, setShowAnswers] = useState(false);
  const [placedWords, setPlacedWords] = useState<WordClue[]>([]);

  const addWordClue = () => {
    if (currentWord.trim() && currentClue.trim()) {
      const newWordClue: WordClue = {
        id: Date.now().toString(),
        word: currentWord.toUpperCase().trim(),
        clue: currentClue.trim()
      };
      setWordClues([...wordClues, newWordClue]);
      setCurrentWord('');
      setCurrentClue('');
    }
  };

  const removeWordClue = (id: string) => {
    setWordClues(wordClues.filter(wc => wc.id !== id));
  };

  const generateCrossword = () => {
    if (wordClues.length === 0) return;

    const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const placed: WordClue[] = [];
    const shuffled = [...wordClues].sort(() => Math.random() - 0.5);

    if (shuffled.length > 0) {
      const firstWord = shuffled[0];
      const startRow = Math.floor(gridSize / 2);
      const startCol = Math.floor((gridSize - firstWord.word.length) / 2);
      
      for (let i = 0; i < firstWord.word.length; i++) {
        newGrid[startRow][startCol + i] = firstWord.word[i];
      }
      
      placed.push({
        ...firstWord,
        position: { row: startRow, col: startCol, direction: 'across' },
        number: 1
      });
    }

    for (let i = 1; i < shuffled.length; i++) {
      const word = shuffled[i];
      let wordPlaced = false;

      for (const placedWord of placed) {
        if (wordPlaced) break;
        
        for (let j = 0; j < word.word.length; j++) {
          for (let k = 0; k < placedWord.word.length; k++) {
            if (word.word[j] === placedWord.word[k]) {
              const isPlacedAcross = placedWord.position!.direction === 'across';
              const newDirection = isPlacedAcross ? 'down' : 'across';
              
              let newRow, newCol;
              if (newDirection === 'across') {
                newRow = placedWord.position!.row + k;
                newCol = placedWord.position!.col - j;
              } else {
                newRow = placedWord.position!.row - j;
                newCol = placedWord.position!.col + k;
              }

              if (canPlaceWord(newGrid, word.word, newRow, newCol, newDirection)) {
                placeWord(newGrid, word.word, newRow, newCol, newDirection);
                placed.push({
                  ...word,
                  position: { row: newRow, col: newCol, direction: newDirection },
                  number: placed.length + 1
                });
                wordPlaced = true;
                break;
              }
            }
          }
        }
      }
    }

    setGrid(newGrid);
    setUserInput(Array(gridSize).fill(null).map(() => Array(gridSize).fill('')));
    setPlacedWords(placed);
    setCompletedWords([]);
  };

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: 'across' | 'down'): boolean => {
    if (direction === 'across') {
      if (col < 0 || col + word.length > gridSize || row < 0 || row >= gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
      }
    } else {
      if (row < 0 || row + word.length > gridSize || col < 0 || col >= gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
      }
    }
    return true;
  };

  const placeWord = (grid: string[][], word: string, row: number, col: number, direction: 'across' | 'down') => {
    if (direction === 'across') {
      for (let i = 0; i < word.length; i++) {
        grid[row][col + i] = word[i];
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        grid[row + i][col] = word[i];
      }
    }
  };

  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    const newUserInput = userInput.map(row => [...row]);
    newUserInput[rowIndex][colIndex] = value.toUpperCase();
    setUserInput(newUserInput);
    checkCompletedWords(newUserInput);
  };

  const checkCompletedWords = (currentInput: string[][]) => {
    const newlyCompletedWords: string[] = [];
    for (const word of placedWords) {
      if (word.position) {
        let correct = true;
        for (let i = 0; i < word.word.length; i++) {
          const { row, col, direction } = word.position;
          const r = direction === 'down' ? row + i : row;
          const c = direction === 'across' ? col + i : col;
          if (currentInput[r][c] !== word.word[i]) {
            correct = false;
            break;
          }
        }
        if (correct) {
          newlyCompletedWords.push(word.id);
        }
      }
    }
    setCompletedWords(newlyCompletedWords);
  };

  const renderGrid = () => {
    return (
      <div className="inline-block border-2 border-gray-300 bg-white">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => {
              const isNumberCell = placedWords.some(word => 
                word.position?.row === rowIndex && word.position?.col === colIndex
              );
              const wordNumber = placedWords.find(word => 
                word.position?.row === rowIndex && word.position?.col === colIndex
              )?.number;

              const completedWord = placedWords.find(word => {
                if (!completedWords.includes(word.id) || !word.position) return false;
                const { row, col, direction } = word.position;
                if (direction === 'across') {
                  return rowIndex === row && colIndex >= col && colIndex < col + word.word.length;
                } else {
                  return colIndex === col && rowIndex >= row && rowIndex < row + word.word.length;
                }
              });

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-bold relative
                    ${cell ? 'bg-white' : 'bg-gray-800'}
                    ${completedWord ? 'bg-green-200' : ''}
                  `}
                >
                  {isNumberCell && (
                    <span className="absolute top-0 left-0 text-xs text-blue-600 font-bold">
                      {wordNumber}
                    </span>
                  )}
                  {cell && (
                    <Input
                      type="text"
                      maxLength={1}
                      value={showAnswers ? cell : userInput[rowIndex]?.[colIndex] || ''}
                      onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                      className="w-full h-full text-center bg-transparent border-none focus:ring-0"
                      disabled={!cell || showAnswers}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderClues = () => {
    const acrossClues = placedWords.filter(word => word.position?.direction === 'across');
    const downClues = placedWords.filter(word => word.position?.direction === 'down');

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Across</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {acrossClues.map(word => (
                <div key={word.id} className={`text-sm ${completedWords.includes(word.id) ? 'text-green-600' : ''}`}>
                  <span className="font-bold">{word.number}.</span> {word.clue}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Down</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {downClues.map(word => (
                <div key={word.id} className={`text-sm ${completedWords.includes(word.id) ? 'text-green-600' : ''}`}>
                  <span className="font-bold">{word.number}.</span> {word.clue}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Button>
        <h1 className="text-2xl font-bold">Crossword Builder</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Words & Clues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Word</label>
              <Input
                value={currentWord}
                onChange={(e) => setCurrentWord(e.target.value)}
                placeholder="Enter word"
                onKeyPress={(e) => e.key === 'Enter' && addWordClue()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Clue</label>
              <Input
                value={currentClue}
                onChange={(e) => setCurrentClue(e.target.value)}
                placeholder="Enter clue"
                onKeyPress={(e) => e.key === 'Enter' && addWordClue()}
              />
            </div>
            
            <Button onClick={addWordClue} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Word & Clue
            </Button>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {wordClues.map(wc => (
                <div key={wc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <span className="font-medium">{wc.word}</span>
                    <span className="text-gray-600 ml-2">- {wc.clue}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWordClue(wc.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              onClick={generateCrossword}
              disabled={wordClues.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Generate Crossword
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Crossword Puzzle
              {placedWords.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnswers(!showAnswers)}
                >
                  {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showAnswers ? 'Hide' : 'Show'} Answers
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {placedWords.length > 0 ? (
              <div className="flex flex-col items-center">
                {renderGrid()}
                {renderClues()}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Add words and clues, then generate a crossword puzzle
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrosswordGame;
