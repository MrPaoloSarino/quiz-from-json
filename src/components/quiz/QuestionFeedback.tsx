import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QuizQuestion } from '@/types/quiz';
import { MessageSquare, Send, Brain, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionFeedbackProps {
  question: QuizQuestion;
  userAnswer: string;
  isCorrect: boolean;
  questionNumber: number;
  provider: 'openrouter' | 'gemini' | 'openai';
  apiKey: string;
  selectedModel?: string;
  essayRating?: number;
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
  selectedModel,
  essayRating
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEssay = question.type === 'essay';

  // Auto-fetch detailed explanation once the component mounts and an API key exists
  useEffect(() => {
    if (!explanation && !loadingExplanation && apiKey) {
      getExplanation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getExplanation = async () => {
    if (!apiKey) {
      toast.error('Please provide an API key to get explanations');
      return;
    }

    setLoadingExplanation(true);
    setError(null);

    try {
      let prompt = '';
      
      if (isEssay) {
        prompt = `You are an expert tutor providing detailed feedback on an essay answer.

**Question:** ${question.question}
**Student's Answer:** ${userAnswer}
**AI Rating:** ${essayRating}/10

Please provide:

1. **What You Did Well:** Highlight 2-3 specific strengths in the answer
2. **Areas for Improvement:** Identify 2-3 specific areas that could be enhanced
3. **Why This Score:** Explain why this answer received ${essayRating}/10
4. **Perfect Answer Elements:** What would a 10/10 answer include?
5. **Next Steps:** One specific action to improve

Format your response clearly with headers and be encouraging while being constructive.`;
      } else {
        prompt = `You are an expert tutor explaining a quiz question.

**Question:** ${question.question}
**Options:** ${question.options?.join(', ')}
**Correct Answer:** ${question.answer}
**Student's Answer:** ${userAnswer}
**Result:** ${isCorrect ? 'CORRECT ✓' : 'INCORRECT ✗'}

Please provide a comprehensive explanation:

1. **Why the Correct Answer is Right:** Explain why "${question.answer}" is correct
${!isCorrect ? `2. **Why Your Answer was Wrong:** Explain specifically why "${userAnswer}" is incorrect` : ''}
${!isCorrect ? '3. **Common Mistake:** Why students often choose this wrong answer' : '2. **Key Concept:** The main principle/concept being tested'}
${!isCorrect ? '4. **Remember This:** One key point to remember for similar questions' : '3. **Remember This:** One key point to remember for similar questions'}

Be clear, educational, and ${isCorrect ? 'congratulatory' : 'encouraging'}.`;
      }

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
            messages: [
              { 
                role: 'system', 
                content: 'You are an expert educational tutor. Provide clear, structured explanations that help students learn effectively. Use encouraging language and focus on understanding concepts.'
              },
              { role: 'user', content: prompt }
            ],
            max_tokens: 500,
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
              maxOutputTokens: 500,
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
            messages: [
              { 
                role: 'system', 
                content: 'You are an expert educational tutor. Provide clear, structured explanations that help students learn effectively. Use encouraging language and focus on understanding concepts.'
              },
              { role: 'user', content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });
      }

      if (!response?.ok) {
        throw new Error(`API request failed: ${response?.statusText}`);
      }

      const data = await response.json();
      let explanationText = '';

      if (provider === 'openrouter' || provider === 'openai') {
        explanationText = data.choices[0].message.content;
      } else if (provider === 'gemini') {
        explanationText = data.candidates[0].content.parts[0].text;
      }

      setExplanation(explanationText);
      toast.success('Explanation generated successfully!');
    } catch (error) {
      console.error('Error getting explanation:', error);
      let message = 'Failed to get explanation. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          message = 'Network error: Failed to fetch – check your internet connection or CORS settings.';
        } else {
          message = error.message;
        }
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoadingExplanation(false);
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
      const contextPrompt = `You are a helpful tutor answering follow-up questions about a quiz question.

**Original Question:** ${question.question}
**Student's Answer:** ${userAnswer}
**Correct Answer:** ${question.answer}
**Question Type:** ${isEssay ? 'Essay' : 'Multiple Choice'}
${isEssay ? `**AI Rating:** ${essayRating}/10` : `**Result:** ${isCorrect ? 'Correct' : 'Incorrect'}`}

**Student's Follow-up Question:** ${newMessage}

Please provide a helpful, concise response that addresses their specific question while staying relevant to the quiz context. Be encouraging and educational.`;

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
            messages: [
              { role: 'system', content: 'You are a helpful educational assistant. Provide concise, clear answers to student questions.' },
              { role: 'user', content: contextPrompt }
            ],
            max_tokens: 300,
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
            messages: [
              { role: 'system', content: 'You are a helpful educational assistant. Provide concise, clear answers to student questions.' },
              { role: 'user', content: contextPrompt }
            ],
            max_tokens: 300,
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
      let chatErr = 'Failed to send message';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          chatErr = 'Network error: Failed to fetch – check your internet connection or CORS settings.';
        } else {
          chatErr = error.message;
        }
      }
      toast.error(chatErr);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Summary */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${isEssay ? 'bg-purple-100' : isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              {isEssay ? (
                <Brain className={`w-5 h-5 ${essayRating && essayRating >= 7 ? 'text-green-600' : 'text-orange-600'}`} />
              ) : isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{question.question}</h4>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Your answer:</span> {userAnswer || 'No answer provided'}</p>
                {!isEssay && (
                  <p><span className="font-medium">Correct answer:</span> <span className="text-green-600">{question.answer}</span></p>
                )}
                {isEssay && essayRating !== undefined && (
                  <p><span className="font-medium">Score:</span> <span className={essayRating >= 7 ? 'text-green-600' : 'text-orange-600'}>{essayRating}/10</span></p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Explanation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            AI Explanation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!explanation && !apiKey && (
            <Button
              onClick={getExplanation}
              disabled={loadingExplanation}
              className="w-full"
            >
              {loadingExplanation ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Generating explanation...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Get Detailed Explanation
                </>
              )}
            </Button>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {explanation && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm text-blue-900">{explanation}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Ask Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          {chatMessages.length > 0 && (
            <div className="max-h-80 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <Spinner className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Input */}
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask a question about this problem... (e.g., 'Can you explain this concept differently?', 'What's a good way to remember this?')"
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
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {!apiKey && (
            <p className="text-sm text-gray-500 text-center">
              Add an API key to enable AI explanations and chat
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionFeedback; 