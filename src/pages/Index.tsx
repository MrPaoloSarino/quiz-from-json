import React, { useState } from "react";
import Quiz from "@/components/quiz/Quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, Brain, Zap, ArrowRight, CheckCircle, MessageSquare, Shuffle, BookOpen, X } from "lucide-react";

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-600/40 via-emerald-400/30 to-teal-500/40"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-emerald-300/20 via-green-500/25 to-teal-400/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green-300/40 to-emerald-400/40 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-40 h-40 bg-gradient-to-br from-emerald-300/40 to-teal-400/40 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-36 h-36 bg-gradient-to-br from-teal-300/40 to-green-400/40 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-green-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4" />
              AI-Powered Quiz Platform
            </div>

            {/* What's New Badge - Centered and Clickable */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowWhatsNew(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20 hover:from-purple-600/90 hover:to-pink-600/90 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <span className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></span>
                <span className="w-2 h-2 bg-yellow-300 rounded-full absolute"></span>
                <span className="ml-2">What's New: AI Arguments & Study Prescriptions!</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Create{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Interactive
              </span>
              <br />
              Quizzes Instantly
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Transform your JSON data into engaging quizzes with AI-powered feedback. 
              Perfect for education, training, and assessment.
            </p>

            {/* CTA Button - Single Button Now */}
            <div className="flex justify-center mb-12">
              <Button
                onClick={() => setShowQuiz(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                Start Creating Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-white/95 backdrop-blur-md border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Feedback</h3>
                  <p className="text-gray-600">Get intelligent feedback powered by OpenAI, Gemini, or OpenRouter</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-md border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">JSON Input</h3>
                  <p className="text-gray-600">Simply paste your JSON quiz data and start immediately</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-md border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-xl">
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

      {/* What's New Modal */}
      <Dialog open={showWhatsNew} onOpenChange={setShowWhatsNew}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              What's New - Latest Updates!
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Discover the exciting new features we've added to enhance your quiz experience.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* AI Arguments Feature */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">🗣️ Argue with AI</h3>
                  <p className="text-blue-800 text-sm mb-2">
                    Challenge the AI's reasoning and engage in meaningful debates about quiz answers.
                  </p>
                  <ul className="text-blue-700 text-xs space-y-1">
                    <li>• Interactive chat interface for questioning AI responses</li>
                    <li>• Develop critical thinking through AI arguments</li>
                    <li>• Real-time contextual discussions about quiz topics</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Question Randomization */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Shuffle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">🎲 Question Randomization</h3>
                  <p className="text-green-800 text-sm mb-2">
                    Shuffle your quiz questions with one click for varied practice sessions.
                  </p>
                  <ul className="text-green-700 text-xs space-y-1">
                    <li>• Prevent memorization of question order</li>
                    <li>• Enhanced learning through varied practice</li>
                    <li>• One-click randomization before starting</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Study Prescriptions */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">📋 AI Study Prescriptions</h3>
                  <p className="text-purple-800 text-sm mb-2">
                    Get personalized study recommendations based on your quiz performance.
                  </p>
                  <ul className="text-purple-700 text-xs space-y-1">
                    <li>• Comprehensive performance analysis</li>
                    <li>• Tailored study plans with specific timelines</li>
                    <li>• Priority focus areas and practice recommendations</li>
                    <li>• Success metrics for tracking improvement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Enhanced Experience */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">⚡ Enhanced Experience</h3>
                  <p className="text-orange-800 text-sm mb-2">
                    Improved state management and user interface for smoother interactions.
                  </p>
                  <ul className="text-orange-700 text-xs space-y-1">
                    <li>• Better handling of essay answers and AI responses</li>
                    <li>• Cleaner transitions between questions</li>
                    <li>• Modern messaging-style chat interface</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => {
                setShowWhatsNew(false);
                setShowQuiz(true);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg"
            >
              Try These Features Now!
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
