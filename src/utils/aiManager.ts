// Simplified AI Manager - Auto-detects and uses saved API keys
import { PROVIDERS, AIProvider } from './aiConfig';
import { secureStorage } from './secureStorage';

export interface AIExplanationContext {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  questionType?: 'multiple' | 'essay';
  options?: string[];
}

class AIManager {
  private static instance: AIManager;
  private activeProvider: AIProvider | null = null;
  private activeApiKey: string | null = null;
  private activeModel: string | null = null;

  private constructor() {
    this.autoDetectProvider();
  }

  public static getInstance(): AIManager {
    if (!AIManager.instance) {
      AIManager.instance = new AIManager();
    }
    return AIManager.instance;
  }

  // Auto-detect which provider has a saved API key
  private async autoDetectProvider(): Promise<void> {
    try {
      // Check each provider for saved API keys
      for (const provider of Object.keys(PROVIDERS) as AIProvider[]) {
        const apiKey = await secureStorage.getApiKey(provider);
        if (apiKey) {
          console.log(`🔍 Found API key for ${provider}, setting as active provider`);
          this.activeProvider = provider;
          this.activeApiKey = apiKey;
          this.activeModel = PROVIDERS[provider].models[0].id;
          break; // Use the first one found
        }
      }
      
      if (!this.activeProvider) {
        console.log('⚠️ No API keys found. Please configure in settings.');
      } else {
        console.log(`✅ Active AI Provider: ${PROVIDERS[this.activeProvider].name}`);
      }
    } catch (error) {
      console.error('Failed to auto-detect AI provider:', error);
    }
  }

  // Refresh provider detection (call this after saving new API keys)
  public async refreshProvider(): Promise<void> {
    await this.autoDetectProvider();
  }

  // Check if AI is available
  public isAvailable(): boolean {
    return !!(this.activeProvider && this.activeApiKey);
  }

  // Get current provider info
  public getProviderInfo(): { name: string; model: string } | null {
    if (!this.activeProvider) return null;
    return {
      name: PROVIDERS[this.activeProvider].name,
      model: this.activeModel || 'default'
    };
  }

  // Make API request with current provider
  private async makeRequest(prompt: string): Promise<string> {
    if (!this.activeProvider || !this.activeApiKey) {
      throw new Error('No AI provider configured. Please add an API key in settings.');
    }

    const provider = PROVIDERS[this.activeProvider];
    let url: string;
    let requestBody: any;
    let headers: Record<string, string>;

    if (this.activeProvider === 'gemini') {
      url = `${provider.baseUrl}/${this.activeModel}:generateContent?key=${this.activeApiKey}`;
      headers = provider.headers(this.activeApiKey);
      requestBody = provider.formatRequest!(prompt, this.activeModel!);
    } else {
      // OpenRouter and OpenAI
      url = provider.baseUrl;
      headers = provider.headers(this.activeApiKey);
      requestBody = {
        model: this.activeModel,
        messages: [
          { role: 'system', content: 'You are a helpful educational AI assistant. Provide clear, encouraging explanations.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      };
    }

    console.log(`🤖 Making ${this.activeProvider} request...`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Parse response based on provider
    if (this.activeProvider === 'gemini') {
      return provider.parseResponse!(data);
    } else {
      return data.choices?.[0]?.message?.content || 'No response received';
    }
  }

  // Generate AI explanation based on quiz context
  public async generateExplanation(context: AIExplanationContext): Promise<string> {
    const { question, userAnswer, correctAnswer, isCorrect, questionType, options } = context;
    
    let prompt = '';
    
    if (questionType === 'essay') {
      prompt = `As an educational AI, provide a helpful explanation for this essay question:

**Question:** ${question}
**Student's Answer:** ${userAnswer}
**Expected/Ideal Answer:** ${correctAnswer}

Please provide:
1. What the student did well
2. Areas for improvement
3. Key concepts they should understand
4. Encouragement for learning

Be supportive and educational in your response.`;
    } else {
      // Multiple choice
      const optionsText = options ? `**Options:** ${options.join(', ')}` : '';
      const resultText = isCorrect ? '✅ CORRECT' : '❌ INCORRECT';
      
      prompt = `As an educational AI, explain this quiz question:

**Question:** ${question}
${optionsText}
**Student's Answer:** ${userAnswer}
**Correct Answer:** ${correctAnswer}
**Result:** ${resultText}

Please provide:
1. Why the correct answer is right
${!isCorrect ? '2. Why the student\'s answer was incorrect' : '2. Great job on getting it right!'}
3. Key concept or learning point
4. ${isCorrect ? 'Encouragement' : 'Supportive guidance for next time'}

Be clear, educational, and ${isCorrect ? 'congratulatory' : 'encouraging'}.`;
    }

    return await this.makeRequest(prompt);
  }

  // Generate chat response with context
  public async generateChatResponse(userMessage: string, context: AIExplanationContext): Promise<string> {
    const { question, userAnswer, correctAnswer } = context;
    
    const prompt = `You are helping a student understand a quiz question. Here's the context:

**Original Question:** ${question}
**Student's Answer:** ${userAnswer}
**Correct Answer:** ${correctAnswer}

**Student's Follow-up Question:** ${userMessage}

Please provide a helpful, educational response that addresses their question while staying relevant to the quiz context. Be supportive and encouraging.`;

    return await this.makeRequest(prompt);
  }

  // Save new API key and refresh provider
  public async saveApiKey(provider: AIProvider, apiKey: string): Promise<void> {
    await secureStorage.setApiKey(apiKey, provider);
    await this.refreshProvider();
    console.log(`✅ Saved API key for ${provider} and refreshed provider`);
  }
}

export const aiManager = AIManager.getInstance();
export default aiManager;
