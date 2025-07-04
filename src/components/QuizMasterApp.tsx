import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '@/types/user';
import { QuizQuestion } from '@/types/quiz';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import UserProfileComponent from '@/components/auth/UserProfile';
import Quiz from '@/components/quiz/Quiz';
import JsonInput from '@/components/quiz/JsonInput';
import QuizDashboard from '@/components/dashboard/QuizDashboard';
import StorageManager from '@/utils/storageManager';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Plus, BookOpen, Cloud, HardDrive } from 'lucide-react';

type AppView = 'dashboard' | 'quiz' | 'create' | 'profile';

const QuizMasterApp: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dashboardRef = useRef<{ refreshQuizzes: () => void }>(null);

  // Enhanced state tracking with useEffect
  useEffect(() => {
    console.log('🔄 [STATE] currentQuiz state changed:', currentQuiz);
    console.log('🔄 [STATE] currentQuiz length:', currentQuiz?.length || 'null/undefined');
    console.log('🔄 [STATE] Stack trace:', new Error().stack);
  }, [currentQuiz]);

  useEffect(() => {
    console.log('🔄 [STATE] currentView state changed:', currentView);
    // If we're returning to dashboard, refresh the quiz list
    if (currentView === 'dashboard') {
      console.log('🔄 [DEBUG] Back to dashboard, refreshing quizzes...');
      dashboardRef.current?.refreshQuizzes();
    }
  }, [currentView]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // StorageManager auto-initializes based on environment configuration
      const isSignedIn = await StorageManager.isSignedIn();
      if (isSignedIn) {
        const currentUser = await StorageManager.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      }
      
      // Show storage mode info
      const storageInfo = StorageManager.getStorageInfo();
      const modeText = storageInfo.mode === 'local_storage' ? 'Offline Mode' : 'Cloud Mode';
      console.log(`🚀 QuizMaster initialized in ${modeText}`);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      toast.error('Failed to initialize application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (signedInUser: UserProfile) => {
    setUser(signedInUser);
    setCurrentView('dashboard');
    
    const storageInfo = StorageManager.getStorageInfo();
    const modeText = storageInfo.mode === 'local_storage' ? 'offline mode' : 'cloud mode';
    toast.success(`Welcome! Running in ${modeText}`);
  };

  const handleSignOut = async () => {
    try {
      await StorageManager.signOut();
      setUser(null);
      setCurrentView('dashboard');
      setCurrentQuiz(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  const handleStartQuiz = (questions: QuizQuestion[]) => {
    console.log('🎯 [DEBUG] QuizMasterApp.handleStartQuiz called');
    console.log('🎯 [DEBUG] Received questions:', questions);
    console.log('🎯 [DEBUG] Questions count:', questions.length);
    console.log('🎯 [DEBUG] Current view before:', currentView);
    console.log('🎯 [DEBUG] Current quiz before:', currentQuiz);
    
    // Use React's batched state updates
    React.startTransition(() => {
      setCurrentQuiz(questions);
      setCurrentView('quiz');
    });
    
    console.log('🎯 [DEBUG] State updates batched and dispatched');
  };

  const handleCreateQuiz = () => {
    console.log('📝 [DEBUG] QuizMasterApp.handleCreateQuiz called');
    console.log('📝 [DEBUG] Current view before:', currentView);
    setCurrentView('create');
    console.log('📝 [DEBUG] setCurrentView("create") called');
  };

  const handleQuizCreated = async (questions: QuizQuestion[]) => {
    console.log('✨ [DEBUG] QuizMasterApp.handleQuizCreated called');
    console.log('✨ [DEBUG] Received questions:', questions);
    console.log('✨ [DEBUG] Questions count:', questions.length);
    console.log('✨ [DEBUG] Current view before:', currentView);
    
    // Reset quiz state and navigate back to dashboard
    setCurrentQuiz(null);
    console.log('✨ [DEBUG] setCurrentQuiz(null) called');
    
    // Navigate back to dashboard and show success message
    setCurrentView('dashboard');
    console.log('✨ [DEBUG] setCurrentView("dashboard") called');
    
    // Give the dashboard a moment to mount before showing success message
    setTimeout(() => {
      toast.success('Quiz created successfully! 🎉');
      console.log('✨ [DEBUG] Success toast shown');
    }, 100);
  };

  const handleBackToDashboard = () => {
    console.log('🔙 [DEBUG] handleBackToDashboard called');
    console.log('🔙 [DEBUG] Current view before:', currentView);
    console.log('🔙 [DEBUG] Current quiz before:', currentQuiz);
    
    // Use React's batched state updates
    React.startTransition(() => {
      setCurrentQuiz(null);
      setCurrentView('dashboard');
    });
    
    console.log('🔙 [DEBUG] Back to dashboard - state updates dispatched');
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

  // Replace the placeholder dashboard with the actual QuizDashboard component
  const renderDashboard = () => {
    console.log('📊 [DEBUG] Rendering QuizDashboard component');
    return (
      <QuizDashboard
        ref={dashboardRef}
        onStartQuiz={handleStartQuiz}
        onCreateQuiz={handleCreateQuiz}
      />
    );
  };

  // Render current view
  const renderCurrentView = () => {
    console.log('🖥️ [DEBUG] renderCurrentView called');
    console.log('🖥️ [DEBUG] Current view:', currentView);
    console.log('🖥️ [DEBUG] Current quiz:', currentQuiz);
    console.log('🖥️ [DEBUG] Quiz length:', currentQuiz?.length || 'null/undefined');
    
    switch (currentView) {
      case 'dashboard':
        console.log('📊 [DEBUG] Rendering QuizDashboard component');
        return renderDashboard();
      
      case 'quiz':
        console.log('🖥️ [DEBUG] Rendering quiz view');
        console.log('🖥️ [DEBUG] currentQuiz exists:', !!currentQuiz);
        console.log('🖥️ [DEBUG] Passing questions to Quiz component:', currentQuiz?.length || 'null/undefined');
        return currentQuiz ? (
          <div className="container mx-auto p-4">
            <Quiz questions={currentQuiz} />
          </div>
        ) : (
          <div className="container mx-auto p-4 text-center">
            <p className="text-gray-500">No quiz selected</p>
          </div>
        );
      
      case 'create':
        console.log('🖥️ [DEBUG] Rendering create view');
        console.log('🖥️ [DEBUG] handleStartQuiz function:', typeof handleStartQuiz);
        return (
          <div className="container mx-auto p-4">
            <JsonInput onQuizStart={handleStartQuiz} />
          </div>
        );
      
      case 'profile':
        console.log('🖥️ [DEBUG] Rendering profile view');
        return (
          <div className="container mx-auto p-4 flex justify-center">
            <UserProfileComponent onSignOut={handleSignOut} />
          </div>
        );
      
      default:
        console.error('🖥️ [DEBUG] Unknown view:', currentView);
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