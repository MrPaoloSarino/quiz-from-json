import React from 'react';
import { useParams } from 'react-router-dom';
import { useLearning } from '@/contexts/LearningContext';

const AIDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useLearning();
  
  const explanation = state.aiExplanations.find(e => e.questionId === id);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Explanation Details</h1>
      
      {explanation ? (
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-4">
            <h2 className="font-semibold mb-2">Question:</h2>
            <p className="text-primary">{explanation.question}</p>
          </div>

          <div className="bg-card rounded-lg p-4">
            <h2 className="font-semibold mb-2">Your Answer:</h2>
            <p className="text-primary">{explanation.userAnswer}</p>
          </div>

          <div className="bg-card rounded-lg p-4">
            <h2 className="font-semibold mb-2">Detailed Analysis:</h2>
            <p className="text-primary whitespace-pre-wrap">{explanation.detailedFeedback}</p>
          </div>

          <div className="bg-card rounded-lg p-4">
            <h2 className="font-semibold mb-2">Learning Tips:</h2>
            <ul className="list-disc pl-6 space-y-2">
              {explanation.learningTips.map((tip, index) => (
                <li key={index} className="text-primary">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-destructive">Explanation not found</p>
      )}
    </div>
  );
};

export default AIDetailsPage;