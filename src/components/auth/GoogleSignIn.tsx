import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleDriveUserStorage, UserProfile } from '@/utils/googleDriveStorage';
import { toast } from 'sonner';
import { Chrome, Shield, Cloud, Users, Sparkles, Brain, Zap } from 'lucide-react';

interface GoogleSignInProps {
  onSignIn: (user: UserProfile) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSignIn }) => {
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    // Check if Google APIs are properly configured
    const checkApiAvailability = async () => {
      const available = await GoogleDriveUserStorage.initializeGoogleClient();
      setApiAvailable(available);
    };
    checkApiAvailability();
  }, []);

  // If APIs aren't available, show offline mode message
  if (!apiAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">QuizMaster AI</CardTitle>
            <p className="text-gray-600">Running in offline mode</p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Google APIs not configured. You can still:
              </p>
              <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                <li>• Create and take quizzes</li>
                <li>• Export/import quiz files</li>
                <li>• Use AI explanations</li>
              </ul>
            </div>
            <Button 
              onClick={() => onSignIn({ 
                id: 'offline-user', 
                name: 'Offline User', 
                email: 'offline@example.com' 
              })}
              className="w-full"
            >
              Continue Offline
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const user = await GoogleDriveUserStorage.signIn();
      if (user) {
        onSignIn(user);
        toast.success(`Welcome back, ${user.name}! 🎉`);
      } else {
        toast.error('Sign-in was cancelled');
      }
    } catch (error) {
      console.error('Sign-in failed:', error);
      toast.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            QuizMaster AI
          </CardTitle>
          <p className="text-gray-600 mt-3 text-lg">
            Your personal AI-powered learning companion
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
              <Cloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">Cloud Sync</p>
              <p className="text-xs text-blue-700">Access anywhere</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">AI Powered</p>
              <p className="text-xs text-purple-700">Smart feedback</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Private</p>
              <p className="text-xs text-green-700">Your data only</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl text-center">
              <Users className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-pink-900">Shareable</p>
              <p className="text-xs text-pink-700">Collaborate easily</p>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Your quizzes sync automatically across all devices</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Data stored securely in your personal Google Drive</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>AI provides personalized learning insights</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span>Create unlimited quizzes and track your progress</span>
            </div>
          </div>

          {/* Sign In Button */}
          <Button 
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-3 h-14 text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            size="lg"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          {/* Privacy Notice */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              <strong>Your Privacy Matters:</strong> By signing in, you agree to our Terms of Service and Privacy Policy. 
              Your data remains completely private and is stored only in your personal Google Drive. 
              We never access or share your information with third parties.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleSignIn; 