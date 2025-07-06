import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, XCircle, Brain, MessageSquare, ChevronDown, ChevronUp, RefreshCw, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import QuestionFeedback from "./QuestionFeedback";
import LearningDashboard from '../analytics/LearningDashboard';
import StorageManager from '@/utils/storageManager';
import { toast } from 'sonner';
import { EnhancedQuizQuestion, QuizSession } from '@/types/user';
import aiService from '@/utils/aiService';

interface QuizResultsProps {
  questions: EnhancedQuizQuestion[];
  userAnswers: string[];
  score: number;
  onRestart: () => void;
  onNewQuiz: () => void;
  essayRatings: number[];
  onGeneratePrescription?: () => Promise<string>;
  provider: 'openrouter' | 'gemini' | 'openai';
  apiKey: string;
  selectedModel?: string;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  score,
  onRestart,
  onNewQuiz,
  essayRatings,
  onGeneratePrescription,
  provider,
  apiKey,
  selectedModel
}) => {
  const [prescription, setPrescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [showDetails, setShowDetails] = useState(true);
  const [aiSummary, setAiSummary] = useState<string>('');

  const totalPossible = questions.reduce((total, question) => {
    return total + (question.type === 'essay' ? 10 : 1);
  }, 0);
  
  const percentage = Math.round((score / totalPossible) * 100);

  const toggleQuestionExpansion = (questionIndex: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionIndex)) {
      newExpanded.delete(questionIndex);
    } else {
      newExpanded.add(questionIndex);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleGeneratePrescription = async () => {
    if (!onGeneratePrescription) return;
    
    setLoading(true);
    try {
      const result = await onGeneratePrescription();
      setPrescription(result);
    } catch (error) {
      console.error('Failed to generate prescription:', error);
      toast.error('Failed to generate learning prescription');
    } finally {
      setLoading(false);
    }
  };

  // Load sessions for the dashboard
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  React.useEffect(() => {
    const loadSessions = async () => {
      try {
        const userData = await StorageManager.loadUserData();
        if (userData && userData.sessions) {
          setSessions(userData.sessions);
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };
    loadSessions();
  }, []);

  React.useEffect(() => {
    // Generate a simple summary based on the results
    const correctAnswers = questions.filter((q, i) => userAnswers[i] === q.answer).length;
    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    let summary = '';
    if (percentage === 100) {
      summary = 'Perfect! You got every question correct. Excellent understanding! 🎉';
    } else if (percentage >= 80) {
      summary = `Great job! You scored ${percentage}% - you have a strong grasp of the material. 🌟`;
    } else if (percentage >= 60) {
      summary = `Good effort! You scored ${percentage}%. Review the missed questions to improve. 💪`;
    } else {
      summary = `You scored ${percentage}%. Don't worry - practice makes perfect! Keep studying. 📚`;
    }
    
    setAiSummary(summary);
  }, [questions, userAnswers]);

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      {aiSummary && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="text-center text-blue-900 font-semibold text-lg">
            {aiSummary}
          </div>
        </Card>
      )}
      {/* Results Summary */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          <div className="text-4xl font-bold text-blue-600">
            {score} / {questions.length}
          </div>
          <p className="text-gray-600">
            {score === questions.length
              ? "Perfect score! 🎉"
              : score >= questions.length * 0.8
              ? "Great job! 🌟"
              : score >= questions.length * 0.6
              ? "Good effort! 💪"
              : "Keep practicing! 📚"}
          </p>
        </div>
      </Card>

      {/* Learning Analytics */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              Learning Analytics
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>

          {showDetails && (
            <LearningDashboard
              questions={questions}
              sessions={sessions}
            />
          )}
        </div>
      </Card>

      {/* AI Learning Prescription */}
      {onGeneratePrescription && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">AI Learning Prescription</h3>
            </div>

            {!prescription ? (
              <Button
                onClick={handleGeneratePrescription}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Generate Learning Prescription
              </Button>
            ) : (
              <div className="prose max-w-none">
                {prescription.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex-1"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Button
          onClick={onNewQuiz}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;
