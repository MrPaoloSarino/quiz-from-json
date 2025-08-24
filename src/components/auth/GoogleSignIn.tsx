import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleDriveUserStorage, UserProfile } from '@/utils/googleDriveStorage';
import { toast } from 'sonner';
import { Chrome, Shield, Cloud, Users, Sparkles, Brain, Zap, Play, Settings, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import StorageManager from '@/utils/storageManager';

interface GoogleSignInProps {
  onSignIn: (user: UserProfile) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSignIn }) => {
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    // Check if Google APIs are properly configured
    const checkApiAvailability = async () => {
      console.log('🔍 [DEBUG] Checking Google API availability...');
      const available = await GoogleDriveUserStorage.initializeGoogleClient();
      console.log('🔍 [DEBUG] Google API available:', available);
      setApiAvailable(available);
      
      if (!available) {
        console.log('ℹ️ [DEBUG] Running in offline mode - Google APIs not configured or failed to initialize');
      }
    };
    checkApiAvailability();
  }, []);

  // If APIs aren't available, show enhanced offline mode with helpful guidance
  if (!apiAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              <div className="flex items-center justify-center gap-3">
                <img src="/icon (1).svg" alt="Cerebrum Logo" className="w-8 h-8" />
                Cerebrum
              </div>
            </CardTitle>
            <p className="text-gray-600 mt-3 text-lg">
              Google APIs not configured - Running in Local Mode
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Current Capabilities */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">What You Can Do Right Now</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Create unlimited quizzes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Get AI explanations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Export/import quiz files</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Use all AI features</span>
                </div>
              </div>
            </div>

            {/* Missing Features */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cloud className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Unlock Cloud Features</h3>
              </div>
              <p className="text-blue-800 mb-4">
                To get the full experience with cloud sync, progress tracking, and multi-device access, 
                you'll need to configure Google APIs (it's free!).
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-black border-black hover:bg-black/10"
                  onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Cloud Console
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-black border-black hover:bg-black/10"
                  onClick={() => window.open('/GOOGLE_SETUP.md', '_blank')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Setup Guide
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => onSignIn({ 
                  id: 'offline-user', 
                  name: 'Offline User', 
                  email: 'offline@example.com',
                  picture: ''
                })}
                className="h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Creating Quizzes
              </Button>
              
              <Button 
                variant="outline" 
                className="h-14 border-2 border-black text-black hover:bg-black/10 font-medium"
                onClick={() => window.open('https://github.com/yourusername/quiz-from-json#setup', '_blank')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Setup Instructions
              </Button>
            </div>

            {/* Quick Setup Preview */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Setup (5 minutes):</h4>
              <ol className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span>Create a Google Cloud project (free)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span>Enable Google Drive API</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>Copy your API keys to environment variables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span className="font-medium">Enjoy unlimited cloud sync!</span>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const user = await StorageManager.signIn();
      if (user) {
        onSignIn(user);
      } else {
        throw new Error('Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
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
            <div className="flex items-center justify-center gap-3">
              <img src="/icon (1).svg" alt="Cerebrum Logo" className="w-8 h-8" />
              Cerebrum
            </div>
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
            className="w-full bg-white text-black border-2 border-black hover:bg-black/10 hover:border-black flex items-center justify-center gap-3 h-14 text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
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