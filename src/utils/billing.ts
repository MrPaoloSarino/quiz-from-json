// Professional Billing Integration for SaaS
export interface PricingPlan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    quizzes: number | 'unlimited';
    cloudStorage: string;
    aiQuestions: number | 'unlimited';
    exportFormats: string[];
    analytics: boolean;
    prioritySupport: boolean;
  };
  popular?: boolean;
  stripePriceId?: string;
}

export interface Subscription {
  id: string;
  plan: PricingPlan['id'];
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

export interface UserBilling {
  subscription: Subscription | null;
  billingHistory: BillingEvent[];
  paymentMethod?: PaymentMethod;
}

export interface BillingEvent {
  id: string;
  type: 'subscription_created' | 'payment_succeeded' | 'subscription_canceled' | 'upgrade' | 'downgrade';
  date: Date;
  amount?: number;
  description: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

// Pricing plans configuration
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    interval: 'month',
    features: [
      'Create unlimited quizzes',
      'AI explanations',
      'Basic analytics',
      'Export to JSON',
      'Local storage'
    ],
    limits: {
      quizzes: 'unlimited',
      cloudStorage: '50MB',
      aiQuestions: 100,
      exportFormats: ['JSON'],
      analytics: false,
      prioritySupport: false
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious learners and educators',
    price: 9.99,
    interval: 'month',
    features: [
      'Everything in Free',
      'Cloud sync across devices',
      'Advanced analytics & insights',
      'Unlimited AI interactions',
      'Export to PDF, CSV, Word',
      'Priority support',
      'Custom quiz themes',
      'Spaced repetition system'
    ],
    limits: {
      quizzes: 'unlimited',
      cloudStorage: '10GB',
      aiQuestions: 'unlimited',
      exportFormats: ['JSON', 'PDF', 'CSV', 'DOCX'],
      analytics: true,
      prioritySupport: true
    },
    popular: true,
    stripePriceId: 'price_pro_monthly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations',
    price: 29.99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Team management',
      'Advanced user roles',
      'Custom branding',
      'API access',
      'SSO integration',
      'Dedicated support',
      'Custom integrations'
    ],
    limits: {
      quizzes: 'unlimited',
      cloudStorage: '100GB',
      aiQuestions: 'unlimited',
      exportFormats: ['JSON', 'PDF', 'CSV', 'DOCX', 'SCORM'],
      analytics: true,
      prioritySupport: true
    },
    stripePriceId: 'price_enterprise_monthly'
  }
];

class BillingManager {
  private currentSubscription: Subscription | null = null;
  private billingHistory: BillingEvent[] = [];

  constructor() {
    this.loadBillingData();
  }

  private loadBillingData(): void {
    try {
      const stored = localStorage.getItem('billing_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.currentSubscription = data.subscription ? {
          ...data.subscription,
          currentPeriodStart: new Date(data.subscription.currentPeriodStart),
          currentPeriodEnd: new Date(data.subscription.currentPeriodEnd)
        } : null;
        this.billingHistory = data.billingHistory?.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        })) || [];
      }
    } catch (error) {
      console.warn('Failed to load billing data:', error);
    }
  }

  private saveBillingData(): void {
    try {
      const data = {
        subscription: this.currentSubscription,
        billingHistory: this.billingHistory
      };
      localStorage.setItem('billing_data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save billing data:', error);
    }
  }

  getCurrentPlan(): PricingPlan {
    const planId = this.currentSubscription?.plan || 'free';
    return PRICING_PLANS.find(plan => plan.id === planId) || PRICING_PLANS[0];
  }

  getSubscription(): Subscription | null {
    return this.currentSubscription;
  }

  getBillingHistory(): BillingEvent[] {
    return [...this.billingHistory].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Check if user has access to a feature
  hasFeature(feature: keyof PricingPlan['limits']): boolean {
    const plan = this.getCurrentPlan();
    return plan.limits[feature] === true || plan.limits[feature] === 'unlimited';
  }

  // Check remaining usage for limited features
  getRemainingUsage(feature: 'aiQuestions'): number | 'unlimited' {
    const plan = this.getCurrentPlan();
    const limit = plan.limits[feature];
    
    if (limit === 'unlimited') return 'unlimited';
    if (typeof limit !== 'number') return 0;
    
    // Get current usage from analytics
    const usageKey = `${feature}_usage_${new Date().getMonth()}`;
    const currentUsage = parseInt(localStorage.getItem(usageKey) || '0');
    
    return Math.max(0, limit - currentUsage);
  }

  // Track feature usage
  trackUsage(feature: 'aiQuestions', amount: number = 1): boolean {
    const remaining = this.getRemainingUsage(feature);
    
    if (remaining === 'unlimited') return true;
    if (typeof remaining === 'number' && remaining >= amount) {
      const usageKey = `${feature}_usage_${new Date().getMonth()}`;
      const currentUsage = parseInt(localStorage.getItem(usageKey) || '0');
      localStorage.setItem(usageKey, (currentUsage + amount).toString());
      return true;
    }
    
    return false;
  }

  // Simulate subscription creation (in real app, this would call Stripe)
  async createSubscription(planId: PricingPlan['id']): Promise<{ success: boolean; error?: string }> {
    try {
      if (planId === 'free') {
        // Downgrade to free
        this.currentSubscription = null;
        this.addBillingEvent({
          type: 'downgrade',
          description: 'Downgraded to Free plan'
        });
      } else {
        const plan = PRICING_PLANS.find(p => p.id === planId);
        if (!plan) {
          return { success: false, error: 'Invalid plan selected' };
        }

        // In real implementation, you would:
        // 1. Create Stripe checkout session
        // 2. Redirect to Stripe
        // 3. Handle webhook to confirm subscription
        
        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        this.currentSubscription = {
          id: `sub_${Date.now()}`,
          plan: planId,
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
          stripeSubscriptionId: `stripe_sub_${Date.now()}`
        };

        this.addBillingEvent({
          type: 'subscription_created',
          amount: plan.price,
          description: `Subscribed to ${plan.name} plan`
        });
      }

      this.saveBillingData();
      return { success: true };
    } catch (error) {
      console.error('Failed to create subscription:', error);
      return { success: false, error: 'Failed to process subscription' };
    }
  }

  // Cancel subscription
  async cancelSubscription(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentSubscription) {
        return { success: false, error: 'No active subscription to cancel' };
      }

      // In real implementation, call Stripe API to cancel subscription
      this.currentSubscription.cancelAtPeriodEnd = true;
      
      this.addBillingEvent({
        type: 'subscription_canceled',
        description: 'Subscription canceled - will end at period end'
      });

      this.saveBillingData();
      return { success: true };
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return { success: false, error: 'Failed to cancel subscription' };
    }
  }

  // Generate Stripe checkout URL (placeholder)
  async getCheckoutUrl(planId: PricingPlan['id']): Promise<string> {
    const plan = PRICING_PLANS.find(p => p.id === planId);
    if (!plan || !plan.stripePriceId) {
      throw new Error('Invalid plan or missing Stripe price ID');
    }

    // In real implementation:
    // return await stripe.checkout.sessions.create({...}).url;
    
    // For demo, return a placeholder
    return `https://checkout.stripe.com/pay/${plan.stripePriceId}?success_url=${encodeURIComponent(window.location.origin + '/billing/success')}&cancel_url=${encodeURIComponent(window.location.origin + '/billing')}`;
  }

  // Handle successful payment (would be called by webhook in real app)
  handlePaymentSuccess(subscriptionData: any): void {
    this.addBillingEvent({
      type: 'payment_succeeded',
      amount: subscriptionData.amount,
      description: `Payment successful for ${subscriptionData.planName}`
    });
    this.saveBillingData();
  }

  private addBillingEvent(event: Omit<BillingEvent, 'id' | 'date'>): void {
    const billingEvent: BillingEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date(),
      ...event
    };
    this.billingHistory.push(billingEvent);
  }

  // Get subscription status for UI
  getSubscriptionStatus(): {
    isActive: boolean;
    isPro: boolean;
    daysRemaining?: number;
    willCancel: boolean;
  } {
    if (!this.currentSubscription) {
      return { isActive: false, isPro: false, willCancel: false };
    }

    const now = new Date();
    const isActive = this.currentSubscription.status === 'active' && 
                    this.currentSubscription.currentPeriodEnd > now;
    
    const daysRemaining = Math.ceil(
      (this.currentSubscription.currentPeriodEnd.getTime() - now.getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    return {
      isActive,
      isPro: this.currentSubscription.plan !== 'free',
      daysRemaining: daysRemaining > 0 ? daysRemaining : undefined,
      willCancel: this.currentSubscription.cancelAtPeriodEnd
    };
  }

  // Get upgrade recommendations based on usage
  getUpgradeRecommendations(): string[] {
    const recommendations: string[] = [];
    const plan = this.getCurrentPlan();
    
    if (plan.id === 'free') {
      const aiUsage = this.getRemainingUsage('aiQuestions');
      if (typeof aiUsage === 'number' && aiUsage < 10) {
        recommendations.push('You\'re running low on AI questions. Upgrade to Pro for unlimited AI interactions.');
      }
      
      recommendations.push('Unlock cloud sync to access your quizzes on any device.');
      recommendations.push('Get detailed analytics to track your learning progress.');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const billing = new BillingManager();

// Convenience functions
export const getCurrentPlan = () => billing.getCurrentPlan();
export const hasFeature = (feature: keyof PricingPlan['limits']) => billing.hasFeature(feature);
export const getRemainingUsage = (feature: 'aiQuestions') => billing.getRemainingUsage(feature);
export const trackUsage = (feature: 'aiQuestions', amount?: number) => billing.trackUsage(feature, amount);
export const getSubscriptionStatus = () => billing.getSubscriptionStatus();
export const getUpgradeRecommendations = () => billing.getUpgradeRecommendations(); 