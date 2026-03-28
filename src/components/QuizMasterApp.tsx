import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import { aiService } from '@/utils/aiService';
import { AIProvider } from '@/utils/aiConfig';
import { User, Settings, ShoppingBag, PlayCircle, FolderKanban } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import SettingsPage from '@/pages/Settings';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import Flashcards from '@/pages/Flashcards';
import Marketplace from './marketplace/Marketplace';
import { MarketplaceItem } from './marketplace/data';
import ProjectsList from '@/pages/ProjectsList';
import ProjectOverview from '@/pages/ProjectOverview';
import CreateProject from '@/pages/CreateProject';
import { initDemoProject } from '@/utils/initDemoProject';

type AppView = 'dashboard' | 'quiz' | 'create' | 'profile' | 'settings' | 'flashcards' | 'marketplace' | 'projects' | 'project-overview' | 'create-project';

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

// Extracted authenticated portion into its own component so that
// parent component can conditionally render <GoogleSignIn/> or loading
// state WITHOUT skipping hooks inside the authenticated experience.
// This resolves the React production error (minified error 310) caused
// by early returns before hook declarations (useMemo etc.).

interface AuthenticatedLayoutProps {
  user: UserProfile;
  currentView: AppView;
  setCurrentView: React.Dispatch<React.SetStateAction<AppView>>;
  currentQuiz: QuizQuestion[] | null;
  dashboardRef: React.RefObject<{ refreshQuizzes: () => void }>;
  handleStartQuiz: (q: QuizQuestion[]) => void;
  handleCreateQuiz: () => void;
  handleSignOut: () => Promise<void>;
  handleBackToDashboard: () => void;
  handleInstallTemplate: (item: MarketplaceItem) => void;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  user,
  currentView,
  setCurrentView,
  currentQuiz,
  dashboardRef,
  handleStartQuiz,
  handleCreateQuiz,
  handleSignOut,
  handleBackToDashboard,
  handleInstallTemplate,
}) => {
  // Local state that is only relevant when authenticated
  const [apiModalOpen, setApiModalOpen] = React.useState(false);
  const [globalProvider, setGlobalProvider] = React.useState<AIProvider>('openrouter');
  const [globalApiKey, setGlobalApiKey] = React.useState('');
  const [globalModel, setGlobalModel] = React.useState('deepseek-chat-v3');

  // Load AI settings
  useEffect(() => {
    const settingsStr = localStorage.getItem('ai_settings');
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        if (settings.provider) setGlobalProvider(settings.provider);
        if (settings.apiKey) setGlobalApiKey(settings.apiKey);
        if (settings.model) setGlobalModel(settings.model);
      } catch (e) {
        console.error('Failed to parse AI settings from localStorage', e);
      }
    }
  }, []);

  const handleSaveApiSettings = useCallback(async () => {
    try {
      await aiService.updateSettings(globalProvider, globalApiKey, globalModel);
      setApiModalOpen(false);
      toast.success('API settings saved!');
    } catch (error) {
      console.error('Failed to save API settings:', error);
      toast.error(`Failed to save API settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [globalProvider, globalApiKey, globalModel]);

  const handleViewFlashcards = useCallback(() => setCurrentView('flashcards'), [setCurrentView]);
  const handleViewProfile = useCallback(() => setCurrentView('profile'), [setCurrentView]);
  const handleViewMarketplace = useCallback(() => setCurrentView('marketplace'), [setCurrentView]);
  const handleViewProjects = useCallback(() => setCurrentView('projects'), [setCurrentView]);

  const userFirstName = user.name?.split(' ')[0] ?? 'User';

  const renderNavBar = useMemo(() => (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/icon (1).svg" alt="Cerebrum Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-black">Cerebrum</h1>
            </div>
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('dashboard')}
              className="ml-2"
            >
              Quizzes
            </Button>
            <Button
              variant={currentView === 'projects' || currentView === 'project-overview' || currentView === 'create-project' ? 'default' : 'ghost'}
              onClick={handleViewProjects}
              className="ml-2 flex items-center gap-1"
            >
              <FolderKanban className="w-4 h-4" />
              Projects
            </Button>
            {currentQuiz && currentView !== 'quiz' && (
              <Button
                variant="default"
                onClick={() => setCurrentView('quiz')}
                className="ml-2 flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white animate-pulse"
              >
                <PlayCircle className="w-4 h-4" />
                Resume Quiz
              </Button>
            )}
            <Button variant={currentView === 'flashcards' ? 'default' : 'ghost'} onClick={handleViewFlashcards} className="ml-2">Flashcards</Button>
            <Button variant={currentView === 'marketplace' ? 'default' : 'ghost'} onClick={handleViewMarketplace} className="ml-2 flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              Marketplace
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
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, {userFirstName}!</span>
            <Button variant="ghost" size="sm" onClick={handleViewProfile} className="flex items-center gap-2 hover:bg-black/70 hover:text-white">
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
                setGlobalProvider(e.target.value as AIProvider);
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
  ), [currentView, currentQuiz, userFirstName, apiModalOpen, globalProvider, globalApiKey, globalModel, handleViewProfile, handleViewFlashcards, handleViewMarketplace, handleSaveApiSettings, setCurrentView]);

  const renderDashboard = useMemo(() => (
    <QuizDashboard ref={dashboardRef} onStartQuiz={handleStartQuiz} onCreateQuiz={handleCreateQuiz} />
  ), [handleStartQuiz, handleCreateQuiz]);

  // Non-persistent views rendered conditionally
  const renderActiveView = useMemo(() => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard;
      case 'create':
        return <div className="container mx-auto p-4"><JsonInput onQuizStart={handleStartQuiz} /></div>;
      case 'profile':
        return <div className="container mx-auto p-4 flex justify-center"><UserProfileComponent onSignOut={handleSignOut} /></div>;
      case 'settings':
        return <SettingsPage />;
      case 'projects':
        return (
          <ProjectsList
            onCreateProject={() => setCurrentView('create-project')}
            onViewProject={(projectId) => {
              setCurrentView('project-overview');
              // Store selected project ID for ProjectOverview
              sessionStorage.setItem('selected_project_id', projectId);
            }}
          />
        );
      case 'create-project':
        return (
          <CreateProject
            onProjectCreated={(projectId) => {
              setCurrentView('project-overview');
              sessionStorage.setItem('selected_project_id', projectId);
            }}
            onCancel={() => setCurrentView('projects')}
          />
        );
      case 'project-overview':
        return (
          <ProjectOverview
            projectId={sessionStorage.getItem('selected_project_id') || undefined}
            onStartQuiz={(subjectId) => {
              // TODO: Start quiz for specific subject
              console.log('Start quiz for subject:', subjectId);
            }}
          />
        );
      case 'quiz':
      case 'flashcards':
      case 'marketplace':
        // These are rendered persistently below via display toggling
        return null;
      default:
        return <div>Unknown view</div>;
    }
  }, [currentView, renderDashboard, handleStartQuiz, handleSignOut]);

  // Refresh quizzes when returning to dashboard
  useEffect(() => {
    if (currentView === 'dashboard') {
      dashboardRef.current?.refreshQuizzes();
    }
  }, [currentView]);

  // Track whether persistent views have been visited at least once
  const [mountedViews, setMountedViews] = React.useState<Set<string>>(new Set());
  useEffect(() => {
    if (['quiz', 'flashcards', 'marketplace', 'projects', 'project-overview', 'create-project'].includes(currentView)) {
      setMountedViews(prev => {
        if (prev.has(currentView)) return prev;
        const next = new Set(prev);
        next.add(currentView);
        return next;
      });
    }
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavBar}
      <main className="py-6">
        {/* Non-persistent views */}
        {renderActiveView}

        {/* Persistent quiz view – stays mounted so state is preserved */}
        {currentQuiz && (mountedViews.has('quiz') || currentView === 'quiz') && (
          <div style={{ display: currentView === 'quiz' ? 'block' : 'none' }}>
            <div className="container mx-auto p-4"><Quiz questions={currentQuiz} /></div>
          </div>
        )}
        {!currentQuiz && currentView === 'quiz' && (
          <div className="container mx-auto p-4 text-center"><p className="text-gray-500">No quiz selected</p></div>
        )}

        {/* Persistent flashcards view */}
        {(mountedViews.has('flashcards') || currentView === 'flashcards') && (
          <div style={{ display: currentView === 'flashcards' ? 'block' : 'none' }}>
            <Flashcards />
          </div>
        )}

        {/* Persistent marketplace view */}
        {(mountedViews.has('marketplace') || currentView === 'marketplace') && (
          <div style={{ display: currentView === 'marketplace' ? 'block' : 'none' }}>
            <Marketplace onInstall={handleInstallTemplate} />
          </div>
        )}
      </main>
    </div>
  );
};

const CerebrumApp: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dashboardRef = useRef<{ refreshQuizzes: () => void }>(null);

  // Consolidated initialization useEffect
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
          
          // Initialize demo project if none exist (only in development)
          if (import.meta.env.DEV) {
            try {
              initDemoProject();
            } catch (error) {
              console.error('Failed to initialize demo project:', error);
            }
          }
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

  const handleStartQuiz = useCallback((questions: QuizQuestion[]) => {
    setCurrentQuiz(questions);
    setCurrentView('quiz');
  }, []);

  const handleCreateQuiz = useCallback(() => {
    setCurrentView('create');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setCurrentQuiz(null);
    setCurrentView('dashboard');
  }, []);

  const handleInstallTemplate = useCallback(async (item: MarketplaceItem) => {
    try {
      await StorageManager.importLegacyQuiz(item.title, item.content, item.description);
      toast.success(`Template "${item.title}" added to your quizzes!`);
      setCurrentView('dashboard');
      // Refresh handled by effect on currentView change
    } catch (error) {
      console.error('Failed to install template:', error);
      toast.error('Failed to save template to your library.');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/icon (1).svg" alt="Cerebrum Logo" className="w-8 h-8" />
            <p className="text-gray-600 text-lg font-medium">Initializing Cerebrum...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <GoogleSignIn onSignIn={handleSignIn} />;
  }

  return (
    <AuthenticatedLayout
      user={user}
      currentView={currentView}
      setCurrentView={setCurrentView}
      currentQuiz={currentQuiz}
      dashboardRef={dashboardRef}
      handleStartQuiz={handleStartQuiz}
      handleCreateQuiz={handleCreateQuiz}
      handleSignOut={handleSignOut}
      handleBackToDashboard={handleBackToDashboard}
      handleInstallTemplate={handleInstallTemplate}
    />
  );
};

export default CerebrumApp;