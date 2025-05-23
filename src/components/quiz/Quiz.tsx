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
  const [provider, setProvider] = useState<'openrouter' | 'gemini'>('openrouter');
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
    if (provider === 'openrouter' && openRouterKey && openRouterKey.trim() !== "") {
      getFeedback(
        state.questions[state.currentQuestion].question,
        selectedOption,
        state.questions[state.currentQuestion].answer,
        isCorrect
      );
    } else if (provider === 'gemini' && geminiKey && geminiKey.trim() !== "") {
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

  // Fetch OpenRouter models
  useEffect(() => {
    if (provider !== 'openrouter') return;
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
  }, [openRouterKey, provider]);

  // Fetch Gemini models
  useEffect(() => {
    if (provider !== 'gemini') return;
    const fetchGeminiModels = async () => {
      if (!geminiKey || geminiKey.trim().length < 20) {
        setGeminiModels([]);
        setSelectedGeminiModel("");
        return;
      }
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        if (!res.ok) throw new Error("Failed to fetch Gemini models");
        const data = await res.json();
        // Only include models that support generateContent
        const filtered = (data.models || []).filter((m: any) => (m.supportedGenerationMethods || []).includes('generateContent'));
        setGeminiModels(filtered);
        if (filtered.length > 0) {
          setSelectedGeminiModel(filtered[0].name);
        }
      } catch (e) {
        setGeminiModels([]);
        setSelectedGeminiModel("");
      }
    };
    fetchGeminiModels();
  }, [geminiKey, provider]);

  const getFeedback = async (
    question: string, 
    userAnswer: string, 
    correctAnswer: string, 
    isCorrect: boolean
  ) => {
    setApiError(null);
    setLoadingFeedback(true);
    try {
      const currentQ = state.questions[state.currentQuestion];
      const isEssay = currentQ.type === 'essay';
      let prompt = '';
      if (isEssay) {
        prompt = `Based on the question, here is my answer. You are the most capable to answer the question and rate my answer from 0 to 10 based on concrete evidence and benchmarking. Please reply in plain text only, without any markdown or formatting.\n\nQuestion: ${question}\nMy answer: ${userAnswer}`;
      } else {
        prompt = `\n          I'm doing a quiz. The question was: "${question}".\n          I chose: "${userAnswer}".\n          The correct answer is: "${correctAnswer}".\n          My answer was ${isCorrect ? 'correct' : 'incorrect'}.\n          Provide me a constructive feedback as to why my answer is correct or incorrect max 2-5 sentences.\n        `;
      }
      if (provider === 'openrouter') {
        if (!openRouterKey || !validateApiKey(openRouterKey)) {
          throw new Error("Invalid OpenRouter API key format");
        }
        if (!selectedModel) {
          throw new Error("No model selected");
        }
        if (isRateLimited()) {
          throw new Error("Rate limit exceeded. Please wait before making more requests.");
        }
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
              { role: "system", content: isEssay ? "You are an expert essay evaluator and grader." : "You are a helpful quiz feedback assistant." },
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
        setState((prevState) => ({
          ...prevState,
          feedback: data.choices[0].message.content,
        }));
        setRetryCount(0);
      } else if (provider === 'gemini') {
        if (!geminiKey || geminiKey.trim().length < 20) {
          throw new Error("Invalid Gemini API key format");
        }
        if (!selectedGeminiModel) {
          throw new Error("No Gemini model selected");
        }
        // Use only the model id (after last /)
        const modelId = selectedGeminiModel.split('/').pop();
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt
                    }
                  ]
                }
              ]
            }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          let debugMsg = '';
          if (errorData?.error?.message) {
            debugMsg = `Gemini API error: ${errorData.error.message}`;
          } else if (errorData?.error) {
            debugMsg = `Gemini API error: ${JSON.stringify(errorData.error)}`;
          } else {
            debugMsg = `Raw response: ${JSON.stringify(errorData)}`;
          }
          throw new Error(
            `API error: ${errorData?.error?.message || response.statusText}\n\nPossible causes:\n- Invalid API key\n- Invalid or unsupported model\n- Quota exceeded or billing issue\n- Network or server error\n\n${debugMsg}`
          );
        }
        const data = await response.json();
        const geminiText =
          data?.contents?.[0]?.parts?.[0]?.text ||
          data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!geminiText) {
          let debugMsg = '';
          if (data?.error?.message) {
            debugMsg = `Gemini API error: ${data.error.message}`;
          } else if (data?.error) {
            debugMsg = `Gemini API error: ${JSON.stringify(data.error)}`;
          } else {
            debugMsg = `Raw response: ${JSON.stringify(data)}`;
          }
          throw new Error(
            `Invalid Gemini API response format.\n\nPossible causes:\n- Invalid API key\n- Invalid or unsupported model\n- Quota exceeded or billing issue\n- Network or server error\n\n${debugMsg}`
          );
        }
        setState((prevState) => ({
          ...prevState,
          feedback: geminiText,
        }));
        setRetryCount(0);
        // Essay scoring: extract rating and update score
        if (isEssay) {
          // Try to extract a rating robustly
          let rating = null;
          // Prefer patterns like 'score: 7/10', 'rating: 8/10', '8 out of 10'
          const patterns = [
            /score\s*[:=]?\s*(10|[0-9])\s*\/\s*10/i,
            /rating\s*[:=]?\s*(10|[0-9])\s*\/\s*10/i,
            /(10|[0-9])\s*out of\s*10/i,
            /score\s*[:=]?\s*(10|[0-9])/i,
            /rating\s*[:=]?\s*(10|[0-9])/i
          ];
          for (const pattern of patterns) {
            const match = geminiText.match(pattern);
            if (match) {
              rating = parseInt(match[1], 10);
              break;
            }
          }
          // Fallback: look for the first number 0-10 after 'rating', 'score', or 'out of 10'
          if (rating === null) {
            const fallbackPattern = /(rating|score|out of 10)[^\d]*(10|[0-9])/i;
            const fallbackMatch = geminiText.match(fallbackPattern);
            if (fallbackMatch) {
              rating = parseInt(fallbackMatch[2], 10);
            }
          }
          // Last fallback: any number 0-10 in the text
          if (rating === null) {
            const anyNum = geminiText.match(/\b(10|[0-9])\b/);
            if (anyNum) {
              rating = parseInt(anyNum[1], 10);
            }
          }
          if (rating === null || isNaN(rating) || rating < 0 || rating > 10) {
            setApiError('AI did not return a valid rating from 0 to 10. Please try again or rephrase your answer.');
            return;
          }
          // Update score for this essay question
          setState((prevState) => {
            const newUserAnswers = [...prevState.userAnswers];
            newUserAnswers[prevState.currentQuestion] = userAnswer;
            // Score is the rating for this question
            return {
              ...prevState,
              score: prevState.score - (prevState.userAnswers[prevState.currentQuestion] ? Number(prevState.userAnswers[prevState.currentQuestion]) : 0) + rating,
              userAnswers: newUserAnswers,
            };
          });
        }
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
    fetchGeminiModels();
  }, [geminiKey, provider]);

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
        <h2 className="text-xl font-semibold mb-4">Enter API Key & Choose Provider</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Provider</label>
          <select
            className="w-full p-2 border rounded"
            value={provider}
            onChange={e => setProvider(e.target.value as 'openrouter' | 'gemini')}
          >
            <option value="openrouter">OpenRouter</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
        {provider === 'openrouter' && (
          <>
            <p className="text-sm text-green-500 mb-4">
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
                className="absolute right-2 top-2 text-green-500"
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
            <label className="block text-sm font-medium mb-1">Choose a model</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              placeholder="Search models..."
              value={modelSearch}
              onChange={e => setModelSearch(e.target.value)}
              onFocus={() => setShowModelDropdown(true)}
            />
            {/* Custom dropdown for model selection with autowrap */}
            <div
              className="w-full border rounded bg-white relative"
              style={{ maxHeight: 180, overflowY: 'auto', zIndex: 10, position: 'relative' }}
              tabIndex={0}
              onBlur={() => setShowModelDropdown(false)}
            >
              {showModelDropdown && models.length > 0 && (
                <div>
                  {models
                    .filter(model => model.id.toLowerCase().includes(modelSearch.toLowerCase()))
                    .map((model) => (
                      <div
                        key={model.id}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedModel === model.id ? 'bg-gray-200' : ''}`}
                        style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}
                        onMouseDown={() => {
                          setSelectedModel(model.id);
                          setShowModelDropdown(false);
                        }}
                      >
                        {model.id}
                      </div>
                    ))}
                  {models.filter(model => model.id.toLowerCase().includes(modelSearch.toLowerCase())).length === 0 && (
                    <div className="p-2 text-gray-400">No models found</div>
                  )}
                </div>
              )}
              {!showModelDropdown && (
                <div
                  className="p-2 text-gray-700 cursor-pointer"
                  style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}
                  onClick={() => setShowModelDropdown(true)}
                >
                  {selectedModel || 'Select a model'}
                </div>
              )}
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
          </>
        )}
        {provider === 'gemini' && (
          <>
            <p className="text-sm text-green-500 mb-4">
              To get AI feedback on your answers, please enter your Gemini API key.<br />
              You can get a key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>.<br />
            </p>
            <div className="flex relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                placeholder="Paste your Gemini API key here"
                className="w-full p-2 border rounded pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-green-500"
                aria-label={showPassword ? "Hide API key" : "Show API key"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {geminiKey && geminiKey.trim().length < 20 && (
              <p className="text-sm text-red-500 mb-2">
                API key seems invalid. It should be at least 20 characters.
              </p>
            )}
            <label className="block text-sm font-medium mb-1">Choose a Gemini model</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              placeholder="Search Gemini models..."
              value={geminiModelSearch}
              onChange={e => setGeminiModelSearch(e.target.value)}
              onFocus={() => setShowGeminiModelDropdown(true)}
            />
            <div
              className="w-full border rounded bg-white relative"
              style={{ maxHeight: 180, overflowY: 'auto', zIndex: 10, position: 'relative' }}
              tabIndex={0}
              onBlur={() => setShowGeminiModelDropdown(false)}
            >
              {showGeminiModelDropdown && geminiModels.length > 0 && (
                <div>
                  {geminiModels
                    .filter(model => model.name.toLowerCase().includes(geminiModelSearch.toLowerCase()))
                    .map((model) => (
                      <div
                        key={model.name}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedGeminiModel === model.name ? 'bg-gray-200' : ''}`}
                        style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}
                        onMouseDown={() => {
                          setSelectedGeminiModel(model.name);
                          setShowGeminiModelDropdown(false);
                        }}
                      >
                        {model.name.split('/').pop()}
                      </div>
                    ))}
                  {geminiModels.filter(model => model.name.toLowerCase().includes(geminiModelSearch.toLowerCase())).length === 0 && (
                    <div className="p-2 text-gray-400">No Gemini models found</div>
                  )}
                </div>
              )}
              {!showGeminiModelDropdown && (
                <div
                  className="p-2 text-green-700 cursor-pointer"
                  style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}
                  onClick={() => setShowGeminiModelDropdown(true)}
                >
                  {selectedGeminiModel ? selectedGeminiModel.split('/').pop() : 'Select a Gemini model'}
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex gap-2 mt-4">
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
            disabled={
              (provider === 'openrouter' && (openRouterKey.trim() !== "" && !validateApiKey(openRouterKey))) ||
              (provider === 'gemini' && (geminiKey.trim().length > 0 && geminiKey.trim().length < 20))
            }
          >
            {provider === 'openrouter'
              ? (openRouterKey ? "Start Quiz with AI Feedback" : "Start Quiz without AI Feedback")
              : (geminiKey ? "Start Quiz with AI Feedback" : "Start Quiz without AI Feedback")}
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
        <div className="w-full bg-green-200 h-2 rounded-full">
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
