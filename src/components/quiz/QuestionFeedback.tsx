import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QuizQuestion } from '@/types/quiz';
import { MessageSquare, Send, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionFeedbackProps {
  question: QuizQuestion;
  userAnswer: string;
  isCorrect: boolean;
  questionNumber: number;
  provider: 'openrouter' | 'gemini' | 'openai';
  apiKey: string;
  selectedModel?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QuestionFeedback: React.FC<QuestionFeedbackProps> = ({
  question,
  userAnswer,
  isCorrect,
  questionNumber,
  provider,
  apiKey,
  selectedModel
}) => {
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFeedback = async () => {
    if (!apiKey) {
      toast.error('Please provide an API key to get feedback');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = `Question ${questionNumber}: "${question.question}"
User's answer: "${userAnswer}"
Correct answer: "${question.answer}"
User was ${isCorrect ? 'correct' : 'incorrect'}.

Please provide:
1. A brief explanation of why the answer is ${isCorrect ? 'correct' : 'incorrect'}
2. Key concepts to remember
3. One tip for improvement (if applicable)

Keep the response concise and educational.`;

      let response;
      if (provider === 'openrouter') {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: selectedModel || 'deepseek/deepseek-chat-v3-0324:free',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
            temperature: 0.7
          })
        });
      } else if (provider === 'gemini') {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel || 'gemini-pro'}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 300,
              temperature: 0.7
            }
          })
        });
      } else if (provider === 'openai') {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
            temperature: 0.7
          })
        });
      }

      if (!response?.ok) {
        throw new Error(`API request failed: ${response?.statusText}`);
      }

      const data = await response.json();
      let feedbackText = '';

      if (provider === 'openrouter' || provider === 'openai') {
        feedbackText = data.choices[0].message.content;
      } else if (provider === 'gemini') {
        feedbackText = data.candidates[0].content.parts[0].text;
      }

      setFeedback(feedbackText);
      toast.success('Feedback generated successfully!');
    } catch (error) {
      console.error('Error getting feedback:', error);
      setError('Failed to get feedback. Please try again.');
      toast.error('Failed to get feedback');
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim() || !apiKey) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setChatLoading(true);

    try {
      const contextPrompt = `Context: Question ${questionNumber}: "${question.question}"
User's answer: "${userAnswer}"
Correct answer: "${question.answer}"
User was ${isCorrect ? 'correct' : 'incorrect'}.

User's follow-up question: "${newMessage}"

Please provide a helpful response that addresses their question while staying relevant to the quiz context.`;

      let response;
      if (provider === 'openrouter') {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: selectedModel || 'deepseek/deepseek-chat-v3-0324:free',
            messages: [{ role: 'user', content: contextPrompt }],
            max_tokens: 200,
            temperature: 0.7
          })
        });
      } else if (provider === 'gemini') {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel || 'gemini-pro'}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: contextPrompt }] }],
            generationConfig: {
              maxOutputTokens: 200,
              temperature: 0.7
            }
          })
        });
      } else if (provider === 'openai') {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: contextPrompt }],
            max_tokens: 200,
            temperature: 0.7
          })
        });
      }

      if (!response?.ok) {
        throw new Error(`API request failed: ${response?.statusText}`);
      }

      const data = await response.json();
      let aiResponse = '';

      if (provider === 'openrouter' || provider === 'openai') {
        aiResponse = data.choices[0].message.content;
      } else if (provider === 'gemini') {
        aiResponse = data.candidates[0].content.parts[0].text;
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      toast.error('Failed to send message');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Question {questionNumber} Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Question Summary</h4>
          <p className="text-sm text-gray-700 mb-2">{question.question}</p>
          <div className="flex gap-4 text-sm">
            <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              Your Answer: {userAnswer}
            </span>
            <span className="text-gray-600">
              Correct Answer: {question.answer}
            </span>
          </div>
        </div>

        {/* AI Feedback Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">AI Feedback</h4>
            <Button
              onClick={getFeedback}
              disabled={loading || !apiKey}
              size="sm"
              className="flex items-center gap-2"
            >
              {loading ? <Spinner className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
              Get Feedback
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {feedback && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">Feedback:</h5>
              <p className="text-blue-800 text-sm whitespace-pre-wrap">{feedback}</p>
            </div>
          )}
        </div>

        {/* AI Chat Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h4 className="font-semibold">Ask AI About This Question</h4>
          </div>

          {/* Chat Messages */}
          <div className="max-h-60 overflow-y-auto space-y-3">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Spinner className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask a question about this problem..."
              className="flex-1"
              rows={2}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendChatMessage();
                }
              }}
            />
            <Button
              onClick={sendChatMessage}
              disabled={!newMessage.trim() || chatLoading || !apiKey}
              size="sm"
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionFeedback; 