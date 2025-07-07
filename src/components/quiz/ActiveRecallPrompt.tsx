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
    <Card className="p-6 space-y-6" style={{ background: 'var(--cerebrum-bg-secondary)' }}>
      <div className="flex items-center gap-3">
        <Brain className="w-6 h-6" style={{ color: 'var(--cerebrum-secondary)' }} />
        <h3 className="text-lg font-semibold" style={{ color: 'var(--cerebrum-primary)' }}>
          Active Recall Practice
        </h3>
      </div>

      <div className="space-y-4">
        <p style={{ color: 'var(--cerebrum-primary)', fontWeight: 500 }}>
          {prompts[currentPrompt]}
        </p>

        <Textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Type your explanation here..."
          className="min-h-[120px] bg-white"
        />

        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--cerebrum-secondary)' }}>
            Prompt {currentPrompt + 1} of {prompts.length}
          </span>

          <Button
            onClick={handleNext}
            style={{ background: 'var(--cerebrum-secondary)', color: '#fff', borderRadius: '0.375rem', padding: '0.5rem 1rem' }}
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