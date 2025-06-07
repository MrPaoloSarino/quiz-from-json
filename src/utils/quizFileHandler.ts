import { QuizQuestion } from '@/types/quiz';

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