import React, { useState } from "react";
import Quiz from "@/components/quiz/Quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Zap, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  if (showQuiz) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">
              Interactive Quiz Platform
            </h1>
            <Button
              variant="ghost"
              onClick={() => setShowQuiz(false)}
              className="text-green-600 hover:text-green-700"
            >
              ← Back to Home
            </Button>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Quiz />
        </main>
        
        <footer className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-t py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Quiz Platform | Create and share quizzes instantly
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/20"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-green-600/10 via-transparent to-emerald-600/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-teal-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Quiz Platform
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Create{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Interactive
              </span>
              <br />
              Quizzes Instantly
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your JSON data into engaging quizzes with AI-powered feedback. 
              Perfect for education, training, and assessment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={() => setShowQuiz(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                Start Creating Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-xl"
                size="lg"
              >
                View Demo
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Feedback</h3>
                  <p className="text-gray-600">Get intelligent feedback powered by OpenAI, Gemini, or OpenRouter</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">JSON Input</h3>
                  <p className="text-gray-600">Simply paste your JSON quiz data and start immediately</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
                  <p className="text-gray-600">Track scores and get detailed performance analytics</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-t border-green-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">
            &copy; {new Date().getFullYear()} Interactive Quiz Platform
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>Powered by AI</span>
            <span>•</span>
            <span>Open Source</span>
            <span>•</span>
            <span>Free to Use</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
