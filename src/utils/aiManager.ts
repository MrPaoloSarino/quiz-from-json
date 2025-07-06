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
  essayGrade?: {
    score: number;
    maxScore: number;
    grade: string;
    feedback: string;
  };
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
    const { question, userAnswer, correctAnswer, questionType, essayGrade } = context;
    
    let contextInfo = '';
    
    if (questionType === 'essay' && essayGrade) {
      contextInfo = `
**Original Question:** ${question}
**Student's Essay Answer:** ${userAnswer}
**AI Grade:** ${essayGrade.grade} (${essayGrade.score}/${essayGrade.maxScore} points)
**AI Feedback:** ${essayGrade.feedback}`;
    } else {
      contextInfo = `
**Original Question:** ${question}
**Student's Answer:** ${userAnswer}
**Correct Answer:** ${correctAnswer}`;
    }
    
    const prompt = `You are helping a student understand a quiz question. Here's the context:
${contextInfo}

**Student's Follow-up Question:** ${userMessage}

Please provide a helpful, educational response that addresses their question while staying relevant to the quiz context. ${questionType === 'essay' && essayGrade ? 'Reference their essay grade and provide specific guidance for improvement.' : 'Be supportive and encouraging.'}`;

    return await this.makeRequest(prompt);
  }

  // Automatically grade essay answers
  public async gradeEssay(question: string, studentAnswer: string, rubric?: string): Promise<{
    score: number;
    maxScore: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    grade: string;
  }> {
    if (!this.activeProvider || !this.activeApiKey) {
      throw new Error('No AI provider configured for essay grading.');
    }

    const rubricText = rubric || `
    Grading Criteria (10 points total):
    - Content Knowledge (4 points): Demonstrates understanding of key concepts
    - Clarity & Organization (3 points): Well-structured, clear communication
    - Analysis & Critical Thinking (2 points): Shows analytical thinking
    - Writing Quality (1 point): Grammar, spelling, coherence
    `;

    const prompt = `You are an expert educator grading an essay response. Please evaluate this student's answer carefully and provide detailed feedback.

**Question:** ${question}

**Student's Answer:** ${studentAnswer}

**Grading Rubric:** ${rubricText}

**Instructions:**
1. Grade the essay out of 10 points based on the rubric
2. Provide specific feedback on what the student did well
3. Identify areas for improvement with specific suggestions
4. Be encouraging but honest in your assessment
5. Give a letter grade (A+ to F)

**Please respond in this exact JSON format:**
{
  "score": [numerical score out of 10],
  "maxScore": 10,
  "feedback": "[2-3 paragraph overall assessment]",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "grade": "[letter grade like A+, A, B+, etc.]"
}`;

    try {
      const response = await this.makeRequest(prompt);
      
      // Clean response and extract JSON
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const gradingResult = JSON.parse(cleanResponse);
      
      // Validate the response format
      if (typeof gradingResult.score !== 'number' || 
          !gradingResult.feedback || 
          !Array.isArray(gradingResult.strengths) ||
          !Array.isArray(gradingResult.improvements)) {
        throw new Error('Invalid grading response format');
      }
      
      // Ensure score is within valid range
      gradingResult.score = Math.max(0, Math.min(10, gradingResult.score));
      
      return gradingResult;
    } catch (error) {
      console.error('Essay grading failed:', error);
      
      // Fallback grading when AI fails
      const wordCount = studentAnswer.trim().split(/\s+/).length;
      const fallbackScore = Math.min(10, Math.max(1, Math.floor(wordCount / 20))); // Rough scoring based on length
      
      return {
        score: fallbackScore,
        maxScore: 10,
        feedback: `I couldn't process this essay with AI grading, but I can see you've written ${wordCount} words. This shows effort! For a complete grade, please ensure your essay addresses the key concepts in the question with clear examples and explanations.`,
        strengths: [
          wordCount > 50 ? "Good length and effort" : "Shows initial effort",
          "Attempted to answer the question",
          "Demonstrates engagement with the topic"
        ],
        improvements: [
          "Consider adding more specific examples",
          "Expand on key concepts and definitions", 
          "Structure your response with clear introduction and conclusion"
        ],
        grade: fallbackScore >= 8 ? "B+" : fallbackScore >= 6 ? "B" : fallbackScore >= 4 ? "C" : "D"
      };
    }
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
