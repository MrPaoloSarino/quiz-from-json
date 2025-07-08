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
  debugLogger.log('StorageManager.importLegacyQuiz called');
  debugLogger.log('Parameters:', {
    title,
    questionsCount: questions.length,
    description,
    isCloudMode
  });
  debugLogger.log('Questions:', questions);

  try {
    let result: string;
    if (isCloudMode) {
      debugLogger.log('Using cloud storage (GoogleDriveUserStorage)');
      result = await GoogleDriveUserStorage.importLegacyQuiz(title, questions, description);
      debugLogger.log('Cloud storage result:', result);
    } else {
      debugLogger.log('Using local storage (LocalStorageBackup)');
      result = await LocalStorageBackup.importLegacyQuiz(title, questions, description);
      debugLogger.log('Local storage result:', result);
    }
    debugLogger.log('StorageManager.importLegacyQuiz completed successfully');
    return result;
  } catch (error) {
    debugLogger.error('StorageManager.importLegacyQuiz error:', error);
    debugLogger.log('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack available',
      type: typeof error,
      isCloudMode
    });
    if (isCloudMode) {
      debugLogger.log('Attempting fallback to local storage...');
      try {
        const fallbackResult = await LocalStorageBackup.importLegacyQuiz(title, questions, description);
        debugLogger.log('Fallback to local storage successful:', fallbackResult);
        return fallbackResult;
      } catch (fallbackError) {
        debugLogger.error('Fallback to local storage also failed:', fallbackError);
        throw fallbackError;
      }
    }
    throw error;
  }
} 