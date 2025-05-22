
import React from "react";
import Quiz from "@/components/quiz/Quiz";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-quiz-primary">
            Interactive Quiz Platform
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Quiz />
      </main>
      
      <footer className="bg-white border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Quiz Platform | Create and share quizzes instantly
        </div>
      </footer>
    </div>
  );
};

export default Index;
