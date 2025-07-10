// LEGACY CODE: This module supports import of legacy quiz formats for backward compatibility.
// TODO: Review and refactor or remove this code if legacy support is no longer required.
// Maintenance: Minimal. Only update if breaking changes occur in storage APIs.
import { GoogleDriveUserStorage } from './googleDriveStorage';
import LocalStorageBackup from './localStorageBackup';
import { QuizQuestion } from '@/types/quiz';
import debugLogger from './debugLogger';

export async function importLegacyQuiz(
  isCloudMode: boolean,
  title: string,
  questions: QuizQuestion[],
  description?: string
): Promise<string> {
  if (process.env.NODE_ENV === 'development') {
    debugLogger.log('StorageManager.importLegacyQuiz called');
    debugLogger.log('Parameters:', {
      title,
      questionsCount: questions.length,
      description,
      isCloudMode
    });
    debugLogger.log('Questions:', questions);
  }

  try {
    let result: string;
    if (isCloudMode) {
      if (process.env.NODE_ENV === 'development') debugLogger.log('Using cloud storage (GoogleDriveUserStorage)');
      result = await GoogleDriveUserStorage.importLegacyQuiz(title, questions, description);
      if (process.env.NODE_ENV === 'development') debugLogger.log('Cloud storage result:', result);
    } else {
      if (process.env.NODE_ENV === 'development') debugLogger.log('Using local storage (LocalStorageBackup)');
      result = await LocalStorageBackup.importLegacyQuiz(title, questions, description);
      if (process.env.NODE_ENV === 'development') debugLogger.log('Local storage result:', result);
    }
    if (process.env.NODE_ENV === 'development') debugLogger.log('StorageManager.importLegacyQuiz completed successfully');
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      debugLogger.error('StorageManager.importLegacyQuiz error:', error);
      debugLogger.log('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack available',
        type: typeof error,
        isCloudMode
      });
    }
    if (isCloudMode) {
      if (process.env.NODE_ENV === 'development') debugLogger.log('Attempting fallback to local storage...');
      try {
        const fallbackResult = await LocalStorageBackup.importLegacyQuiz(title, questions, description);
        if (process.env.NODE_ENV === 'development') debugLogger.log('Fallback to local storage successful:', fallbackResult);
        return fallbackResult;
      } catch (fallbackError) {
        if (process.env.NODE_ENV === 'development') debugLogger.error('Fallback to local storage also failed:', fallbackError);
        throw fallbackError;
      }
    }
    throw error;
  }
} 