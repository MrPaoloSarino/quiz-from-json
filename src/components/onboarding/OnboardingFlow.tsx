import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  Palette, 
  Volume2, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Eye,
  Ear,
  Hand,
  Zap,
  Heart,
  BookOpen,
  Trophy,
  Users,
  Clock,
  Star
} from 'lucide-react';

interface OnboardingData {
  name: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | null;
  aiPersonality: 'encouraging' | 'direct' | 'detailed' | null;
  goals: string[];
  preferences: {
    soundEnabled: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    learningStyle: null,
    aiPersonality: null,
    goals: [],
    preferences: {
      soundEnabled: true,
      theme: 'auto'
    }
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const learningStyles = [
    {
      id: 'visual' as const,
      name: 'Visual Learner',
      description: 'Learn best with images, diagrams, and visual aids',
      icon: Eye,
      benefits: ['Charts & graphs', 'Color-coded content', 'Visual progress tracking']
    },
    {
      id: 'auditory' as const,
      name: 'Auditory Learner',
      description: 'Learn best through listening and discussion',
      icon: Ear,
      benefits: ['Sound effects', 'Audio feedback', 'Verbal explanations']
    },
    {
      id: 'kinesthetic' as const,
      name: 'Hands-On Learner',
      description: 'Learn best through practice and movement',
      icon: Hand,
      benefits: ['Interactive quizzes', 'Drag & drop', 'Practice-focused']
    }
  ];

  const aiPersonalities = [
    {
      id: 'encouraging' as const,
      name: 'Encouraging Coach',
      description: 'Supportive, motivational, celebrates your progress',
      icon: Heart,
      example: '"Great job! You\'re making excellent progress. Keep it up!"'
    },
    {
      id: 'direct' as const,
      name: 'Direct Tutor',
      description: 'Straightforward, efficient, focuses on facts',
      icon: Zap,
      example: '"Incorrect. The correct answer is B. Here\'s why..."'
    },
    {
      id: 'detailed' as const,
      name: 'Detailed Professor',
      description: 'Thorough explanations, context, deeper insights',
      icon: BookOpen,
      example: '"Let me explain the reasoning behind this concept in detail..."'
    }
  ];

  const goalOptions = [
    { id: 'academic', name: 'Academic Excellence', icon: Trophy, description: 'Improve grades and test scores' },
    { id: 'professional', name: 'Professional Growth', icon: Target, description: 'Advance career and skills' },
    { id: 'personal', name: 'Personal Learning', icon: Star, description: 'Learn for curiosity and fun' },
    { id: 'certification', name: 'Certification Prep', icon: CheckCircle, description: 'Prepare for certifications' },
    { id: 'social', name: 'Group Learning', icon: Users, description: 'Learn with friends and colleagues' },
    { id: 'daily', name: 'Daily Habit', icon: Clock, description: 'Build consistent learning routine' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.name.trim().length >= 2;
      case 2: return data.learningStyle !== null;
      case 3: return data.aiPersonality !== null;
      case 4: return data.goals.length > 0;
      case 5: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Cerebrum!</h2>
              <p className="text-gray-600 text-lg">Let's personalize your learning experience</p>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">What should we call you?</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
              <p className="text-sm text-gray-500">This helps us create a personalized experience just for you.</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your learning style?</h2>
              <p className="text-gray-600">This helps us customize content delivery for maximum effectiveness</p>
            </div>
            
            <div className="grid gap-4">
              {learningStyles.map((style) => {
                const Icon = style.icon;
                const isSelected = data.learningStyle === style.id;
                
                return (
                  <Card 
                    key={style.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                        : 'hover:shadow-md border-gray-200'
                    }`}
                    onClick={() => setData(prev => ({ ...prev, learningStyle: style.id }))}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{style.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{style.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {style.benefits.map((benefit) => (
                              <Badge key={benefit} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your AI assistant personality</h2>
              <p className="text-gray-600">Your AI will adapt its communication style to match your preference</p>
            </div>
            
            <div className="grid gap-4">
              {aiPersonalities.map((personality) => {
                const Icon = personality.icon;
                const isSelected = data.aiPersonality === personality.id;
                
                return (
                  <Card 
                    key={personality.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200' 
                        : 'hover:shadow-md border-gray-200'
                    }`}
                    onClick={() => setData(prev => ({ ...prev, aiPersonality: personality.id }))}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{personality.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{personality.description}</p>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm italic text-gray-700">{personality.example}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-purple-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your learning goals?</h2>
              <p className="text-gray-600">Select all that apply - we'll track your progress toward these goals</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalOptions.map((goal) => {
                const Icon = goal.icon;
                const isSelected = data.goals.includes(goal.id);
                
                return (
                  <Card 
                    key={goal.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 ring-green-500 bg-green-50 border-green-200' 
                        : 'hover:shadow-md border-gray-200'
                    }`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{goal.name}</h3>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set, {data.name}! 🎉</h2>
              <p className="text-gray-600">Here's what we've personalized for you:</p>
            </div>
            
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Learning Style</h3>
                      <p className="text-sm text-gray-600">
                        {learningStyles.find(s => s.id === data.learningStyle)?.name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-purple-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">AI Personality</h3>
                      <p className="text-sm text-gray-600">
                        {aiPersonalities.find(p => p.id === data.aiPersonality)?.name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Learning Goals</h3>
                      <p className="text-sm text-gray-600">
                        {data.goals.length} goals selected
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Ready to start learning!</h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    Your personalized experience is ready. You can always change these preferences later in settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-gray-500">
              Skip for now
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        
        <CardContent className="space-y-8">
          {renderStep()}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow; 