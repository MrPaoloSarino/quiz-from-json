// AI settings and secure storage helpers
import { secureStorage } from './secureStorage';
import { AIProvider } from './aiConfig';

export interface AISettings {
  provider: AIProvider;
  model: string;
  updatedAt: string;
}

export async function loadSettings(): Promise<{ settings: AISettings; apiKey: string }> {
  const settingsStr = localStorage.getItem('ai_settings');
  let settings: AISettings = {
    provider: 'openrouter',
    model: '',
    updatedAt: new Date().toISOString(),
  };
  if (settingsStr) {
    try {
      settings = { ...settings, ...JSON.parse(settingsStr) };
    } catch (e) {
      // ignore
    }
  }
  const apiKey = await secureStorage.getApiKey(settings.provider);
  return { settings, apiKey: apiKey || '' };
}

export async function saveSettings(provider: AIProvider, apiKey: string, model: string) {
  if (apiKey) await secureStorage.setApiKey(apiKey, provider);
  const settings: AISettings = {
    provider,
    model,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem('ai_settings', JSON.stringify(settings));
}
