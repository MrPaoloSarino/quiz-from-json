import React, { useState, useEffect, Component, ErrorInfo } from "react";
import JsonInput from "./JsonInput";
import QuizCard from "./QuizCard";
import QuizResults from "./QuizResults";
import AiFeedback from "./AiFeedback";
import QuestionFeedback from "./QuestionFeedback";
import AIExplainer from "./AIExplainer";
import { QuizQuestion, QuizState, GeminiResponse } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Brain } from "lucide-react";
import { playSound } from '@/utils/soundEffects';
import SoundControls from './SoundControls';
import { secureStorage } from '@/utils/secureStorage';
import { sanitizeMarkdown, sanitizeJson, validateContentLength } from '@/utils/sanitize';
import { loadResource, verifyResourceIntegrity } from '@/utils/secureResources';
import { QuizSession, EnhancedQuizQuestion } from '@/types/user';
import StorageManager from '@/utils/storageManager';
import {
  calculateNextReview,
  updateLearningAnalytics,
  generateActiveRecallPrompts,
  getInterleavedQuestions,
  initializeSpacedRepetition,
  initializeLearningAnalytics
} from '@/utils/quizFileHandler';
import { Debug, debugSpacedRepetition, debugActiveRecall, debugInterleaving, debugAnalytics, debugSession, debugError } from '@/utils/debug';
import ActiveRecallPrompt from './ActiveRecallPrompt';
import { useLearning } from '@/contexts/LearningContext';
import { generateFeedback } from '@/utils/learningEngine';
import aiService from '@/utils/aiService';

const API_URLS = {
  OPENROUTER: "https://openrouter.ai/api/v1/chat/completions",
  OPENROUTER_MODELS: "https://openrouter.ai/api/v1/models",
  OPENAI: "https://api.openai.com/v1/chat/completions",
  GEMINI_BASE: "https://generativelanguage.googleapis.com/v1beta/models"
} as const;

const DEFAULT_MODELS = {
  OPENROUTER: "deepseek/deepseek-chat-v3-0324:free",
  OPENAI: "gpt-3.5-turbo",
  GEMINI: "gemini-pro"
} as const;

const RATE_LIMIT = {
  TIME_WINDOW: 60000, // 1 minute
  MAX_CALLS: 10
} as const;

// Simple encryption for localStorage (not for high-security applications)
const encryptData = (data: string, salt: string = 'quiz-app'): string => {
  return btoa(data + salt);
};

const decryptData = (encryptedData: string, salt: string = 'quiz-app'): string => {
  try {
    const decoded = atob(encryptedData);
    if (decoded.endsWith(salt)) {
      return decoded.substring(0, decoded.length - salt.length);
    }
    return '';
  } catch (e) {
    return '';
  }
};

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "deepseek/deepseek-chat-v3-0324:free";

// Helper functions for session analytics
const calculateSessionDifficulty = (questions: EnhancedQuizQuestion[]): string => {
  const avgDifficulty = questions.reduce((sum, q) => {
    switch (q.difficulty) {
      case 'easy': return sum + 1;
      case 'medium': return sum + 2;
      case 'hard': return sum + 3;
      default: return sum + 2;
    }
  }, 0) / questions.length;
  
  if (avgDifficulty <= 1.5) return 'easy';
  if (avgDifficulty <= 2.5) return 'medium';
  return 'hard';
};

const getSessionTags = (questions: EnhancedQuizQuestion[]): string[] => {
  const tags = new Set<string>();
  questions.forEach(q => q.tags?.forEach(tag => tags.add(tag)));
  return Array.from(tags);
};

const calculateAverageSpacing = (questions: EnhancedQuizQuestion[]): number => {
  const intervals = questions.map(q => q.spacedRepetition.interval);
  return intervals.reduce((a, b) => a + b, 0) / intervals.length;
};

const calculateActiveRecallSuccess = (questions: EnhancedQuizQuestion[]): number => {
  const successes = questions.filter(q => q.analytics.lastRecallSuccess).length;
  return (successes / questions.length) * 100;
};

const countElaborations = (questions: EnhancedQuizQuestion[]): number => {
  return questions.reduce((sum, q) => sum + (q.elaborations?.length || 0), 0);
};

const calculateRetentionScore = (questions: EnhancedQuizQuestion[]): number => {
  return questions.reduce((sum, q) => sum + q.analytics.strengthScore, 0) / questions.length;
};

const hasElaborations = (questions: EnhancedQuizQuestion[]): boolean => {
  return questions.some(q => q.elaborations?.length > 0);
};

const hasFeynmanExplanations = (questions: EnhancedQuizQuestion[]): boolean => {
  return questions.some(q => q.feynmanExplanation);
};

const shouldInterleave = (questions: EnhancedQuizQuestion[], currentTopic: string): boolean => {
  // Interleave if:
  // 1. We have related topics
  // 2. We haven't interleaved recently (at least 2 questions ago)
  // 3. Current performance is good (strength score > 0.7)
  const currentQ = questions.find(q => q.category === currentTopic);
  if (!currentQ) return false;
  
  const hasRelatedTopics = questions.some(q => 
    q.category !== currentTopic && 
    q.analytics.relatedConcepts.includes(currentTopic)
  );
  
  const recentlyInterleaved = questions
    .slice(-2)
    .some(q => q.category !== currentTopic);
  
  return hasRelatedTopics && 
         !recentlyInterleaved && 
         currentQ.analytics.strengthScore > 0.7;
};

const initializeQuizState = (externalQuestions?: QuizQuestion[]): QuizState => {
  if (!externalQuestions || externalQuestions.length === 0) {
    return {
      questions: [],
      currentQuestion: 0,
      score: 0,
      showResults: false,
      userAnswers: [],
      feedback: null,
      essayRatings: [],
      isInterleaved: false,
      startTime: new Date(),
      activeRecallPrompts: [],
      showActiveRecall: false,
      showConfirmation: false,
      lockedAnswers: {}
    };
  }

  const enhancedQuestions: EnhancedQuizQuestion[] = externalQuestions.map((q, index) => {
    // Initialize with proper defaults
    const spacedRepetition = initializeSpacedRepetition();
    const analytics = initializeLearningAnalytics();
    
    return {
      ...q,
      id: `question_${Date.now()}_${index}`,
      difficulty: (q as any).difficulty || 'medium' as const,
      tags: (q as any).tags || [],
      category: (q as any).category || 'general',
      estimatedTime: q.type === 'essay' ? 300 : 60,
      attempts: 0,
      successRate: 0,
      averageTime: 0,
      commonMistakes: [],
      learningObjectives: [],
      spacedRepetition,
      analytics,
      activeRecallPrompts: [],
      elaborations: [],
      feynmanExplanation: undefined,
      isAnswerLocked: false,
      submissionTime: undefined,
      answerHistory: []
    };
  });

  console.log('🚀 [Quiz Init] Enhanced questions with analytics:', enhancedQuestions.map(q => ({
    id: q.id,
    analytics: q.analytics,
    spacedRepetition: q.spacedRepetition
  })));

  return {
    questions: enhancedQuestions,
    currentQuestion: 0,
    score: 0,
    showResults: false,
    userAnswers: Array(enhancedQuestions.length).fill(""),
    feedback: null,
    essayRatings: Array(enhancedQuestions.length).fill(null),
    isInterleaved: false,
    startTime: new Date(),
    activeRecallPrompts: [],
    showActiveRecall: false,
    showConfirmation: false,
    lockedAnswers: {}
  };
};

const Quiz: React.FC<{ questions?: QuizQuestion[] }> = ({ questions: externalQuestions }) => {
  const [state, setState] = useState<QuizState>(() => initializeQuizState(externalQuestions));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(!externalQuestions);
  const [activeRecallPrompts, setActiveRecallPrompts] = useState<string[]>([]);
  const [showActiveRecall, setShowActiveRecall] = useState<boolean>(false);
  const [provider, setProvider] = useState<'openrouter' | 'gemini' | 'openai'>('openrouter');
  const [openRouterKey, setOpenRouterKey] = useState<string>("");
  const [siteUrl, setSiteUrl] = useState<string>("");
  const [siteName, setSiteName] = useState<string>("");
  const [showGeminiInput, setShowGeminiInput] = useState<boolean>(false);
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [quizReadyToStart, setQuizReadyToStart] = useState<boolean>(false);
  const [loadedQuestions, setLoadedQuestions] = useState<QuizQuestion[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [apiCalls, setApiCalls] = useState<number[]>([]);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [modelSearch, setModelSearch] = useState<string>("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [geminiModels, setGeminiModels] = useState<any[]>([]);
  const [selectedGeminiModel, setSelectedGeminiModel] = useState<string>("");
  const [geminiModelSearch, setGeminiModelSearch] = useState<string>("");
  const [showGeminiModelDropdown, setShowGeminiModelDropdown] = useState(false);
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Add AbortController ref for API calls
  const abortControllerRef = React.useRef<AbortController>(new AbortController());

  // Cleanup function for API calls
  const cleanupAPICalls = () => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  // Initialize with external questions if provided
  useEffect(() => {
    try {
      Debug.logSession('Quiz Initialize', {
        startTime: new Date(),
        questions: [],
        userAnswers: [],
        totalScore: 0,
        timeSpent: 0,
        confidenceRatings: [],
        strategiesUsed: {
          activeRecall: false,
          spacedRepetition: false,
          interleaving: false,
          elaboration: false,
          feynmanTechnique: false
        }
      });

      if (externalQuestions && externalQuestions.length > 0) {
        const enhancedQuestions = initializeQuizState(externalQuestions).questions;
        Debug.logAnalytics('Questions Enhanced', {
          strengthScore: 0,
          lastRecallSuccess: false,
          recallAttempts: 0,
          recallSuccesses: 0,
          averageRecallTime: 0,
          lastInterleaved: new Date(),
          relatedConcepts: []
        });

        setState(prevState => ({
          ...prevState,
          questions: enhancedQuestions,
          userAnswers: Array(enhancedQuestions.length).fill(""),
          essayRatings: Array(enhancedQuestions.length).fill(null),
          startTime: new Date(),
          isInterleaved: false,
          activeRecallPrompts: [],
          showActiveRecall: false,
          showConfirmation: false
        }));
        setShowInput(false);
      }
    } catch (error) {
      debugError('Quiz Initialization', error as Error);
    }
  }, [externalQuestions]);

  // Enhanced API key validation with proper error handling
  const validateApiKey = (key: string): boolean => {
    if (!key || typeof key !== 'string') return false;
    const trimmedKey = key.trim();
    
    // Basic format validation
    if (trimmedKey.length < 20) return false;
    
    // Check for common API key patterns
    const validPrefixes = ['sk-', 'pk-', 'api-', 'key-'];
    const hasValidPrefix = validPrefixes.some(prefix => trimmedKey.startsWith(prefix));
    
    // Must have valid prefix and reasonable length
    if (!hasValidPrefix || trimmedKey.length > 200) return false;
    
    // Check for suspicious patterns (all same character, etc.)
    const uniqueChars = new Set(trimmedKey).size;
    if (uniqueChars < 8) return false; // Too few unique characters
    
    // Check for valid characters (alphanumeric, hyphens, underscores)
    const validChars = /^[a-zA-Z0-9\-_]+$/;
    if (!validChars.test(trimmedKey)) return false;
    
    return true;
  };

  // Rate limiting check with error handling
  const isRateLimited = (): boolean => {
    try {
      const now = Date.now();
      // Filter calls made within the rate limit time window
      const recentCalls = apiCalls.filter(timestamp => (now - timestamp) < RATE_LIMIT.TIME_WINDOW);
      
      return recentCalls.length >= RATE_LIMIT.MAX_CALLS;
    } catch (error) {
      console.error('Rate limiting check failed:', error);
      return false; // Fail open to avoid blocking legitimate requests
    }
  };

  // Record API call for rate limiting with error handling
  const recordApiCall = (): void => {
    try {
      const now = Date.now();
      // Keep only recent calls and add the new one
      const recentCalls = apiCalls.filter(timestamp => (now - timestamp) < RATE_LIMIT.TIME_WINDOW);
      setApiCalls([...recentCalls, now]);
    } catch (error) {
      console.error('Failed to record API call:', error);
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Load API keys from AI settings system on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadApiKeys = async () => {
      try {
        // Load all API keys from secure storage
        const openRouterApiKey = await secureStorage.getApiKey('openrouter');
        const geminiApiKey = await secureStorage.getApiKey('gemini');
        const openAIApiKey = await secureStorage.getApiKey('openai');
        
        if (isMounted) {
          setOpenRouterKey(openRouterApiKey || '');
          setGeminiKey(geminiApiKey || '');
          setOpenAIKey(openAIApiKey || '');
          
          // Debug logging
          console.log('🔑 [DEBUG] API Keys loaded:', {
            openRouter: !!openRouterApiKey,
            gemini: !!geminiApiKey,
            openAI: !!openAIApiKey
          });
        }
      } catch (error) {
        console.error('Failed to load API keys:', error);
      }
    };
    
    loadApiKeys();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Secure API key handling
  const handleApiKeyChange = async (key: string, provider: string) => {
    if (!secureStorage.validateApiKey(key, provider)) {
      toast.error('Invalid API key format');
      return;
    }

    try {
      await secureStorage.setApiKey(key, provider);
      toast.success('API key stored securely');
    } catch (error) {
      toast.error('Failed to store API key');
    }
  };

  const prepareQuiz = (questions: QuizQuestion[]) => {
    const enhancedQuestions = initializeQuizState(questions).questions;
    setLoadedQuestions(questions);
    setShowInput(false);
    setState(prevState => ({
      ...prevState,
      questions: enhancedQuestions,
      currentQuestion: 0,
      score: 0,
      showResults: false,
      userAnswers: Array(questions.length).fill(""),
      feedback: null,
      essayRatings: Array(questions.length).fill(null),
      isInterleaved: false,
      startTime: new Date(),
      activeRecallPrompts: [],
      showActiveRecall: false,
      showConfirmation: false
    }));
    setShowGeminiInput(false);
  };

  const randomizeQuestions = () => {
    setState(prevState => {
      const shuffled = [...prevState.questions].sort(() => Math.random() - 0.5);
      return {
        ...prevState,
        questions: shuffled,
        currentQuestion: 0,
        score: 0,
        userAnswers: [],
        showResults: false,
        feedback: null,
        essayRatings: [],
        lockedAnswers: {}
      };
    });
  };
  
  const startQuiz = () => {
    setState(prevState => ({
      ...prevState,
      currentQuestion: 0,
      score: 0,
      userAnswers: [],
      showResults: false,
      feedback: null,
      essayRatings: []
    }));
    // Hide AI configuration modal if it is open
    setShowGeminiInput(false);
  };

  // Add learning context
  const { state: learningState, dispatch: learningDispatch } = useLearning();
  
  // Track question start time
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  
  // Function to update learning state based on answer
  const updateLearningState = (questionId: string, isCorrect: boolean) => {
    const timeSpent = (Date.now() - questionStartTime) / 1000; // in seconds
    const performance = isCorrect ? 1 : 0;
    
    // Update analytics
    learningDispatch({
      type: 'UPDATE_ANALYTICS',
      payload: {
        performance,
        timeSpent
      }
    });
    
    // Update mastery based on performance
    learningDispatch({
      type: 'UPDATE_MASTERY',
      payload: {
        accuracy: performance,
        speed: timeSpent,
        timeSpent
      }
    });
    
    // Update cognitive load
    learningDispatch({
      type: 'UPDATE_COGNITIVE_LOAD',
      payload: {
        timeSpent,
        performance
      }
    });
    
    // Update spaced repetition based on performance
    const spacedRepetitionPerformance = isCorrect 
      ? (timeSpent < 10 ? 'perfect' : 'good') 
      : (timeSpent > 30 ? 'hard' : 'medium');
    
    learningDispatch({
      type: 'UPDATE_SPACED_REPETITION',
      payload: {
        performance: spacedRepetitionPerformance
      }
    });
    
    // Update adaptive settings
    learningDispatch({
      type: 'UPDATE_ADAPTIVE_SETTINGS',
      payload: {
        performance,
        timeSpent,
        confidence: isCorrect ? 5 : 3 // Basic confidence scoring
      }
    });
  };
  
  // Update question start time when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [state.currentQuestion]);

  const handleAnswer = async (selectedOption: string) => {
    const currentQ = state.questions[state.currentQuestion];
    // Check if any AI service is available at the start
    const hasApiKey = await aiService.isApiKeyConfigured();
    console.log('🤖 [DEBUG] AI Service API key check:', hasApiKey);
    // Immediate basic validation
    const isCorrectBasic = selectedOption === currentQ.answer;
    setShowFeedback(true);
    setSelectedOption(selectedOption);
    
    // Lock the answer immediately after submission
    const updatedQuestions = [...state.questions];
    updatedQuestions[state.currentQuestion] = {
      ...currentQ,
      isAnswerLocked: true,
      submissionTime: new Date(),
      answerHistory: [...(currentQ.answerHistory || []), {
        answer: selectedOption,
        isCorrect: isCorrectBasic,
        timestamp: new Date(),
        timeSpent: (Date.now() - questionStartTime) / 1000
      }]
    };
    
    // Update user answers array
    const updatedUserAnswers = [...state.userAnswers];
    updatedUserAnswers[state.currentQuestion] = selectedOption;
    
    // Update score for non-essay questions
    const scoreIncrement = currentQ.type !== 'essay' && isCorrectBasic ? 1 : 0;
    
    setState(prev => ({
      ...prev,
      questions: updatedQuestions,
      userAnswers: updatedUserAnswers,
      score: prev.score + scoreIncrement,
      feedback: {
        correct: isCorrectBasic,
        feedback: isCorrectBasic ? 'Correct! ✅' : 'Checking...',
        explanation: 'Basic validation complete'
      }
    }));

    // Use AI service if available
    if (hasApiKey) {
      try {
        // Use AI service to evaluate the answer
        const aiResult = await aiService.evaluateAnswer(
          currentQ.question,
          selectedOption,
          currentQ.answer
        );
        
        // Update state with AI evaluation
        setState(prev => ({
          ...prev,
          feedback: {
            correct: aiResult.correct,
            feedback: aiResult.feedback,
            explanation: aiResult.explanation || 'No explanation available',
            detailsLink: `/ai-details/${currentQ.id}`
          }
        }));
        
        // For essays, DO NOT auto-proceed. Let the user decide when to move on.
        // Optionally, you can show a message/toast: "You may proceed when ready."
        if (currentQ.type === 'essay') {
          toast.info('You may proceed to the next question when ready.');
        }
      } catch (error) {
      console.error('AI evaluation failed:', error);
      // Fallback to basic validation if AI fails
      setState(prev => ({
        ...prev,
        feedback: {
          correct: isCorrectBasic,
          feedback: isCorrectBasic ? 'Correct! ✅' : 'Incorrect ❌',
          explanation: 'AI evaluation unavailable, using basic validation',
          detailsLink: `/ai-details/${currentQ.id}`
        }
      }));
      
      // For essays without AI, DO NOT auto-proceed. Let the user decide when to move on.
      if (currentQ.type === 'essay' && !hasApiKey) {
        toast.info('No AI configured. You may proceed to the next question when ready.');
      }
    }
    } else {
      // No AI available - immediately proceed for essays, show basic feedback for others
      setState(prev => ({
        ...prev,
        feedback: {
          correct: isCorrectBasic,
          feedback: isCorrectBasic ? 'Correct! ✅' : 'Incorrect ❌',
          explanation: 'Basic validation - no AI feedback available',
          detailsLink: `/ai-details/${currentQ.id}`
        }
      }));
      
      if (currentQ.type === 'essay') {
        toast.info('No AI configured. You may proceed to the next question when ready.');
      } else {
        // For multiple choice, also auto-proceed after brief feedback
        setTimeout(() => {
          if (state.currentQuestion < state.questions.length - 1) {
            setState(prevState => ({
              ...prevState,
              currentQuestion: prevState.currentQuestion + 1,
              feedback: null
            }));
            setSelectedOption(null);
            setShowFeedback(false);
          } else {
            // Finish quiz
            setState(prevState => ({
              ...prevState,
              showResults: true
            }));
          }
        }, 2000); // 2 second delay for multiple choice
      }
    }
    
    // Update learning metrics
    updateLearningState(currentQ.id, isCorrectBasic);
  };

  const handleActiveRecallSubmit = (explanation: string) => {
    console.log('🎯 [DEBUG] Processing active recall submission...');
    const currentQ = state.questions[state.currentQuestion];
    
    // Save the Feynman explanation
    const updatedQuestions = [...state.questions];
    updatedQuestions[state.currentQuestion] = {
      ...currentQ,
      feynmanExplanation: explanation,
      elaborations: [...(currentQ.elaborations || []), explanation]
    };
    
    setState({
      ...state,
      questions: updatedQuestions
    });
    
    setShowActiveRecall(false);
    setShowConfirmation(true);
    
    toast.success("Great job explaining the concept!");
  };

  const moveToNextQuestion = () => {
    if (state.currentQuestion < state.questions.length - 1) {
      // Get interleaved questions if appropriate
      let nextQuestions = [...state.questions];
      const currentTopic = state.questions[state.currentQuestion].category;
      
      if (shouldInterleave(state.questions, currentTopic)) {
        const interleavedQuestions = getInterleavedQuestions(
          state.questions,
          currentTopic,
          2 // Get 2 related questions
        );
        
        if (interleavedQuestions.length > 0) {
          // Insert interleaved questions after current position
          nextQuestions.splice(
            state.currentQuestion + 1,
            0,
            ...interleavedQuestions
          );
          setState({
            ...state,
            questions: nextQuestions,
            isInterleaved: true
          });
        }
      }
      
      setState({
        ...state,
        currentQuestion: state.currentQuestion + 1,
        feedback: null
      });
      setSelectedOption(null);
      setShowFeedback(false);
      setShowConfirmation(false);
      
    } else {
      // Save session data before showing results
      console.log('🏁 [Quiz Complete] Creating session with:', {
        questionsCount: state.questions.length,
        userAnswersCount: state.userAnswers.length,
        score: state.score,
        questionsWithAnalytics: state.questions.filter(q => q.analytics && q.analytics.recallAttempts > 0).length
      });

      const session: QuizSession = {
        id: `session_${Date.now()}`,
        startTime: state.startTime,
        endTime: new Date(),
        questions: state.questions,
        userAnswers: state.questions
          .map((question, index) => {
            const answer = state.userAnswers[index];
            if (!question || !question.id || answer === undefined || answer === "") {
              return null;
            }
            return {
              questionId: question.id,
              answer,
              isCorrect: answer === question.answer,
              timeSpent: question.analytics?.averageRecallTime || 0,
              confidence: 0, // TODO: Add confidence rating
              attempts: 1,
              hintsUsed: 0,
              timestamp: new Date()
            };
          })
          .filter((answerData): answerData is NonNullable<typeof answerData> => answerData !== null),
        confidenceRatings: [],
        totalScore: state.score,
        timeSpent: (Date.now() - state.startTime.getTime()) / 1000,
        difficulty: calculateSessionDifficulty(state.questions),
        tags: getSessionTags(state.questions),
        interleaved: state.isInterleaved,
        spacingInterval: calculateAverageSpacing(state.questions),
        activeRecallSuccess: calculateActiveRecallSuccess(state.questions),
        elaborationCount: countElaborations(state.questions),
        retentionScore: calculateRetentionScore(state.questions),
        strategiesUsed: {
          activeRecall: true,
          spacedRepetition: true,
          interleaving: state.isInterleaved,
          elaboration: hasElaborations(state.questions),
          feynmanTechnique: hasFeynmanExplanations(state.questions)
        }
      };
      
      // Save session
      StorageManager.saveQuizSession(session);
      
      setState({
        ...state,
        showResults: true
      });
    }
  };

  const handleBack = () => {
    if (state.currentQuestion > 0) {
      setState({
        ...state,
        currentQuestion: state.currentQuestion - 1,
        feedback: null
      });
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  // Helper to fetch AI feedback
  const fetchAiFeedback = async (question: EnhancedQuizQuestion, userAnswer: string) => {
    setAiLoading(true);
    setAiError(null);
    setAiFeedback(null);
    try {
      let prompt = '';
      if (question.type === 'essay') {
        prompt = `You are an expert tutor providing detailed feedback on an essay answer.\n\n**Question:** ${question.question}\n**Student's Answer:** ${userAnswer}\n\nPlease provide:\n1. What was done well\n2. Areas for improvement\n3. How to improve next time`;
      } else {
        prompt = `You are an expert tutor explaining a quiz question.\n\n**Question:** ${question.question}\n**Options:** ${question.options?.join(', ')}\n**Correct Answer:** ${question.answer}\n**Student's Answer:** ${userAnswer}\n\nPlease provide:\n1. Why the correct answer is right\n2. Why the student's answer is wrong (if applicable)\n3. Key concept to remember`;
      }
      let response, data, feedbackText = '';
      if (provider === 'openrouter' && openRouterKey) {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
          },
          body: JSON.stringify({
            model: selectedModel || 'deepseek/deepseek-chat-v3-0324:free',
            messages: [
              { role: 'system', content: 'You are an expert educational tutor. Provide clear, structured explanations that help students learn effectively.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 400,
            temperature: 0.7
          })
        });
        data = await response.json();
        feedbackText = data.choices?.[0]?.message?.content || '';
      } else if (provider === 'gemini' && geminiKey) {
        const geminiModelId = (selectedModel || 'gemini-pro').split('/').pop();
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModelId}:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 400, temperature: 0.7 }
          })
        });
        data = await response.json();
        feedbackText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else if (provider === 'openai' && openAIKey) {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are an expert educational tutor. Provide clear, structured explanations that help students learn effectively.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 400,
            temperature: 0.7
          })
        });
        data = await response.json();
        feedbackText = data.choices?.[0]?.message?.content || '';
      } else {
        throw new Error('No valid API key for selected provider');
      }
      if (!feedbackText) throw new Error('AI response missing expected content');
      setAiFeedback(feedbackText);
    } catch (err: any) {
      setAiError(err?.message || 'Failed to get AI feedback');
    } finally {
      setAiLoading(false);
    }
  };

  // Handler for AI chat (argument)
  const handleSendChatMessage = async (message: string) => {
    // Use the same provider logic as above, but with the message as the prompt
    try {
      let response, data, aiReply = '';
      if (provider === 'openrouter' && openRouterKey) {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
          },
          body: JSON.stringify({
            model: selectedModel || 'deepseek/deepseek-chat-v3-0324:free',
            messages: [
              { role: 'system', content: 'You are a helpful educational assistant. Provide concise, clear answers to student questions.' },
              { role: 'user', content: message }
            ],
            max_tokens: 300,
            temperature: 0.7
          })
        });
        data = await response.json();
        aiReply = data.choices?.[0]?.message?.content || '';
      } else if (provider === 'gemini' && geminiKey) {
        const geminiModelId = (selectedModel || 'gemini-pro').split('/').pop();
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModelId}:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
            generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
          })
        });
        data = await response.json();
        aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else if (provider === 'openai' && openAIKey) {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a helpful educational assistant. Provide concise, clear answers to student questions.' },
              { role: 'user', content: message }
            ],
            max_tokens: 300,
            temperature: 0.7
          })
        });
        data = await response.json();
        aiReply = data.choices?.[0]?.message?.content || '';
      } else {
        throw new Error('No valid API key for selected provider');
      }
      if (!aiReply) throw new Error('AI response missing expected content');
      return aiReply;
    } catch (err: any) {
      return err?.message || 'Failed to get AI reply';
    }
  };

  // Trigger AI feedback after answering and locking a question
  useEffect(() => {
    const currentQ = state.questions[state.currentQuestion];
    if (
      currentQ &&
      currentQ.isAnswerLocked &&
      selectedOption &&
      (openRouterKey || geminiKey || openAIKey)
    ) {
      fetchAiFeedback(currentQ, selectedOption);
    } else {
      setAiFeedback(null);
      setAiError(null);
      setAiLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentQuestion, state.questions[state.currentQuestion]?.isAnswerLocked, selectedOption, openRouterKey, geminiKey, openAIKey, provider, selectedModel]);

  useEffect(() => {
    async function fetchQuestionsIfNeeded() {
      if ((!externalQuestions || externalQuestions.length === 0) && state.questions.length === 0) {
        setIsLoading(true);
        try {
          // Check if API key is configured
          const isApiKeyConfigured = await aiService.isApiKeyConfigured();
          if (!isApiKeyConfigured) {
            // Show a notification but continue with fallback functionality
            toast.info('API key not configured. Using basic quiz functionality.');
          }
          
          // Generate questions - aiService will use fallback if no API key is configured
          const aiQuestions = await aiService.generateQuestions('General Knowledge', 5);
          const enhancedQuestions = initializeQuizState(aiQuestions).questions;
          setState(prevState => ({
            ...prevState,
            questions: enhancedQuestions,
            userAnswers: Array(enhancedQuestions.length).fill(""),
            essayRatings: Array(enhancedQuestions.length).fill(null),
            startTime: new Date(),
            isInterleaved: false,
            activeRecallPrompts: [],
            showActiveRecall: false,
            showConfirmation: false
          }));
          setShowInput(false);
        } catch (error) {
          debugError('fetchQuestionsIfNeeded', error as Error);
          toast.error('Failed to generate questions');
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchQuestionsIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto p-4">
      {showInput ? (
        <JsonInput onQuizStart={prepareQuiz} />
      ) : state.showResults ? (
        <QuizResults 
          questions={state.questions}
          userAnswers={state.userAnswers}
          score={state.score}
          onRestart={() => setState(initializeQuizState())}
          onNewQuiz={() => setShowInput(true)}
          essayRatings={state.essayRatings}
          provider={provider}
          apiKey={openRouterKey}
          selectedModel={selectedModel}
        />
      ) : state.questions.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Quiz</h2>
            <SoundControls />
          </div>
          
          <QuizCard
            key={`${state.currentQuestion}-${state.questions[state.currentQuestion]?.analytics?.recallAttempts || 0}`}
            question={state.questions[state.currentQuestion]}
            questionNumber={state.currentQuestion + 1}
            totalQuestions={state.questions.length}
            onAnswer={handleAnswer}
            showFeedback={showFeedback}
            selectedOption={selectedOption}
            isCorrect={selectedOption === state.questions[state.currentQuestion]?.answer}
          />
          
          {showActiveRecall && (
            <ActiveRecallPrompt
              prompts={activeRecallPrompts}
              onSubmit={handleActiveRecallSubmit}
            />
          )}
          
          {/* Show AI Explainer after answering */}
          {selectedOption && state.questions[state.currentQuestion]?.isAnswerLocked && (
            <AIExplainer
              context={{
                question: state.questions[state.currentQuestion]?.question || '',
                userAnswer: selectedOption,
                correctAnswer: state.questions[state.currentQuestion]?.answer || '',
                isCorrect: selectedOption === state.questions[state.currentQuestion]?.answer,
                questionType: state.questions[state.currentQuestion]?.type || 'multiple',
                options: state.questions[state.currentQuestion]?.options
              }}
            />
          )}
          
          {/* Always visible navigation */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button 
              onClick={handleBack} 
              variant="outline"
              disabled={state.currentQuestion === 0}
            >
              Previous
            </Button>
            
            <div className="text-sm text-gray-500">
              Question {state.currentQuestion + 1} of {state.questions.length}
            </div>
            
            <Button 
              onClick={moveToNextQuestion}
              disabled={!selectedOption && !state.questions[state.currentQuestion]?.isAnswerLocked}
              className={state.currentQuestion === state.questions.length - 1 ? 
                "bg-green-600 hover:bg-green-700 text-white font-semibold" : 
                "bg-blue-600 hover:bg-blue-700 text-white"
              }
            >
              {state.currentQuestion < state.questions.length - 1 ? 'Next' : 'Finish Quiz 🎉'}
            </Button>
          </div>
          
          {showConfirmation && (
            <div className="flex justify-between">
              <Button onClick={handleBack} variant="outline">
                Previous
              </Button>
              <Button 
                onClick={moveToNextQuestion}
                className={state.currentQuestion === state.questions.length - 1 ? 
                  "bg-green-600 hover:bg-green-700 text-white font-semibold" : 
                  "bg-blue-600 hover:bg-blue-700 text-white"
                }
              >
                {state.currentQuestion < state.questions.length - 1 ? 'Next' : 'Finish Quiz 🎉'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500">No questions available</p>
          <Button onClick={() => setShowInput(true)} className="mt-4">
            Create Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
