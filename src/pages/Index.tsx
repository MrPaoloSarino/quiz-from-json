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
              Virtuoso
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
            &copy; {new Date().getFullYear()} Virtuoso | Intelligent learning made simple
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative container mx-auto px-4 py-12 lg:py-16">
          <div className="text-center max-w-3xl mx-auto">
            {/* Simple badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Learning
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Smart Learning with{" "}
              <span className="text-blue-600">AI</span>
            </h1>

            {/* Simple subtitle */}
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Get instant AI feedback and explanations for your quizzes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Button
                onClick={() => setShowQuiz(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium rounded-lg min-w-[180px]"
                size="lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Start Quiz
              </Button>
              <Button
                onClick={() => setShowWhatsNew(true)}
                className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 font-medium rounded-lg min-w-[180px]"
              >
                What's New
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="border-slate-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Feedback</h3>
                  <p className="text-sm text-slate-600">Instant explanations for every answer</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:border-purple-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Chat</h3>
                  <p className="text-sm text-slate-600">Ask questions about any topic</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:border-green-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Easy Setup</h3>
                  <p className="text-sm text-slate-600">Upload JSON and start instantly</p>
                </CardContent>
              </Card>
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
              Virtuoso
            </h3>
            <p className="text-slate-400 mb-6">
              Empowering learners worldwide with intelligent, AI-driven educational experiences.
            </p>
            <div className="flex justify-center space-x-6 text-slate-400">
              <span>&copy; {new Date().getFullYear()} Virtuoso</span>
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
