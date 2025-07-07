// Centralized AI Service for Quiz System
import { API_CONFIG, PROVIDERS, AIProvider, GeminiModel } from './aiConfig';
import { loadSettings, saveSettings } from './aiSettings';
import { secureStorage } from './secureStorage';

class AIService {
  private static instance: AIService;
  private rateLimitCalls = 0;
  private lastRateLimitReset = Date.now();
  private readonly RATE_LIMIT = { windowMs: 60000, maxCalls: 40 };
  private currentProvider: AIProvider = 'openrouter';
  private currentModel: string = 'deepseek-chat-v3';
  private apiKey: string = '';
  private settingsLoaded = false;

  private constructor() {
    // Load settings on instantiation
    this.loadSettings().catch(console.error);
    setInterval(() => {
      this.rateLimitCalls = 0;
      this.lastRateLimitReset = Date.now();
    }, this.RATE_LIMIT.windowMs);
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async loadSettings(): Promise<void> {
    try {
      const { settings, apiKey } = await loadSettings();
      this.currentProvider = settings.provider || 'openrouter';
      this.currentModel = settings.model || API_CONFIG[this.currentProvider].defaultModel;
      this.apiKey = apiKey || '';
      this.settingsLoaded = true;
    } catch (error) {
      console.error('Failed to load AI settings:', error);
    }
  }

  private async ensureSettingsLoaded(): Promise<void> {
    // Always reload API key from secureStorage before each request
    const secureApiKey = await secureStorage.getApiKey(this.currentProvider);
    this.apiKey = secureApiKey || '';
    if (!this.settingsLoaded) {
      await this.loadSettings();
    }
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    if (now - this.lastRateLimitReset > this.RATE_LIMIT.windowMs) {
      this.rateLimitCalls = 0;
      this.lastRateLimitReset = now;
    }
    if (this.rateLimitCalls >= this.RATE_LIMIT.maxCalls) {
      const waitTime = Math.ceil((this.lastRateLimitReset + this.RATE_LIMIT.windowMs - now) / 1000);
      throw new Error(`Rate limit exceeded. Please try again in ${waitTime} seconds.`);
    }
    this.rateLimitCalls++;
  }

  private async makeRequest(endpoint: string, body: any, provider: AIProvider = this.currentProvider) {
    await this.ensureSettingsLoaded();
    await this.checkRateLimit();
    
    if (!this.apiKey) {
      console.warn('API key not configured. Using fallback evaluation method.');
      return this.createFallbackResponse(endpoint, body);
    }
    
    const providerConfig = PROVIDERS[provider];
    let url: string;
    let requestBody: any;
    let headers: Record<string, string>;
    
    if (provider === 'gemini') {
      // Gemini uses a different URL pattern
      url = `${providerConfig.baseUrl}/${this.currentModel}:${endpoint}?key=${this.apiKey}`;
      headers = providerConfig.headers(this.apiKey);
      
      // Use the formatRequest function from PROVIDERS config
      if (providerConfig.formatRequest) {
        const prompt = body.contents?.[0]?.parts?.[0]?.text || body.prompt || '';
        requestBody = providerConfig.formatRequest(prompt, this.currentModel);
      } else {
        requestBody = body;
      }
    } else {
      // OpenRouter and OpenAI use standard chat completions format
      url = providerConfig.baseUrl;
      headers = providerConfig.headers(this.apiKey);
      requestBody = body;
    }
    
    console.log(`🔄 Making ${provider} API request to:`, url);
    console.log('📝 Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `${provider} API request failed with status ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage += `: ${errorData.error?.message || errorData.message || errorText}`;
      } catch {
        errorMessage += `: ${errorText}`;
      }
      
      console.error('❌ API Error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log(`✅ ${provider} API response:`, JSON.stringify(data, null, 2));
    
    // Normalize response format across providers
    if (provider === 'gemini') {
      const content = PROVIDERS.gemini.parseResponse?.(data) || data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return {
        choices: [{
          message: {
            content
          }
        }]
      };
    }
    
    return data;
  }

  public async generateQuestions(topic: string, numQuestions: number = 5): Promise<{ question: string; options: string[]; answer: string; explanation?: string; difficulty?: string; category?: string; tags?: string[]; }[]> {
    const prompt = `Generate ${numQuestions} quiz questions about ${topic}. Each question should have:
    - A clear question
    - 4 possible options (A, B, C, D)
    - The correct answer
    - A brief explanation
    - Difficulty level (easy/medium/hard)
    - Relevant tags
    
    Format as JSON array of objects with these fields:
    [{"question": "...", "options": ["...", "..."], "answer": "...", "explanation": "...", "difficulty": "...", "tags": ["..."]}]`;

    let requestBody: any;
    
    if (this.currentProvider === 'gemini') {
      requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
      };
    } else {
      // OpenRouter and OpenAI format
      requestBody = {
        model: this.currentModel,
        messages: [
          { role: 'system', content: 'You are an expert quiz generator. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.7
      };
    }

    const response = await this.makeRequest('generateContent', requestBody);

    try {
      // Response is already normalized by makeRequest
      const content = response.choices?.[0]?.message?.content || '[]';
      
      // Clean up the content to extract JSON
      let jsonContent = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const questions = JSON.parse(jsonContent);
      if (!Array.isArray(questions)) {
        throw new Error('Invalid response format from AI - expected array');
      }
      
      // Validate questions structure
      const validQuestions = questions.filter(q => 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length >= 2 && 
        q.answer
      );
      
      if (validQuestions.length === 0) {
        throw new Error('No valid questions generated');
      }
      
      return validQuestions;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw response:', response);
      throw new Error('Failed to generate questions. Please try again.');
    }
  }

  public async evaluateAnswer(question: string, userAnswer: string, correctAnswer: string): Promise<{
    correct: boolean;
    feedback: string;
    explanation?: string;
  }> {
    const prompt = `Evaluate this answer to the question:
    Question: ${question}
    Correct Answer: ${correctAnswer}
    User's Answer: ${userAnswer}
    
    Provide:
    1. Is the answer correct? (true/false)
    2. Brief feedback (1-2 sentences)
    3. Explanation (2-3 sentences)
    
    Format as JSON: {"correct": boolean, "feedback": "...", "explanation": "..."}`;

    const response = await this.makeRequest('generateContent', {
      contents: [{ parts: [{ text: prompt }] }]
    });

    try {
      let content: string;
      if (this.currentProvider === 'gemini') {
        content = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      } else {
        content = response.choices?.[0]?.message?.content || '{}';
      }
      
      const result = JSON.parse(content);
      return {
        correct: result.correct === true,
        feedback: result.feedback || (result.correct ? 'Correct!' : 'Incorrect'),
        explanation: result.explanation
      };
    } catch (error) {
      console.error('Failed to parse evaluation:', error);
      return {
        correct: userAnswer === correctAnswer,
        feedback: userAnswer === correctAnswer ? 'Correct!' : 'Incorrect',
        explanation: 'Automatic evaluation failed. Please review your answer.'
      };
    }
  }

  public async generateFeedback(question: string, userAnswer: string, correctAnswer: string): Promise<string> {
    const prompt = `Generate detailed educational feedback for this quiz answer:
    Question: ${question}
    Correct Answer: ${correctAnswer}
    User's Answer: ${userAnswer}
    
    Provide:
    1. Whether the answer is correct or incorrect
    2. Detailed explanation of the concept
    3. Additional learning resources or tips
    4. Encouragement for the student
    
    Format as a paragraph of text that would be helpful for learning.`;

    const response = await this.makeRequest('generateContent', {
      contents: [{ parts: [{ text: prompt }] }]
    });

    try {
      let content: string;
      if (this.currentProvider === 'gemini') {
        content = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No feedback available.';
      } else {
        content = response.choices?.[0]?.message?.content || 'No feedback available.';
      }
      
      return content;
    } catch (error) {
      console.error('Failed to generate feedback:', error);
      return 'Unable to generate detailed feedback at this time. Please review the correct answer.';
    }
  }

  public async updateSettings(provider: AIProvider, apiKey: string, model: string): Promise<void> {
    this.currentProvider = provider;
    this.currentModel = model;
    await saveSettings(provider, apiKey, model);
    this.apiKey = apiKey;
    this.settingsLoaded = true;
  }
  
  // Public method to check if API key is configured
  public async isApiKeyConfigured(): Promise<boolean> {
    await this.ensureSettingsLoaded();
    return !!this.apiKey;
  }
  
  // Fallback method for when API key is not configured
  private createFallbackResponse(endpoint: string, body: any): any {
    if (endpoint === 'generateContent') {
      // Detect if this is an answer evaluation or feedback request
      const prompt = body.contents?.[0]?.parts?.[0]?.text || '';
      if (prompt.includes('Evaluate this answer')) {
        // Fallback for evaluateAnswer (no unused vars)
        const match = /Question: (.*)\nCorrect Answer: (.*)\nUser's Answer: (.*)\n/.exec(prompt);
        const correctAnswer = match?.[2] || '';
        const userAnswer = match?.[3] || '';
        const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        return {
          choices: [{
            message: {
              content: JSON.stringify({
                correct: isCorrect,
                feedback: isCorrect ? 'Correct!' : 'Incorrect',
                explanation: 'No API key set. This is a sample explanation. Please provide an API key for real AI explanations.'
              })
            }
          }]
        };
      } else if (prompt.includes('Generate detailed educational feedback')) {
        // Fallback for generateFeedback
        return {
          choices: [{
            message: {
              content: 'No API key set. This is a sample feedback. Please provide an API key for real AI feedback and explanations.'
            }
          }]
        };
      }
      // Fallback for question generation
      if (prompt.includes('Generate') && prompt.includes('quiz questions')) {
        return {
          choices: [{
            message: {
              content: '[{"question":"What is the capital of France?","options":["Paris","London","Berlin","Madrid"],"answer":"Paris","explanation":"Paris is the capital and most populous city of France.","difficulty":"easy","tags":["geography","europe"]}]'
            }
          }]
        };
      }
    }
    // Default fallback
    return {
      choices: [{
        message: {
          content: 'No API key set. This is a sample response.'
        }
      }]
    };
  }
  
  // compareAnswers helper removed for clarity and to reduce tech debt
}

export const aiService = AIService.getInstance();

export default aiService;