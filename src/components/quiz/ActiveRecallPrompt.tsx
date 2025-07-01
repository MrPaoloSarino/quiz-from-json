import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, CheckCircle } from 'lucide-react';

interface ActiveRecallPromptProps {
  prompts: string[];
  onSubmit: (explanation: string) => void;
}

const ActiveRecallPrompt: React.FC<ActiveRecallPromptProps> = ({
  prompts,
  onSubmit
}) => {
  const [explanation, setExplanation] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(0);

  const handleNext = () => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(prev => prev + 1);
      setExplanation('');
    } else {
      onSubmit(explanation);
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-blue-50">
      <div className="flex items-center gap-3">
        <Brain className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-900">
          Active Recall Practice
        </h3>
      </div>

      <div className="space-y-4">
        <p className="text-blue-800 font-medium">
          {prompts[currentPrompt]}
        </p>

        <Textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Type your explanation here..."
          className="min-h-[120px] bg-white"
        />

        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-700">
            Prompt {currentPrompt + 1} of {prompts.length}
          </span>

          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!explanation.trim()}
          >
            {currentPrompt < prompts.length - 1 ? (
              'Next Prompt'
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Complete</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ActiveRecallPrompt; 