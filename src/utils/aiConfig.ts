// Centralized AI provider/model configuration

export type AIProvider = 'openrouter' | 'openai' | 'gemini';

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  maxTokens?: number;
  costPer1kTokens?: number;
}

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  apiKeyHelpUrl: string;
  models: AIModel[];
  headers: (apiKey: string) => Record<string, string>;
  formatRequest?: (prompt: string, model: string) => any;
  parseResponse?: (data: any) => string;
}

export type GeminiModel =
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash'
  | 'gemini-2.5-flash-lite-preview-06-17'
  | 'gemini-2.5-flash-preview-native-audio-dialog'
  | 'gemini-2.5-flash-exp-native-audio-thinking-dialog'
  | 'gemini-2.5-flash-preview-tts'
  | 'gemini-2.5-pro-preview-tts'
  | 'gemini-2.0-flash'
  | 'gemini-2.0-flash-preview-image-generation'
  | 'gemini-2.0-flash-lite'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-flash-8b'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-pro-vision'
  | 'gemini-1.5-pro-latest'
  | 'gemini-pro'
  | 'gemini-pro-vision'
  | 'gemini-embedding-exp'
  | 'imagen-4.0-generate-preview-06-06'
  | 'imagen-4.0-ultra-generate-preview-06-06'
  | 'imagen-3.0-generate-002'
  | 'veo-2.0-generate-001'
  | 'gemini-live-2.5-flash-preview'
  | 'gemini-2.0-flash-live-001';

export type GeminiModelConfig = {
  maxTokens: number;
  temperature: number;
};

export type GeminiModels = {
  [K in GeminiModel]: GeminiModelConfig;
};

type BaseProviderConfig = {
  baseUrl: string;
  defaultModel: string;
  headers: (apiKey: string) => Record<string, string>;
};

type GeminiProviderConfig = {
  baseUrl: string;
  defaultModel: GeminiModel;
  models: GeminiModels;
  headers: (apiKey: string) => Record<string, string>;
  formatRequest: (prompt: string, model: GeminiModel) => any;
};

export type APIConfig = {
  openrouter: BaseProviderConfig;
  openai: BaseProviderConfig;
  gemini: GeminiProviderConfig;
};

export const PROVIDERS: Record<AIProvider, ProviderConfig> = {
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    apiKeyHelpUrl: 'https://openrouter.ai/keys',
    models: [
      { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek Chat V3 (Free)', maxTokens: 8192 },
      { id: 'microsoft/wizardlm-2-8x22b:nitro', name: 'WizardLM 2 8x22B', maxTokens: 8192 },
      { id: 'meta-llama/llama-3-8b-instruct:free', name: 'Llama 3 8B Instruct (Free)', maxTokens: 8192 },
      { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B Instruct (Free)', maxTokens: 32768 }
    ],
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      'X-Title': 'QuizMaster AI'
    })
  },
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    apiKeyHelpUrl: 'https://platform.openai.com/api-keys',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', maxTokens: 128000 },
      { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128000 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', maxTokens: 128000 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 4096 }
    ],
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  },
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    apiKeyHelpUrl: 'https://makersuite.google.com/app/apikey',
    models: [
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)', maxTokens: 32768 },
      { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Latest)', maxTokens: 32768 },
      { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Latest)', maxTokens: 32768 },
      { id: 'gemini-1.5-flash-8b-latest', name: 'Gemini 1.5 Flash 8B (Latest)', maxTokens: 32768 },
      { id: 'gemini-pro', name: 'Gemini 1.0 Pro', maxTokens: 30720 }
    ],
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json'
    }),
    formatRequest: (prompt: string, model: string) => ({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        topP: 1,
        topK: 1
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ]
    }),
    parseResponse: (data: any) => {
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
  }
};

// Legacy API_CONFIG for backward compatibility
export const API_CONFIG: APIConfig = {
  openrouter: {
    baseUrl: PROVIDERS.openrouter.baseUrl,
    defaultModel: PROVIDERS.openrouter.models[0].id,
    headers: PROVIDERS.openrouter.headers
  },
  openai: {
    baseUrl: PROVIDERS.openai.baseUrl,
    defaultModel: PROVIDERS.openai.models[3].id, // gpt-3.5-turbo
    headers: PROVIDERS.openai.headers
  },
  gemini: {
    baseUrl: PROVIDERS.gemini.baseUrl,
    defaultModel: 'gemini-1.5-pro-latest' as GeminiModel,
    models: {
      'gemini-2.5-pro': { maxTokens: 32768, temperature: 0.7 },
      'gemini-2.5-flash': { maxTokens: 32768, temperature: 0.7 },
      'gemini-2.5-flash-lite-preview-06-17': { maxTokens: 32768, temperature: 0.7 },
      'gemini-2.5-flash-preview-native-audio-dialog': { maxTokens: 32768, temperature: 0.7 },
      'gemini-2.5-flash-exp-native-audio-thinking-dialog': { maxTokens: 32768, temperature: 0.7 },
      'gemini-2.5-flash-preview-tts': { maxTokens: 32768, temperature: 0.7 },
      'gemini-2.5-pro-preview-tts': { maxTokens: 32768, temperature: 0.7 },
      'gemini-2.0-flash': { maxTokens: 32768, temperature: 0.7 },
      'gemini-2.0-flash-preview-image-generation': { maxTokens: 32768, temperature: 0.7 },
      'gemini-2.0-flash-lite': { maxTokens: 32768, temperature: 0.7 },
      'gemini-1.5-flash': { maxTokens: 32768, temperature: 0.7 },
      'gemini-1.5-flash-8b': { maxTokens: 32768, temperature: 0.7 },
      'gemini-1.5-pro': { maxTokens: 32768, temperature: 0.7 },
      'gemini-1.5-pro-vision': { maxTokens: 32768, temperature: 0.7 },
      'gemini-1.5-pro-latest': { maxTokens: 32768, temperature: 0.7 },
      'gemini-pro': { maxTokens: 30720, temperature: 0.7 },
      'gemini-pro-vision': { maxTokens: 30720, temperature: 0.7 },
      'gemini-embedding-exp': { maxTokens: 8192, temperature: 0.7 },
      'imagen-4.0-generate-preview-06-06': { maxTokens: 8192, temperature: 0.7 },
      'imagen-4.0-ultra-generate-preview-06-06': { maxTokens: 8192, temperature: 0.7 },
      'imagen-3.0-generate-002': { maxTokens: 8192, temperature: 0.7 },
      'veo-2.0-generate-001': { maxTokens: 8192, temperature: 0.7 },
      'gemini-live-2.5-flash-preview': { maxTokens: 32768, temperature: 0.7 },
      'gemini-2.0-flash-live-001': { maxTokens: 32768, temperature: 0.7 }
    },
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json'
    }),
    formatRequest: (prompt: string, model: GeminiModel) => PROVIDERS.gemini.formatRequest!(prompt, model)
  }
} as const;
