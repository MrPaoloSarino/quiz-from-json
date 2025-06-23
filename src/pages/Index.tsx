import React, { useState } from "react";
import Quiz from "@/components/quiz/Quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Sparkles, 
  Brain, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  MessageSquare, 
  Shuffle, 
  BookOpen, 
  Play,
  FileText,
  Users,
  Trophy,
  Lightbulb,
  Download,
  Upload
} from "lucide-react";

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  if (showQuiz) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b py-4 backdrop-blur-sm">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              QuizMaster AI
            </h1>
            <Button
              variant="ghost"
              onClick={() => setShowQuiz(false)}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Home
            </Button>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Quiz />
        </main>
        
        <footer className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 border-t py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} QuizMaster AI | Intelligent learning made simple
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Modern badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg border border-white/30">
              <Sparkles className="w-4 h-4" />
              Next-Gen AI-Powered Learning
            </div>

            {/* What's New Badge */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setShowWhatsNew(true)}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-sm font-medium backdrop-blur-md border border-white/20 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-xl hover:shadow-2xl"
              >
                <div className="relative">
                  <span className="w-3 h-3 bg-yellow-300 rounded-full animate-ping"></span>
                  <span className="w-3 h-3 bg-yellow-300 rounded-full absolute inset-0"></span>
                </div>
                <span>New: Enhanced AI Explanations & Chat!</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl lg:text-8xl font-bold text-slate-900 mb-8 leading-tight">
              Learn Smarter with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-5xl lg:text-7xl">Quizzes</span>
            </h1>

            {/* Modern subtitle */}
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your learning experience with intelligent quizzes, instant AI feedback, 
              and personalized explanations that adapt to your learning style.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                onClick={() => setShowQuiz(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
                size="lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Start Learning Now
              </Button>
              <Button
                variant="outline"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 min-w-[200px]"
                size="lg"
              >
                <FileText className="mr-2 w-5 h-5" />
                View Demo
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-white/90 backdrop-blur-md border-white/50 hover:border-blue-200 transition-all duration-300 hover:shadow-xl group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Smart AI Feedback</h3>
                  <p className="text-slate-600 leading-relaxed">Get personalized explanations and detailed feedback powered by advanced AI models</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-md border-white/50 hover:border-purple-200 transition-all duration-300 hover:shadow-xl group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Interactive Chat</h3>
                  <p className="text-slate-600 leading-relaxed">Ask follow-up questions and get instant answers from our AI tutor</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-md border-white/50 hover:border-pink-200 transition-all duration-300 hover:shadow-xl group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Setup</h3>
                  <p className="text-slate-600 leading-relaxed">Simply paste your JSON quiz data or upload a file and start learning immediately</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative py-16 bg-white/50 backdrop-blur-md border-y border-white/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
                <div className="text-slate-600">Questions Answered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-slate-600">Learning Improvement</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-600 mb-2">5k+</div>
                <div className="text-slate-600">Happy Learners</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                <div className="text-slate-600">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's New Modal */}
      <Dialog open={showWhatsNew} onOpenChange={setShowWhatsNew}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              What's New - Latest Updates!
            </DialogTitle>
            <DialogDescription className="text-lg text-slate-600">
              Discover the exciting new features we've added to enhance your learning experience.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 mt-6">
            {/* Enhanced AI Explanations */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">🧠 Enhanced AI Explanations</h3>
                  <p className="text-blue-800 mb-3">
                    Get comprehensive, personalized explanations for every question with detailed breakdowns.
                  </p>
                  <ul className="text-blue-700 text-sm space-y-2">
                    <li>• Detailed explanations for both correct and incorrect answers</li>
                    <li>• Personalized feedback based on your specific response</li>
                    <li>• Key concepts and learning tips for better understanding</li>
                    <li>• Essay scoring with detailed improvement suggestions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Chat */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-purple-900 mb-3">💬 Interactive AI Chat</h3>
                  <p className="text-purple-800 mb-3">
                    Ask follow-up questions and get instant, contextual answers from our AI tutor.
                  </p>
                  <ul className="text-purple-700 text-sm space-y-2">
                    <li>• Real-time chat with AI for any question clarifications</li>
                    <li>• Context-aware responses that remember your quiz progress</li>
                    <li>• Ask for alternative explanations or learning strategies</li>
                    <li>• Get tips for remembering concepts and avoiding mistakes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Minimal Sounds */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 mb-3">🎵 Refined Audio Experience</h3>
                  <p className="text-green-800 mb-3">
                    Enjoy a more focused learning experience with subtle, non-intrusive audio feedback.
                  </p>
                  <ul className="text-green-700 text-sm space-y-2">
                    <li>• Minimal sound effects that don't distract from learning</li>
                    <li>• Gentle audio cues for correct and incorrect answers</li>
                    <li>• Full volume control and mute options</li>
                    <li>• Smooth fade-out effects for better user experience</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* File Sharing */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-orange-900 mb-3">📁 Easy Quiz Sharing</h3>
                  <p className="text-orange-800 mb-3">
                    Share quizzes effortlessly with improved file export and import capabilities.
                  </p>
                  <ul className="text-orange-700 text-sm space-y-2">
                    <li>• Export quizzes as shareable JSON files</li>
                    <li>• Import quizzes from files with one click</li>
                    <li>• Support for unlimited question sizes</li>
                    <li>• Cross-device compatibility for seamless sharing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => {
                setShowWhatsNew(false);
                setShowQuiz(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold"
            >
              Try These Features Now!
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              QuizMaster AI
            </h3>
            <p className="text-slate-400 mb-6">
              Empowering learners worldwide with intelligent, AI-driven educational experiences.
            </p>
            <div className="flex justify-center space-x-6 text-slate-400">
              <span>&copy; {new Date().getFullYear()} QuizMaster AI</span>
              <span>•</span>
              <span>Made with ❤️ for learners</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
