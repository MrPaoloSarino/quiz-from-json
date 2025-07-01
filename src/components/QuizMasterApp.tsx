import React, { useState, useEffect } from 'react';
import { GoogleDriveUserStorage, UserProfile } from '@/utils/googleDriveStorage';
import { QuizQuestion } from '@/types/quiz';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import UserProfileComponent from '@/components/auth/UserProfile';
import Quiz from '@/components/quiz/Quiz';
import JsonInput from '@/components/quiz/JsonInput';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Plus, BookOpen } from 'lucide-react';

type AppView = 'dashboard' | 'quiz' | 'create' | 'profile';

const QuizMasterApp: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const initialized = await GoogleDriveUserStorage.initializeGoogleClient();
      if (initialized && GoogleDriveUserStorage.isSignedIn()) {
        const currentUser = GoogleDriveUserStorage.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      toast.error('Failed to initialize application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = (signedInUser: UserProfile) => {
    setUser(signedInUser);
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentView('dashboard');
    setCurrentQuiz(null);
  };

  const handleStartQuiz = (questions: QuizQuestion[]) => {
    setCurrentQuiz(questions);
    setCurrentView('quiz');
  };

  const handleCreateQuiz = () => {
    setCurrentView('create');
  };

  const handleQuizCreated = (questions: QuizQuestion[]) => {
    setCurrentView('dashboard');
    toast.success('Quiz created successfully! 🎉');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentQuiz(null);
  };

  const handleViewProfile = () => {
    setCurrentView('profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing QuizMaster AI...</p>
        </div>
      </div>
    );
  }

  // Show sign-in page if user is not authenticated
  if (!user) {
    return <GoogleSignIn onSignIn={handleSignIn} />;
  }

  // Main app navigation bar
  const renderNavBar = () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentView !== 'dashboard' && (
              <Button 
                variant="ghost" 
                onClick={handleBackToDashboard}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              QuizMaster AI
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user.name.split(' ')[0]}!</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleViewProfile}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Simple dashboard for now
  const renderDashboard = () => (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to QuizMaster AI</h2>
        <p className="text-gray-600 mb-8">Create, manage, and take quizzes with AI-powered insights</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleCreateQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Create New Quiz
          </Button>
        </div>
      </div>
      
      <div className="text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Your quizzes will appear here once you create them</p>
      </div>
    </div>
  );

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      
      case 'quiz':
        return currentQuiz ? (
          <div className="container mx-auto p-4">
            <Quiz />
          </div>
        ) : (
          <div className="container mx-auto p-4 text-center">
            <p className="text-gray-500">No quiz selected</p>
          </div>
        );
      
      case 'create':
        return (
          <div className="container mx-auto p-4">
            <JsonInput onQuizStart={handleQuizCreated} />
          </div>
        );
      
      case 'profile':
        return (
          <div className="container mx-auto p-4 flex justify-center">
            <UserProfileComponent onSignOut={handleSignOut} />
          </div>
        );
      
      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavBar()}
      <main className="py-6">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default QuizMasterApp; 