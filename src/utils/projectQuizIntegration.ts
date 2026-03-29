/**
 * Integration between Quiz system and Project Management
 * Automatically records quiz completions to active project
 */

import { projectManager } from './projectManager';
import { QuizQuestion } from '@/types/quiz';
import { toast } from 'sonner';

export interface QuizCompletionData {
  questions: QuizQuestion[];
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
}

/**
 * Record quiz completion to active project
 */
export function recordQuizToProject(data: QuizCompletionData): boolean {
  try {
    // Get active project
    const activeProject = projectManager.getActiveProject();
    
    if (!activeProject) {
      console.log('📊 No active project - quiz not recorded to project');
      return false;
    }

    // Calculate accuracy percentage
    const accuracy = (data.score / data.totalQuestions) * 100;
    
    // Determine difficulty if not provided
    const difficulty = data.difficulty || inferDifficulty(accuracy);
    
    // Find matching subject
    const subject = findMatchingSubject(activeProject, data.questions, data.topic);
    
    if (!subject) {
      console.log('📊 No matching subject found - creating general subject');
      // Could create a "General" subject or skip recording
      toast.info('Quiz completed but no matching subject found in project');
      return false;
    }

    // Convert time to minutes
    const timeSpentMinutes = Math.ceil(data.timeSpentSeconds / 60);
    
    // Record to project
    projectManager.recordQuizCompletion(
      activeProject.id,
      subject.id,
      data.totalQuestions,
      accuracy,
      timeSpentMinutes,
      difficulty
    );

    // Show success notification
    toast.success(
      `Progress recorded to "${activeProject.name}"`,
      {
        description: `${data.totalQuestions} questions • ${accuracy.toFixed(0)}% accuracy • ${subject.name}`,
        duration: 4000,
      }
    );

    console.log('✅ Quiz recorded to project:', {
      project: activeProject.name,
      subject: subject.name,
      questions: data.totalQuestions,
      accuracy: accuracy.toFixed(1) + '%',
      time: timeSpentMinutes + ' min',
    });

    return true;
  } catch (error) {
    console.error('Failed to record quiz to project:', error);
    return false;
  }
}

/**
 * Infer difficulty based on accuracy
 */
function inferDifficulty(accuracy: number): 'easy' | 'medium' | 'hard' {
  if (accuracy >= 85) return 'easy';
  if (accuracy >= 70) return 'medium';
  return 'hard';
}

/**
 * Find matching subject in project based on quiz questions or topic
 */
function findMatchingSubject(
  project: any,
  questions: QuizQuestion[],
  topic?: string
): any | null {
  if (!project.subjects || project.subjects.length === 0) {
    return null;
  }

  // Try to match by explicit topic first
  if (topic) {
    const match = project.subjects.find((subject: any) =>
      subject.name.toLowerCase().includes(topic.toLowerCase()) ||
      topic.toLowerCase().includes(subject.name.toLowerCase())
    );
    if (match) return match;
  }

  // Try to match by question tags
  const questionTags = questions
    .flatMap(q => q.tags || [])
    .filter(Boolean);

  if (questionTags.length > 0) {
    for (const subject of project.subjects) {
      const subjectName = subject.name.toLowerCase();
      const hasMatch = questionTags.some(tag =>
        tag.toLowerCase().includes(subjectName) ||
        subjectName.includes(tag.toLowerCase())
      );
      if (hasMatch) return subject;
    }
  }

  // Try to match by question text content (look for keywords)
  const questionTexts = questions
    .map(q => q.question.toLowerCase())
    .join(' ');

  for (const subject of project.subjects) {
    const keywords = extractKeywords(subject.name);
    const hasMatch = keywords.some(keyword =>
      questionTexts.includes(keyword.toLowerCase())
    );
    if (hasMatch) return subject;
  }

  // Default to first subject if no match found
  return project.subjects[0];
}

/**
 * Extract keywords from subject name for matching
 */
function extractKeywords(subjectName: string): string[] {
  // Remove common words and split
  const commonWords = ['and', 'or', 'the', 'of', 'in', 'to', 'for'];
  return subjectName
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
}

/**
 * Get quiz topic from questions
 */
export function inferQuizTopic(questions: QuizQuestion[]): string | undefined {
  // Try to get most common tag
  const tagCounts = new Map<string, number>();
  
  questions.forEach(q => {
    if (q.tags) {
      q.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
  });

  if (tagCounts.size === 0) return undefined;

  // Return most common tag
  let maxCount = 0;
  let mostCommonTag = '';
  
  tagCounts.forEach((count, tag) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonTag = tag;
    }
  });

  return mostCommonTag || undefined;
}
