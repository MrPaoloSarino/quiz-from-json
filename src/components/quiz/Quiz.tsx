import React, { useState, useEffect } from "react";
import JsonInput from "./JsonInput";
import QuizCard from "./QuizCard";
import QuizResults from "./QuizResults";
import AiFeedback from "./AiFeedback";
import { QuizQuestion, QuizState, GeminiResponse } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const STORAGE_KEY = "quiz-openrouter-api-key";
const RATE_LIMIT_TIME = 60000; // 1 minute in milliseconds
const MAX_CALLS_PER_MINUTE = 10;

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

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    showResults: false,
    userAnswers: [],
    feedback: null,
  });
  const [showInput, setShowInput] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
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

  // Enhanced API key validation for OpenRouter keys (usually sk-or-...)
  const validateApiKey = (key: string): boolean => {
    return key.trim().length > 20 && key.startsWith("sk-");
  };

  // Rate limiting check
  const isRateLimited = (): boolean => {
    const now = Date.now();
    // Filter calls made within the rate limit time window
    const recentCalls = apiCalls.filter(timestamp => (now - timestamp) < RATE_LIMIT_TIME);
    
    return recentCalls.length >= MAX_CALLS_PER_MINUTE;
  };

  // Record API call for rate limiting
  const recordApiCall = (): void => {
    const now = Date.now();
    // Keep only recent calls and add the new one
    const recentCalls = apiCalls.filter(timestamp => (now - timestamp) < RATE_LIMIT_TIME);
    setApiCalls([...recentCalls, now]);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY);
    if (savedKey) {
      const decryptedKey = decryptData(savedKey);
      if (decryptedKey) {
        setOpenRouterKey(decryptedKey);
      }
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setOpenRouterKey(newKey);
    
    // Save to localStorage if not empty
    if (newKey.trim()) {
      localStorage.setItem(STORAGE_KEY, encryptData(newKey));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const prepareQuiz = (questions: QuizQuestion[]) => {
    setLoadedQuestions(questions);
    setShowInput(false);
    setShowGeminiInput(true);
  };
  
  const startQuiz = () => {
    setState({
      questions: loadedQuestions,
      currentQuestion: 0,
      score: 0,
      showResults: false,
      userAnswers: Array(loadedQuestions.length).fill(""),
      feedback: null,
    });
    setQuizReadyToStart(false);
    setShowGeminiInput(false);
    // Reset any previous API errors
    setApiError(null);
  };

  const handleAnswer = (selectedOption: string) => {
    setSelectedOption(selectedOption);
    setShowFeedback(true);
    
    const isCorrect = selectedOption === state.questions[state.currentQuestion].answer;
    
    // Update the userAnswers array
    const updatedUserAnswers = [...state.userAnswers];
    updatedUserAnswers[state.currentQuestion] = selectedOption;
    
    setState({
      ...state,
      score: isCorrect ? state.score + 1 : state.score,
      userAnswers: updatedUserAnswers,
      feedback: null,
    });
    
    // Show toast for feedback
    if (isCorrect) {
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect answer!");
    }

    // Get AI feedback if API key is provided
    if (openRouterKey && openRouterKey.trim() !== "") {
      getFeedback(
        state.questions[state.currentQuestion].question,
        selectedOption,
        state.questions[state.currentQuestion].answer,
        isCorrect
      );
    }

    // Show confirmation button instead of automatically moving to the next question
    setShowConfirmation(true);
  };

  const moveToNextQuestion = () => {
    if (state.currentQuestion < state.questions.length - 1) {
      setState((prevState) => ({
        ...prevState,
        currentQuestion: prevState.currentQuestion + 1,
        feedback: null,
      }));
      setSelectedOption(null);
      setShowFeedback(false);
      setShowConfirmation(false);
      // Reset any API errors when moving to next question
      setApiError(null);
    } else {
      setState((prevState) => ({
        ...prevState,
        showResults: true,
      }));
    }
  };

  // Fetch available models from OpenRouter when API key is entered
  useEffect(() => {
    const fetchModels = async () => {
      if (!openRouterKey || !validateApiKey(openRouterKey)) {
        setModels([]);
        setSelectedModel("");
        return;
      }
      try {
        const res = await fetch("https://openrouter.ai/api/v1/models", {
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch models");
        const data = await res.json();
        setModels(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedModel(data.data[0].id);
        }
      } catch (e) {
        setModels([]);
        setSelectedModel("");
      }
    };
    fetchModels();
  }, [openRouterKey]);

  const getFeedback = async (
    question: string, 
    userAnswer: string, 
    correctAnswer: string, 
    isCorrect: boolean
  ) => {
    setApiError(null);
    setLoadingFeedback(true);
    try {
      if (!openRouterKey || !validateApiKey(openRouterKey)) {
        throw new Error("Invalid OpenRouter API key format");
      }
      if (!selectedModel) {
        throw new Error("No model selected");
      }
      if (isRateLimited()) {
        throw new Error("Rate limit exceeded. Please wait before making more requests.");
      }
      const prompt = `
        I'm doing a quiz. The question was: "${question}".
        I chose: "${userAnswer}".
        The correct answer is: "${correctAnswer}".
        My answer was ${isCorrect ? 'correct' : 'incorrect'}.
        Provide me a constructive feedback as to why my answer is correct or incorrect max 2-5 sentences.
      `;
      const makeRequest = async (): Promise<string> => {
        recordApiCall();
        const response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openRouterKey}`,
            ...(siteUrl ? { "HTTP-Referer": siteUrl } : {}),
            ...(siteName ? { "X-Title": siteName } : {}),
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: "system", content: "You are a helpful quiz feedback assistant." },
              { role: "user", content: prompt }
            ],
            extra_body: {},
          }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API error: ${errorData?.error?.message || response.statusText}`);
        }
        const data = await response.json();
        if (!data?.choices?.[0]?.message?.content) {
          throw new Error("Invalid API response format");
        }
        return data.choices[0].message.content;
      };
      let feedbackText: string = "";
      let currentRetry = 0;
      while (currentRetry < MAX_RETRIES) {
        try {
          feedbackText = await makeRequest();
          break;
        } catch (error) {
          currentRetry++;
          if (currentRetry === MAX_RETRIES) {
            throw error;
          }
          await sleep(RETRY_DELAY * currentRetry);
        }
      }
      if (!feedbackText) {
        throw new Error("Failed to get response after retries");
      }
      setState((prevState) => ({
        ...prevState,
        feedback: feedbackText,
      }));
      setRetryCount(0);
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get AI feedback";
      setApiError(errorMessage);
      toast.error(errorMessage);
      setRetryCount((prev) => prev + 1);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const restartQuiz = () => {
    setState({
      questions: state.questions,
      currentQuestion: 0,
      score: 0,
      showResults: false,
      userAnswers: Array(state.questions.length).fill(""),
      feedback: null,
    });
    setSelectedOption(null);
    setShowFeedback(false);
    setShowConfirmation(false);
    setApiError(null);
    setRetryCount(0);
    setApiCalls([]);
    setQuizReadyToStart(false);
    setLoadedQuestions(state.questions);
  };

  const newQuiz = () => {
    setShowInput(true);
    setState({
      questions: [],
      currentQuestion: 0,
      score: 0,
      showResults: false,
      userAnswers: [],
      feedback: null,
    });
    setShowConfirmation(false);
    setQuizReadyToStart(false);
    setLoadedQuestions([]);
    setApiError(null);
    setRetryCount(0);
    setApiCalls([]);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  if (showInput) {
    return <JsonInput onQuizStart={prepareQuiz} />;
  }

  if (showGeminiInput) {
    return (
      <Card className="w-full max-w-xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Enter OpenRouter API Key</h2>
        <p className="text-sm text-gray-500 mb-4">
          To get AI feedback on your answers, please enter your OpenRouter API key.<br />
          You can get a free key at <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai</a>.<br />
          <b>Optional:</b> For better ranking, enter your site URL and site name.
        </p>
        <div className="flex relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            value={openRouterKey}
            onChange={handleApiKeyChange}
            placeholder="Paste your OpenRouter API key here"
            className="w-full p-2 border rounded pr-10"
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-500"
            aria-label={showPassword ? "Hide API key" : "Show API key"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {openRouterKey && !validateApiKey(openRouterKey) && (
          <p className="text-sm text-red-500 mb-2">
            API key seems invalid. It should start with <code>sk-</code> and be at least 20 characters.
          </p>
        )}
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Choose a model</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            disabled={models.length === 0}
          >
            {models.length === 0 && <option value="">Enter a valid API key to load models</option>}
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.id}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={siteUrl}
          onChange={e => setSiteUrl(e.target.value)}
          placeholder="Your site URL (optional)"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          value={siteName}
          onChange={e => setSiteName(e.target.value)}
          placeholder="Your site name (optional)"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowInput(true)}
            className="text-sm"
          >
            ← Back
          </Button>
          <Button
            onClick={startQuiz}
            className="flex-1 bg-quiz-primary hover:bg-quiz-secondary text-white"
            disabled={openRouterKey.trim() !== "" && !validateApiKey(openRouterKey)}
          >
            {openRouterKey ? "Start Quiz with AI Feedback" : "Start Quiz without AI Feedback"}
          </Button>
        </div>
      </Card>
    );
  }

  if (state.showResults) {
    return (
      <QuizResults
        questions={state.questions}
        userAnswers={state.userAnswers}
        score={state.score}
        onRestart={restartQuiz}
        onNewQuiz={newQuiz}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={newQuiz}
          className="text-sm"
        >
          ← Back to Input
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-quiz-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((state.currentQuestion + 1) / state.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <QuizCard
        question={state.questions[state.currentQuestion]}
        questionNumber={state.currentQuestion + 1}
        totalQuestions={state.questions.length}
        onAnswer={handleAnswer}
        showFeedback={showFeedback}
        selectedOption={selectedOption}
        isCorrect={selectedOption === state.questions[state.currentQuestion].answer}
      />

      <AiFeedback 
        feedback={state.feedback} 
        loading={loadingFeedback} 
        error={apiError}
      />

      {showConfirmation && (
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={moveToNextQuestion}
            className="bg-quiz-primary hover:bg-quiz-secondary text-white"
          >
            {state.currentQuestion < state.questions.length - 1 ? "Next Question" : "View Results"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
