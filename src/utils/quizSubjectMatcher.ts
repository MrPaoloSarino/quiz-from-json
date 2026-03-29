/**
 * Match quizzes to project subjects
 * Helps filter and find relevant quizzes for a subject
 */

import { QuizQuestion } from '@/types/quiz';

export interface QuizMetadata {
  id: string;
  title: string;
  questions: QuizQuestion[];
  tags?: string[];
  description?: string;
}

/**
 * Check if a quiz matches a subject
 */
export function quizMatchesSubject(
  quiz: QuizMetadata,
  subjectName: string
): boolean {
  const subjectLower = subjectName.toLowerCase();
  const keywords = extractKeywords(subjectName);

  // Check quiz title
  if (quiz.title.toLowerCase().includes(subjectLower)) {
    return true;
  }

  // Check quiz description
  if (quiz.description && quiz.description.toLowerCase().includes(subjectLower)) {
    return true;
  }

  // Check quiz tags
  if (quiz.tags) {
    const hasMatchingTag = quiz.tags.some(tag =>
      tag.toLowerCase().includes(subjectLower) ||
      subjectLower.includes(tag.toLowerCase())
    );
    if (hasMatchingTag) return true;
  }

  // Check question tags
  const questionTags = quiz.questions
    .flatMap(q => q.tags || [])
    .filter(Boolean);

  const hasMatchingQuestionTag = questionTags.some(tag =>
    tag.toLowerCase().includes(subjectLower) ||
    subjectLower.includes(tag.toLowerCase())
  );
  if (hasMatchingQuestionTag) return true;

  // Check for keyword matches
  const titleWords = quiz.title.toLowerCase().split(/\s+/);
  const hasKeywordMatch = keywords.some(keyword =>
    titleWords.some(word => word.includes(keyword) || keyword.includes(word))
  );

  return hasKeywordMatch;
}

/**
 * Filter quizzes by subject
 */
export function filterQuizzesBySubject(
  quizzes: QuizMetadata[],
  subjectName: string
): QuizMetadata[] {
  return quizzes.filter(quiz => quizMatchesSubject(quiz, subjectName));
}

/**
 * Score how well a quiz matches a subject (0-100)
 */
export function scoreQuizMatch(
  quiz: QuizMetadata,
  subjectName: string
): number {
  let score = 0;
  const subjectLower = subjectName.toLowerCase();
  const keywords = extractKeywords(subjectName);

  // Exact title match: +50
  if (quiz.title.toLowerCase() === subjectLower) {
    score += 50;
  }
  // Title contains subject: +30
  else if (quiz.title.toLowerCase().includes(subjectLower)) {
    score += 30;
  }
  // Subject contains title: +20
  else if (subjectLower.includes(quiz.title.toLowerCase())) {
    score += 20;
  }

  // Description match: +15
  if (quiz.description && quiz.description.toLowerCase().includes(subjectLower)) {
    score += 15;
  }

  // Tag matches: +10 per tag (max 30)
  if (quiz.tags) {
    const matchingTags = quiz.tags.filter(tag =>
      tag.toLowerCase().includes(subjectLower) ||
      subjectLower.includes(tag.toLowerCase())
    );
    score += Math.min(matchingTags.length * 10, 30);
  }

  // Question tag matches: +5 per unique tag (max 20)
  const questionTags = new Set(
    quiz.questions
      .flatMap(q => q.tags || [])
      .filter(tag =>
        tag.toLowerCase().includes(subjectLower) ||
        subjectLower.includes(tag.toLowerCase())
      )
  );
  score += Math.min(questionTags.size * 5, 20);

  // Keyword matches: +5 per keyword (max 25)
  const titleWords = quiz.title.toLowerCase().split(/\s+/);
  const keywordMatches = keywords.filter(keyword =>
    titleWords.some(word => word.includes(keyword) || keyword.includes(word))
  );
  score += Math.min(keywordMatches.length * 5, 25);

  return Math.min(score, 100);
}

/**
 * Get best matching quizzes for a subject, sorted by relevance
 */
export function getBestMatchingQuizzes(
  quizzes: QuizMetadata[],
  subjectName: string,
  limit: number = 10
): QuizMetadata[] {
  const scored = quizzes
    .map(quiz => ({
      quiz,
      score: scoreQuizMatch(quiz, subjectName),
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(item => item.quiz);
}

/**
 * Extract keywords from subject name
 */
function extractKeywords(subjectName: string): string[] {
  const commonWords = [
    'and', 'or', 'the', 'of', 'in', 'to', 'for', 'a', 'an',
    'with', 'on', 'at', 'by', 'from', 'as', 'is', 'was', 'are',
  ];

  return subjectName
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));
}

/**
 * Suggest quiz topics for a subject
 */
export function suggestQuizTopics(subjectName: string): string[] {
  const suggestions: Record<string, string[]> = {
    'personality': [
      'Freud', 'Jung', 'Psychoanalytic', 'Trait Theory', 'Humanistic',
      'Behavioral', 'Cognitive', 'Social Learning', 'Big Five',
    ],
    'abnormal': [
      'DSM-5', 'Anxiety Disorders', 'Mood Disorders', 'Schizophrenia',
      'Personality Disorders', 'Psychopathology', 'Mental Health',
    ],
    'assessment': [
      'Psychological Testing', 'IQ Tests', 'Personality Assessment',
      'Projective Tests', 'MMPI', 'Rorschach', 'Psychometrics',
    ],
    'industrial': [
      'Organizational Behavior', 'Leadership', 'Motivation',
      'Job Analysis', 'Performance Appraisal', 'Training',
    ],
    'developmental': [
      'Piaget', 'Erikson', 'Child Development', 'Adolescence',
      'Lifespan', 'Cognitive Development', 'Social Development',
    ],
    'cognitive': [
      'Memory', 'Attention', 'Perception', 'Problem Solving',
      'Decision Making', 'Language', 'Intelligence',
    ],
    'social': [
      'Attitudes', 'Persuasion', 'Group Dynamics', 'Conformity',
      'Prejudice', 'Aggression', 'Prosocial Behavior',
    ],
  };

  const subjectLower = subjectName.toLowerCase();
  
  for (const [key, topics] of Object.entries(suggestions)) {
    if (subjectLower.includes(key)) {
      return topics;
    }
  }

  return [];
}
