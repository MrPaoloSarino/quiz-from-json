import React from "react";
import Quiz from "@/components/quiz/Quiz";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card border-b py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-primary">
            Interactive Quiz Platform
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Quiz />
      </main>
      
      <footer className="bg-card border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Quiz Platform | Create and share quizzes instantly
        </div>
      </footer>
    </div>
  );
};

export default Index;
