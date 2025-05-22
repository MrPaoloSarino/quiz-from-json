
import React, { useState, useEffect } from "react";
import JsonInput from "./JsonInput";
import QuizCard from "./QuizCard";
import QuizResults from "./QuizResults";
import AiFeedback from "./AiFeedback";
import { QuizQuestion, QuizState, GeminiResponse } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

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
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [showGeminiInput, setShowGeminiInput] = useState<boolean>(false);
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const startQuiz = (questions: QuizQuestion[]) => {
    setState({
      questions,
      currentQuestion: 0,
      score: 0,
      showResults: false,
      userAnswers: Array(questions.length).fill(""),
      feedback: null,
    });
    setShowInput(false);
    setShowGeminiInput(!geminiKey);
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
    if (geminiKey) {
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
    } else {
      setState((prevState) => ({
        ...prevState,
        showResults: true,
      }));
    }
  };

  const getFeedback = async (
    question: string, 
    userAnswer: string, 
    correctAnswer: string, 
    isCorrect: boolean
  ) => {
    setLoadingFeedback(true);

    try {
      const prompt = `
        I'm doing a quiz. The question was: "${question}".
        I chose: "${userAnswer}".
        The correct answer is: "${correctAnswer}".
        My answer was ${isCorrect ? 'correct' : 'incorrect'}.
        
        Please provide a brief, conversational feedback with a helpful explanation about this answer (2-3 sentences max).
        Focus on clarifying why the answer is correct or what the correct answer means.
      `;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=" + geminiKey,
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
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200,
            }
          }),
        }
      );

      const data = await response.json() as GeminiResponse;

      if (data.content?.parts?.[0]?.text) {
        setState((prevState) => ({
          ...prevState,
          feedback: data.content.parts[0].text,
        }));
      }
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      toast.error("Failed to get AI feedback");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const restartQuiz = () => {
    setState({
      ...state,
      currentQuestion: 0,
      score: 0,
      showResults: false,
      userAnswers: Array(state.questions.length).fill(""),
      feedback: null,
    });
    setSelectedOption(null);
    setShowFeedback(false);
    setShowConfirmation(false);
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
  };

  if (showGeminiInput) {
    return (
      <Card className="w-full max-w-xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Enter Google Gemini API Key</h2>
        <p className="text-sm text-gray-500 mb-4">
          To get AI feedback on your answers, please enter your Gemini API key.
          You can skip this step if you don't want AI feedback.
        </p>
        <input
          type="password"
          value={geminiKey}
          onChange={(e) => setGeminiKey(e.target.value)}
          placeholder="Paste your Gemini API key here"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex gap-2">
          <Button
            onClick={() => setShowGeminiInput(false)}
            className="flex-1"
          >
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowGeminiInput(false);
              setGeminiKey("");
            }}
            className="flex-1"
          >
            Skip
          </Button>
        </div>
      </Card>
    );
  }

  if (showInput) {
    return <JsonInput onQuizStart={startQuiz} />;
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
