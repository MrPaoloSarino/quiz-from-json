import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Check, 
  X, 
  Star, 
  Users, 
  Zap, 
  Shield, 
  ArrowRight,
  Sparkles,
  Heart,
  TrendingUp
} from 'lucide-react';
import { PRICING_PLANS, billing } from '@/utils/billing';
import { analytics } from '@/utils/saasAnalytics';

interface UpgradePromptProps {
  trigger: 'ai_limit' | 'analytics' | 'cloud_sync' | 'export' | 'general';
  onClose?: () => void;
  onUpgrade?: (planId: string) => void;
  compact?: boolean;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ 
  trigger, 
  onClose, 
  onUpgrade, 
  compact = false 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('pro');
  const [loading, setLoading] = useState(false);

  const currentPlan = billing.getCurrentPlan();
  const remainingAI = billing.getRemainingUsage('aiQuestions');

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    try {
      analytics.trackSubscriptionIntent('interested', trigger);
      
      if (onUpgrade) {
        onUpgrade(planId);
      } else {
        const result = await billing.createSubscription(planId as any);
        if (result.success) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    analytics.trackSubscriptionIntent('dismissed', trigger);
    if (onClose) onClose();
  };

  const getTriggerContent = () => {
    switch (trigger) {
      case 'ai_limit':
        return {
          title: 'AI Questions Limit Reached',
          description: `You've used ${typeof remainingAI === 'number' ? 100 - remainingAI : 0} of your 100 monthly AI questions.`,
          urgency: 'high',
          primaryBenefit: 'Unlimited AI interactions'
        };
      case 'analytics':
        return {
          title: 'Unlock Advanced Analytics',
          description: 'Get detailed insights into your learning progress and performance trends.',
          urgency: 'medium',
          primaryBenefit: 'Advanced analytics & insights'
        };
      default:
        return {
          title: 'Upgrade to Pro',
          description: 'Unlock all premium features and take your learning to the next level.',
          urgency: 'medium',
          primaryBenefit: 'All premium features'
        };
    }
  };

  const content = getTriggerContent();
  
  if (compact) {
    return (
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm">{content.title}</h4>
              <p className="text-xs text-gray-600 truncate">{content.primaryBenefit}</p>
            </div>
            <Button 
              size="sm" 
              onClick={() => handleUpgrade('pro')}
              disabled={loading}
            >
              Upgrade
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="relative border-2 border-blue-500 shadow-lg">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-600 text-white px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </div>
          <CardHeader className="pb-4 pt-6">
            <CardTitle className="text-center">
              <div className="text-lg font-bold text-gray-900">Pro</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">$9.99</div>
              <div className="text-sm text-gray-500">/month</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PRICING_PLANS[1].features.slice(0, 6).map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
            <Button 
              className="w-full mt-4"
              onClick={() => handleUpgrade('pro')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Upgrade to Pro'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-center">
              <div className="text-lg font-bold text-gray-900">Free</div>
              <div className="text-sm text-gray-500">Current Plan</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">$0</div>
              <div className="text-sm text-gray-500">/month</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PRICING_PLANS[0].features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 opacity-50">
              <X className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Advanced analytics</span>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <X className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Cloud sync</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        {onClose && (
          <Button variant="ghost" onClick={handleDismiss}>
            Maybe Later
          </Button>
        )}
        <Button 
          size="lg"
          onClick={() => handleUpgrade('pro')}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? 'Processing...' : 'Start Pro Trial'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default UpgradePrompt;
