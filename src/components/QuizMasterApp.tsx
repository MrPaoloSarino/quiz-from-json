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
import { aiService, AIProvider } from '@/utils/aiService';
import { ArrowLeft, User, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import SettingsPage from '@/pages/Settings';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import Flashcards from '@/pages/Flashcards';

type AppView = 'dashboard' | 'quiz' | 'create' | 'profile' | 'settings' | 'flashcards';

const providerModels = {
  openrouter: [
    { value: 'deepseek-chat-v3', label: 'deepseek-chat-v3' },
    { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
    { value: 'gpt-4', label: 'gpt-4' }
  ],
  openai: [
    { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
    { value: 'gpt-4', label: 'gpt-4' }
  ],
  gemini: [
    // Gemini 2.5 Models
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-flash-lite-preview-06-17', label: 'Gemini 2.5 Flash Lite' },
    { value: 'gemini-2.5-flash-preview-native-audio-dialog', label: 'Gemini 2.5 Flash Audio Dialog' },
    { value: 'gemini-2.5-flash-exp-native-audio-thinking-dialog', label: 'Gemini 2.5 Flash Audio Thinking' },
    { value: 'gemini-2.5-flash-preview-tts', label: 'Gemini 2.5 Flash TTS' },
    { value: 'gemini-2.5-pro-preview-tts', label: 'Gemini 2.5 Pro TTS' },
    
    // Gemini 2.0 Models
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { value: 'gemini-2.0-flash-preview-image-generation', label: 'Gemini 2.0 Flash Image Gen' },
    { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
    { value: 'gemini-2.0-flash-live-001', label: 'Gemini 2.0 Flash Live' },
    
    // Gemini 1.5 Models
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-1.5-pro-vision', label: 'Gemini 1.5 Pro Vision' },
    { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro Latest' },
    
    // Gemini 1.0 Models
    { value: 'gemini-pro', label: 'Gemini 1.0 Pro' },
    { value: 'gemini-pro-vision', label: 'Gemini 1.0 Pro Vision' },
    
    // Specialized Models
    { value: 'gemini-embedding-exp', label: 'Gemini Embedding Exp' },
    { value: 'gemini-live-2.5-flash-preview', label: 'Gemini Live 2.5 Flash' },
    
    // Imagen Models
    { value: 'imagen-4.0-generate-preview-06-06', label: 'Imagen 4.0' },
    { value: 'imagen-4.0-ultra-generate-preview-06-06', label: 'Imagen 4.0 Ultra' },
    { value: 'imagen-3.0-generate-002', label: 'Imagen 3.0' },
    
    // Veo Models
    { value: 'veo-2.0-generate-001', label: 'Veo 2.0' },
  ]
};

const CerebrumApp: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dashboardRef = useRef<{ refreshQuizzes: () => void }>(null);
  const [apiModalOpen, setApiModalOpen] = React.useState(false);
  const [globalProvider, setGlobalProvider] = React.useState<AIProvider>('openrouter');
  const [globalApiKey, setGlobalApiKey] = React.useState('');
  const [globalModel, setGlobalModel] = React.useState('deepseek-chat-v3');

  // Enhanced state tracking with useEffect
  useEffect(() => {
    console.log(' [STATE] currentQuiz state changed:', currentQuiz);
    console.log(' [STATE] currentQuiz length:', currentQuiz?.length || 'null/undefined');
    console.log(' [STATE] Stack trace:', new Error().stack);
  }, [currentQuiz]);

  useEffect(() => {
    console.log(' [STATE] currentView state changed:', currentView);
    // If we're returning to dashboard, refresh the quiz list
    if (currentView === 'dashboard') {
      console.log(' [DEBUG] Back to dashboard, refreshing quizzes...');
      dashboardRef.current?.refreshQuizzes();
    }
  }, [currentView]);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    const handler = () => setApiModalOpen(true);
    window.addEventListener('open-ai-api-setup', handler);
    return () => window.removeEventListener('open-ai-api-setup', handler);
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
      console.log(` Cerebrum initialized in ${modeText}`);
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
    console.log(' [DEBUG] CerebrumApp.handleStartQuiz called');
    console.log(' [DEBUG] Received questions:', questions);
    console.log(' [DEBUG] Questions count:', questions.length);
    console.log(' [DEBUG] Current view before:', currentView);
    console.log(' [DEBUG] Current quiz before:', currentQuiz);
    
    // Use React's batched state updates
    React.startTransition(() => {
      setCurrentQuiz(questions);
      setCurrentView('quiz');
    });
    
    console.log(' [DEBUG] State updates batched and dispatched');
  };

  const handleCreateQuiz = () => {
    console.log(' [DEBUG] CerebrumApp.handleCreateQuiz called');
    console.log(' [DEBUG] Current view before:', currentView);
    setCurrentView('create');
    console.log(' [DEBUG] setCurrentView("create") called');
  };

  const handleBackToDashboard = () => {
    console.log(' [DEBUG] handleBackToDashboard called');
    console.log(' [DEBUG] Current view before:', currentView);
    console.log(' [DEBUG] Current quiz before:', currentQuiz);
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

  const handleViewSettings = () => {
    setCurrentView('settings');
  };

  const handleViewFlashcards = () => {
    setCurrentView('flashcards');
  };

  React.useEffect(() => {
    const settingsStr = localStorage.getItem('ai_settings');
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        if (settings.provider) setGlobalProvider(settings.provider);
        if (settings.apiKey) setGlobalApiKey(settings.apiKey);
        if (settings.model) setGlobalModel(settings.model);
      } catch (e) {
        console.error("Failed to parse AI settings from localStorage", e);
      }
    }
  }, []);

  const handleSaveApiSettings = async () => {
    try {
      await aiService.updateSettings(globalProvider, globalApiKey, globalModel);
      setApiModalOpen(false);
      toast.success('API settings saved!');
    } catch (error) {
      console.error('Failed to save API settings:', error);
      toast.error(`Failed to save API settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Cerebrum...</p>
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
            {/* Removed Back button for consistent title alignment */}
            <h1 className="text-2xl font-bold text-black">
              Cerebrum
            </h1>
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('dashboard')}
              className="ml-2"
            >
              Quizzes
            </Button>
            <Button
              variant={currentView === 'flashcards' ? 'default' : 'ghost'}
              onClick={handleViewFlashcards}
              className="ml-2"
            >
              Flashcards
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setApiModalOpen(true)}
                    className="flex items-center gap-2"
                    aria-label="AI/API Setup"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:block">AI/API Setup</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Configure your AI provider, API key, and model for quiz generation and feedback.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user.name.split(' ')[0]}!</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleViewProfile}
              className="flex items-center gap-2 hover:bg-black/70 hover:text-white"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">Profile</span>
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={apiModalOpen} onOpenChange={setApiModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI/API Setup</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm font-medium">Provider</label>
            <select
              value={globalProvider}
              onChange={e => {
                setGlobalProvider(e.target.value);
                // Set default model for provider
                const models = providerModels[e.target.value as keyof typeof providerModels];
                if (models && models.length > 0) setGlobalModel(models[0].value);
              }}
              className="w-full border rounded p-2"
            >
              <option value="openrouter">OpenRouter</option>
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
            </select>
            <label className="block text-sm font-medium">API Key</label>
            <Input
              value={globalApiKey}
              onChange={e => setGlobalApiKey(e.target.value)}
              placeholder={`Enter your ${globalProvider} API key`}
              type="password"
            />
            <label className="block text-sm font-medium">Model</label>
            <select
              value={globalModel}
              onChange={e => setGlobalModel(e.target.value)}
              className="w-full border rounded p-2"
            >
              {providerModels[globalProvider as keyof typeof providerModels].map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveApiSettings} className="bg-blue-600 text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
      
      case 'settings':
        console.log('🖥️ [DEBUG] Rendering settings view');
        return <SettingsPage />;
      
      case 'flashcards':
        console.log('��️ [DEBUG] Rendering flashcards view');
        return <Flashcards />;
      
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

export default CerebrumApp;