// AI Service Test Utility
import { aiService } from './aiService';
import { PROVIDERS, AIProvider } from './aiConfig';

export class AIServiceTester {
  static async testProvider(provider: AIProvider, apiKey: string, testModel?: string): Promise<{
    success: boolean;
    error?: string;
    response?: any;
  }> {
    try {
      console.log(`🧪 Testing ${provider} provider...`);
      
      // Get the first available model for the provider
      const model = testModel || PROVIDERS[provider].models[0].id;
      
      // Update settings
      await aiService.updateSettings(provider, apiKey, model);
      
      // Test with a simple question generation
      const questions = await aiService.generateQuestions('basic math', 1);
      
      if (!questions || questions.length === 0) {
        throw new Error('No questions generated');
      }
      
      console.log(`✅ ${provider} test successful:`, questions[0]);
      
      return {
        success: true,
        response: questions[0]
      };
    } catch (error) {
      console.error(`❌ ${provider} test failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  static async testAllProviders(apiKeys: Partial<Record<AIProvider, string>>): Promise<Record<AIProvider, any>> {
    const results: Record<AIProvider, any> = {} as any;
    
    for (const provider of Object.keys(PROVIDERS) as AIProvider[]) {
      const apiKey = apiKeys[provider];
      if (apiKey) {
        results[provider] = await this.testProvider(provider, apiKey);
      } else {
        results[provider] = {
          success: false,
          error: 'No API key provided'
        };
      }
    }
    
    return results;
  }
  
  static async testGeminiSpecific(apiKey: string): Promise<any> {
    console.log('🔍 Testing Gemini-specific functionality...');
    
    try {
      // Test different Gemini models
      const models = ['gemini-pro', 'gemini-1.5-flash-latest', 'gemini-2.0-flash-exp'];
      const results: any[] = [];
      
      for (const model of models) {
        try {
          const result = await this.testProvider('gemini', apiKey, model);
          results.push({
            model,
            ...result
          });
        } catch (error) {
          results.push({
            model,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      
      return results;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  static logProviderInfo(): void {
    console.log('📋 Available AI Providers:');
    
    Object.entries(PROVIDERS).forEach(([id, config]) => {
      console.log(`\n🤖 ${config.name} (${id}):`);
      console.log(`   URL: ${config.baseUrl}`);
      console.log(`   API Key Help: ${config.apiKeyHelpUrl}`);
      console.log(`   Models: ${config.models.length}`);
      
      config.models.forEach((model, index) => {
        console.log(`     ${index + 1}. ${model.name} (${model.id})`);
      });
    });
  }
}

// Test function for debugging
export async function runAITests(apiKeys: {
  openrouter?: string;
  gemini?: string;
  openai?: string;
}): Promise<void> {
  console.log('🚀 Starting AI Service Tests...\n');
  
  // Log provider info
  AIServiceTester.logProviderInfo();
  
  console.log('\n🧪 Running provider tests...');
  const results = await AIServiceTester.testAllProviders(apiKeys);
  
  console.log('\n📊 Test Results:');
  Object.entries(results).forEach(([provider, result]) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${provider}: ${result.error || 'Success'}`);
  });
  
  // Special Gemini test if API key provided
  if (apiKeys.gemini) {
    console.log('\n🔬 Running Gemini-specific tests...');
    const geminiResults = await AIServiceTester.testGeminiSpecific(apiKeys.gemini);
    console.log('Gemini Model Test Results:', geminiResults);
  }
  
  console.log('\n✨ AI Service tests completed!');
}

// Export for console debugging
if (typeof window !== 'undefined') {
  (window as any).runAITests = runAITests;
  (window as any).AIServiceTester = AIServiceTester;
}
