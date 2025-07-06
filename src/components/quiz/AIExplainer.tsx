import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Send, Brain, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import aiManager, { AIExplanationContext } from '@/utils/aiManager';
import ReactMarkdown from 'react-markdown';
import AIEssayGrader from './AIEssayGrader';

interface AIExplainerProps {
  context: AIExplanationContext;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIExplainer: React.FC<AIExplainerProps> = ({ context }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [essayGrade, setEssayGrade] = useState<{
    score: number;
    maxScore: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    grade: string;
  } | null>(null);

  const providerInfo = aiManager.getProviderInfo();
  const isAIAvailable = aiManager.isAvailable();

  const handleGetExplanation = async () => {
    if (!isAIAvailable) {
      toast.error('Please configure an AI provider in Settings first');
      return;
    }

    setIsLoadingExplanation(true);
    setError(null);
    
    try {
      console.log('🧠 Generating AI explanation...', context);
      const response = await aiManager.generateExplanation(context);
      setExplanation(response);
      toast.success('AI explanation generated!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate explanation';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('AI explanation error:', err);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!newMessage.trim() || !isAIAvailable) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoadingChat(true);
    
    try {
      console.log('💬 Sending chat message...', newMessage);
      
      // Create enhanced context for essay questions with grading info
      const enhancedContext = {
        ...context,
        essayGrade: context.questionType === 'essay' && essayGrade ? {
          score: essayGrade.score,
          maxScore: essayGrade.maxScore,
          grade: essayGrade.grade,
          feedback: essayGrade.feedback
        } : undefined
      };
      
      const response = await aiManager.generateChatResponse(newMessage.trim(), enhancedContext);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      toast.error(errorMessage);
      console.error('Chat error:', err);
      
      const errorAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `Sorry, I couldn't process your message: ${errorMessage}`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessage();
    }
  };

  const handleEssayGradingComplete = (grade: {
    score: number;
    maxScore: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    grade: string;
  }) => {
    setEssayGrade(grade);
    // Update the context with the graded score for chat
    console.log('📝 Essay grading completed:', grade);
  };

  if (!isAIAvailable) {
    return (
      <Card className="mt-4 border-orange-200 bg-orange-50">
        <CardContent className="pt-4">
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              AI explanations are not available. Please go to <strong>Settings</strong> and add an API key to enable AI features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* AI Essay Grader for Essay Questions */}
      {context.questionType === 'essay' && (
        <AIEssayGrader
          question={context.question}
          studentAnswer={context.userAnswer}
          onGradingComplete={handleEssayGradingComplete}
        />
      )}
      
      {/* Main AI Explainer Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Explainer
              {providerInfo && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {providerInfo.name}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {!explanation && (
                <Button 
                  onClick={handleGetExplanation}
                  disabled={isLoadingExplanation}
                  size="sm"
                >
                  {isLoadingExplanation ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Get Explanation
                    </>
                  )}
                </Button>
              )}
              
              {explanation && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {showChat ? 'Hide Chat' : 'Ask Questions'}
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {explanation ? (
            <div className="bg-white p-4 rounded-lg border">
              <ReactMarkdown>
                {explanation}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <Brain className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Click "Get Explanation" to analyze this question with AI</p>
              <p className="text-sm text-gray-500 mt-1">
                AI will explain the answer considering your response and the correct answer
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Chat Section */}
      {showChat && explanation && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Chat with AI
              <Badge variant="outline" className="text-green-600 border-green-600">
                Context-Aware
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Chat Messages */}
            {chatMessages.length > 0 && (
              <div className="bg-white rounded-lg border p-4 mb-4 max-h-80 overflow-y-auto space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="text-sm">
                        {message.role === 'ai' ? (
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          message.content
                        )}
                      </div>
                      <div className={`text-xs mt-1 opacity-70`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoadingChat && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Chat Input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a follow-up question about this quiz question..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 min-h-[80px]"
                disabled={isLoadingChat}
              />
              <Button
                onClick={handleSendChatMessage}
                disabled={!newMessage.trim() || isLoadingChat}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-xs text-gray-600 mt-2">
              💡 AI remembers: Question, your answer ("{context.userAnswer}"), 
              {context.questionType === 'essay' && essayGrade ? (
                <span>AI grade ({essayGrade.grade}: {essayGrade.score}/{essayGrade.maxScore})</span>
              ) : (
                <span>and correct answer ("{context.correctAnswer}")</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIExplainer;
