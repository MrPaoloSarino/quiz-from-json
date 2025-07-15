import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Puzzle } from 'lucide-react';
import Crossword from './Crossword';

type GameType = 'crossword' | null;

const Games: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType>(null);

  const handleGameSelect = (game: GameType) => {
    setCurrentGame(game);
  };

  const handleBackToGames = () => {
    setCurrentGame(null);
  };

  if (currentGame === 'crossword') {
    return <Crossword onBack={handleBackToGames} />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-3 mb-6">
        <Gamepad2 className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Games</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleGameSelect('crossword')}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Puzzle className="w-6 h-6" />
              Crossword
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Create and solve crossword puzzles with custom words and clues
            </p>
            <Button className="w-full">
              Play Crossword
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Games;