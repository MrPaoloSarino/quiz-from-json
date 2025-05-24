import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import AiChat from "./AiChat";

interface AiFeedbackProps {
  feedback: string | null;
  loading: boolean;
  error?: string | null;
  onSendChatMessage?: (message: string) => Promise<string>;
}

const AiFeedback: React.FC<AiFeedbackProps> = ({ 
  feedback, 
  loading, 
  error, 
  onSendChatMessage 
}) => {
  const [showChat, setShowChat] = useState(false);

  if (loading) {
    return (
      <Card className="mt-4 border-dashed border-green-300">
        <CardContent className="pt-4">
          <div className="flex items-center justify-center p-4">
            <Spinner className="h-8 w-8 text-quiz-primary" />
            <span className="ml-2 text-sm text-green-500">Getting AI feedback...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4 bg-red-50 border-red-200">
        <CardContent className="pt-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium mb-1">AI Feedback Error</h3>
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-xs text-green-500 mt-2">Please check your API key or try again later.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!feedback) return null;

  return (
    <>
      <Card className="mt-4 bg-green-50 border-green-200">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 12c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8Z"></path>
                <path d="M14.5 9c0 .8-.7 1.5-1.5 1.5"></path>
                <path d="M9.5 9c0 .8.7 1.5 1.5 1.5"></path>
                <path d="M9 15c.83.67 1.87 1 3 1s2.17-.33 3-1"></path>
              </svg>
              AI Feedback
            </h3>
            {onSendChatMessage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className="text-xs"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                {showChat ? 'Hide Argument' : 'Argue with AI'}
              </Button>
            )}
          </div>
          <div className="text-sm text-green-700">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {showChat && onSendChatMessage && (
        <AiChat
          initialFeedback={feedback}
          onSendMessage={onSendChatMessage}
          isLoading={false}
        />
      )}
    </>
  );
};

export default AiFeedback;
