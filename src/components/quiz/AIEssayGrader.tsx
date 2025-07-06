import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Brain, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import aiManager from '@/utils/aiManager';

interface AIEssayGraderProps {
  question: string;
  studentAnswer: string;
  onGradingComplete: (grade: {
    score: number;
    maxScore: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    grade: string;
  }) => void;
}

const AIEssayGrader: React.FC<AIEssayGraderProps> = ({
  question,
  studentAnswer,
  onGradingComplete
}) => {
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<{
    score: number;
    maxScore: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    grade: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAIAvailable = aiManager.isAvailable();
  const providerInfo = aiManager.getProviderInfo();

  // Automatically start grading when component mounts (if AI is available and we have content)
  useEffect(() => {
    if (isAIAvailable && studentAnswer.trim().length > 10 && !gradingResult && !isGrading) {
      handleAutoGrade();
    }
  }, [isAIAvailable, studentAnswer]);

  const handleAutoGrade = async () => {
    if (!isAIAvailable) {
      setError('AI grading is not available. Please configure an API key in Settings.');
      return;
    }

    if (studentAnswer.trim().length < 10) {
      setError('Essay is too short for AI grading (minimum 10 characters required).');
      return;
    }

    setIsGrading(true);
    setError(null);

    try {
      console.log('🤖 Starting AI essay grading...', { question, answerLength: studentAnswer.length });
      
      const result = await aiManager.gradeEssay(question, studentAnswer);
      
      console.log('✅ AI grading completed:', result);
      
      setGradingResult(result);
      onGradingComplete(result);
      
      toast.success(`Essay graded: ${result.grade} (${result.score}/${result.maxScore})`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to grade essay';
      setError(errorMessage);
      toast.error(`AI grading failed: ${errorMessage}`);
      console.error('AI grading error:', err);
    } finally {
      setIsGrading(false);
    }
  };

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreColor = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  if (!isAIAvailable) {
    return (
      <Card className="mt-4 border-orange-200 bg-orange-50">
        <CardContent className="pt-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              AI essay grading is not available. Please go to <strong>Settings</strong> and add an API key to enable automatic essay grading.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Grading Status */}
      {isGrading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">AI is grading your essay...</p>
                <p className="text-sm text-blue-600">
                  Using {providerInfo?.name} to analyze your response
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Grading Results */}
      {gradingResult && !isGrading && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-600" />
                AI Essay Grade
                {providerInfo && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {providerInfo.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-lg font-bold ${getGradeColor(gradingResult.grade)}`}>
                  {gradingResult.grade}
                </Badge>
                <span className={`text-xl font-bold ${getScoreColor(gradingResult.score, gradingResult.maxScore)}`}>
                  {gradingResult.score}/{gradingResult.maxScore}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Score Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Score</span>
                <span className="text-sm text-gray-600">
                  {Math.round((gradingResult.score / gradingResult.maxScore) * 100)}%
                </span>
              </div>
              <Progress 
                value={(gradingResult.score / gradingResult.maxScore) * 100} 
                className="h-3"
              />
            </div>

            {/* Overall Feedback */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Overall Feedback
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {gradingResult.feedback}
              </p>
            </div>

            {/* Strengths */}
            {gradingResult.strengths.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium mb-2 flex items-center gap-2 text-green-800">
                  <Star className="h-4 w-4" />
                  What You Did Well
                </h4>
                <ul className="space-y-1">
                  {gradingResult.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {gradingResult.improvements.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-4 w-4" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {gradingResult.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Grading Info */}
            <div className="text-xs text-gray-500 border-t pt-2">
              🤖 Automatically graded by {providerInfo?.name} • 
              Rubric: Content (4pts), Organization (3pts), Analysis (2pts), Writing (1pt)
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIEssayGrader;
