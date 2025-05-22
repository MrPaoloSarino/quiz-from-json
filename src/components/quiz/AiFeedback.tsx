
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface AiFeedbackProps {
  feedback: string | null;
  loading: boolean;
}

const AiFeedback: React.FC<AiFeedbackProps> = ({ feedback, loading }) => {
  if (loading) {
    return (
      <Card className="mt-4 border-dashed border-gray-300">
        <CardContent className="pt-4">
          <div className="flex items-center justify-center p-4">
            <Spinner className="h-8 w-8 text-quiz-primary" />
            <span className="ml-2 text-sm text-gray-500">Getting AI feedback...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!feedback) return null;

  return (
    <Card className="mt-4 bg-blue-50 border-blue-200">
      <CardContent className="pt-4">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 12c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8Z"></path>
            <path d="M14.5 9c0 .8-.7 1.5-1.5 1.5"></path>
            <path d="M9.5 9c0 .8.7 1.5 1.5 1.5"></path>
            <path d="M9 15c.83.67 1.87 1 3 1s2.17-.33 3-1"></path>
          </svg>
          AI Feedback
        </h3>
        <div className="text-sm text-gray-700">{feedback}</div>
      </CardContent>
    </Card>
  );
};

export default AiFeedback;
