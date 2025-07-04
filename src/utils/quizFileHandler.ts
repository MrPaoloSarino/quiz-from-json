import { QuizQuestion } from '@/types/quiz';
import { SpacedRepetitionData, ReviewHistoryEntry, LearningAnalytics, EnhancedQuizQuestion } from '@/types/user';

export const exportQuizToFile = (questions: QuizQuestion[]) => {
  // Create a JSON string with pretty formatting
  const quizData = JSON.stringify(questions, null, 2);
  
  // Create a blob with the quiz data
  const blob = new Blob([quizData], { type: 'application/json' });
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Generate a filename with date
  const date = new Date().toISOString().split('T')[0];
  link.download = `quiz-${date}.json`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importQuizFromFile = (file: File): Promise<QuizQuestion[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const questions = JSON.parse(content);
        resolve(questions);
      } catch (error) {
        reject(new Error('Invalid quiz file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

// Calculate next review date using spaced repetition algorithm
export const calculateNextReview = (
  spacedRepetition: SpacedRepetitionData,
  performance: 'again' | 'hard' | 'good' | 'easy'
): SpacedRepetitionData => {
  const MIN_INTERVAL = 1; // Minimum 1 day
  const MAX_INTERVAL = 365; // Maximum 1 year
  const MIN_EASE = 1.3;
  
  let { interval, easeFactor, consecutiveCorrect } = spacedRepetition;
  
  switch (performance) {
    case 'again':
      interval = MIN_INTERVAL;
      easeFactor = Math.max(MIN_EASE, easeFactor - 0.2);
      consecutiveCorrect = 0;
      break;
      
    case 'hard':
      interval = Math.max(MIN_INTERVAL, interval * 1.2);
      easeFactor = Math.max(MIN_EASE, easeFactor - 0.15);
      consecutiveCorrect = 0;
      break;
      
    case 'good':
      interval = consecutiveCorrect === 0 ? 1 : interval * easeFactor;
      consecutiveCorrect++;
      break;
      
    case 'easy':
      interval = interval * easeFactor * 1.3;
      easeFactor += 0.15;
      consecutiveCorrect++;
      break;
  }
  
  interval = Math.min(MAX_INTERVAL, Math.max(MIN_INTERVAL, Math.round(interval)));
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return {
    ...spacedRepetition,
    interval,
    easeFactor,
    consecutiveCorrect,
    nextReviewDate,
    lastReviewDate: new Date()
  };
};

// Initialize spaced repetition data for new questions
export const initializeSpacedRepetition = (): SpacedRepetitionData => ({
  lastReviewDate: new Date(),
  nextReviewDate: new Date(),
  interval: 1,
  easeFactor: 2.5,
  consecutiveCorrect: 0,
  reviewHistory: []
});

// Initialize learning analytics for new questions
export const initializeLearningAnalytics = (): LearningAnalytics => ({
  strengthScore: 0,
  lastRecallSuccess: false,
  recallAttempts: 0,
  recallSuccesses: 0,
  averageRecallTime: 0,
  lastInterleaved: new Date(),
  relatedConcepts: []
});

// Update learning analytics based on session performance
export const updateLearningAnalytics = (
  analytics: LearningAnalytics,
  isCorrect: boolean,
  timeSpent: number,
  isInterleaved: boolean
): LearningAnalytics => {
  console.log('📊 [Analytics Update] Input:', { 
    analytics, 
    isCorrect, 
    timeSpent, 
    isInterleaved 
  });

  const newAnalytics = { ...analytics };
  
  // Update recall stats - INCREMENT FIRST to fix division by zero
  newAnalytics.recallAttempts = analytics.recallAttempts + 1;
  if (isCorrect) {
    newAnalytics.recallSuccesses = analytics.recallSuccesses + 1;
    newAnalytics.lastRecallSuccess = true;
  } else {
    newAnalytics.lastRecallSuccess = false;
  }
  
  // Update average recall time - use NEW attempts count
  const previousTotalTime = analytics.averageRecallTime * analytics.recallAttempts;
  newAnalytics.averageRecallTime = (previousTotalTime + timeSpent) / newAnalytics.recallAttempts;
  
  // Update strength score (weighted average of performance metrics)
  const recallRate = newAnalytics.recallSuccesses / newAnalytics.recallAttempts;
  const timeWeight = Math.min(1, 30 / Math.max(1, newAnalytics.averageRecallTime)); // Prevent division by zero
  newAnalytics.strengthScore = (recallRate * 0.7) + (timeWeight * 0.3);
  
  // Update interleaving data
  if (isInterleaved) {
    newAnalytics.lastInterleaved = new Date();
  }
  
  console.log('📊 [Analytics Update] Output:', {
    recallAttempts: newAnalytics.recallAttempts,
    recallSuccesses: newAnalytics.recallSuccesses,
    averageRecallTime: newAnalytics.averageRecallTime,
    strengthScore: newAnalytics.strengthScore,
    recallRate,
    timeWeight
  });
  
  return newAnalytics;
};

// Generate active recall prompts for a question
export const generateActiveRecallPrompts = (question: EnhancedQuizQuestion): string[] => {
  const prompts = [];
  
  // Basic recall prompt
  prompts.push(`Explain the concept of "${question.question}" in your own words.`);
  
  // Application prompt
  prompts.push(`Give an example of how "${question.question}" applies in a real-world situation.`);
  
  // Relationship prompt
  if (question.analytics.relatedConcepts.length > 0) {
    prompts.push(
      `How does "${question.question}" relate to ${question.analytics.relatedConcepts[0]}?`
    );
  }
  
  return prompts;
};

// Check if a question is due for review
export const isQuestionDueForReview = (question: EnhancedQuizQuestion): boolean => {
  const now = new Date();
  return question.spacedRepetition.nextReviewDate <= now;
};

// Get optimal questions for interleaved practice
export const getInterleavedQuestions = (
  questions: EnhancedQuizQuestion[],
  currentTopic: string,
  count: number
): EnhancedQuizQuestion[] => {
  // Get questions from related but different topics
  const relatedQuestions = questions.filter(q => 
    q.category !== currentTopic && 
    q.analytics.relatedConcepts.includes(currentTopic)
  );
  
  // Sort by optimal review time (questions due for review get priority)
  const sortedQuestions = relatedQuestions.sort((a, b) => {
    const aTimeDiff = Math.abs(a.spacedRepetition.nextReviewDate.getTime() - Date.now());
    const bTimeDiff = Math.abs(b.spacedRepetition.nextReviewDate.getTime() - Date.now());
    return aTimeDiff - bTimeDiff;
  });
  
  return sortedQuestions.slice(0, count);
}; 