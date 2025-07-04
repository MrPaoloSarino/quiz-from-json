import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EnhancedQuizQuestion, QuizSession } from '@/types/user';
import { Brain, Clock, Target, Zap, BarChart2, Calendar, Book, Repeat } from 'lucide-react';

interface LearningDashboardProps {
  questions: EnhancedQuizQuestion[];
  sessions: QuizSession[];
}

const LearningDashboard: React.FC<LearningDashboardProps> = ({
  questions,
  sessions
}) => {
  // Add safety checks and console logging for debugging
  console.log('🔍 [LearningDashboard] Questions:', questions?.length || 0);
  console.log('🔍 [LearningDashboard] Sessions:', sessions?.length || 0);
  
  if (!questions || questions.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No Learning Data Available</h3>
          <p className="text-gray-500">Complete some quiz questions to see your analytics!</p>
        </Card>
      </div>
    );
  }

  // Calculate overall metrics with safety checks
  const validQuestions = questions.filter(q => q.analytics && typeof q.analytics.strengthScore === 'number');
  const questionsWithAttempts = questions.filter(q => q.analytics && q.analytics.recallAttempts > 0);
  
  console.log('🔍 [Analytics] Valid questions:', validQuestions.length);
  console.log('🔍 [Analytics] Questions with attempts:', questionsWithAttempts.length);

  const overallStrength = validQuestions.length > 0 
    ? Math.round(validQuestions.reduce((sum, q) => sum + q.analytics.strengthScore, 0) / validQuestions.length * 100)
    : 0;

  const recallSuccess = questionsWithAttempts.length > 0 
    ? Math.round(questionsWithAttempts.reduce((sum, q) => {
        const attempts = Math.max(1, q.analytics.recallAttempts);
        return sum + (q.analytics.recallSuccesses / attempts);
      }, 0) / questionsWithAttempts.length * 100)
    : 0;

  const avgResponseTime = questionsWithAttempts.length > 0
    ? Math.round(questionsWithAttempts.reduce((sum, q) => sum + q.analytics.averageRecallTime, 0) / questionsWithAttempts.length)
    : 0;

  const masteredTopics = validQuestions.filter(q => q.analytics.strengthScore > 0.8).length;

  // Calculate learning velocity (questions mastered per hour of study)
  const totalStudyTime = sessions && sessions.length > 0 
    ? sessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / 3600 // Convert to hours
    : 0;
  const learningVelocity = totalStudyTime > 0 
    ? Math.round((masteredTopics / totalStudyTime) * 10) / 10
    : 0;

  console.log('🔍 [Analytics] Calculated metrics:', {
    overallStrength,
    recallSuccess,
    avgResponseTime,
    masteredTopics,
    totalStudyTime,
    learningVelocity
  });

  // Get upcoming reviews
  const upcomingReviews = questions
    .filter(q => {
      if (!q.spacedRepetition?.nextReviewDate) return false;
      const nextReview = new Date(q.spacedRepetition.nextReviewDate);
      const daysUntil = Math.ceil((nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 7; // Next 7 days
    })
    .sort((a, b) => {
      const aDate = new Date(a.spacedRepetition.nextReviewDate);
      const bDate = new Date(b.spacedRepetition.nextReviewDate);
      return aDate.getTime() - bDate.getTime();
    });

  // Get topics for interleaving
  const topicsForInterleaving = validQuestions
    .filter(q => q.analytics.strengthScore > 0.7)
    .map(q => q.category)
    .filter((v, i, a) => a.indexOf(v) === i); // Unique topics

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Overall Strength</h3>
          </div>
          <Progress value={overallStrength} className="h-2" />
          <span className="text-2xl font-semibold">{overallStrength}%</span>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium">Recall Success</h3>
          </div>
          <Progress value={recallSuccess} className="h-2" />
          <span className="text-2xl font-semibold">{recallSuccess}%</span>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">Avg Response</h3>
          </div>
          <span className="text-2xl font-semibold">{avgResponseTime}s</span>
          <span className="text-sm text-gray-500">per question</span>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium">Topics Mastered</h3>
          </div>
          <span className="text-2xl font-semibold">{masteredTopics}</span>
          <span className="text-sm text-gray-500">of {questions.length}</span>
        </Card>
      </div>

      {/* Learning Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Learning Velocity</h3>
          </div>
          <div className="space-y-2">
            <span className="text-3xl font-bold">{learningVelocity}</span>
            <span className="text-sm text-gray-500 ml-2">topics/hour</span>
            <p className="text-sm text-gray-600">
              You're mastering {learningVelocity} topics per hour of study
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">Upcoming Reviews</h3>
          </div>
          <div className="space-y-2">
            {upcomingReviews.slice(0, 3).map((q, i) => {
              const daysUntil = Math.ceil((q.spacedRepetition.nextReviewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm truncate flex-1">{q.question}</span>
                  <span className="text-sm text-gray-500">in {daysUntil}d</span>
                </div>
              );
            })}
            {upcomingReviews.length > 3 && (
              <span className="text-sm text-gray-500">
                +{upcomingReviews.length - 3} more...
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Topic Interleaving */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Repeat className="w-5 h-5 text-purple-500" />
          <h3 className="font-medium">Topics Ready for Interleaving</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {topicsForInterleaving.map((topic, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {topic}
            </span>
          ))}
          {topicsForInterleaving.length === 0 && (
            <span className="text-sm text-gray-500">
              Master more topics to unlock interleaving
            </span>
          )}
        </div>
      </Card>

      {/* Study Sessions */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Book className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium">Recent Study Sessions</h3>
        </div>
        <div className="space-y-3">
          {sessions.slice(-3).reverse().map((session, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium">
                  Session {sessions.length - i}
                </span>
                <div className="text-xs text-gray-500">
                  {new Date(session.startTime).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm">
                  {Math.round(session.timeSpent / 60)}min
                </span>
                <div className="text-xs text-gray-500">
                  Score: {session.totalScore}/{session.questions.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LearningDashboard; 