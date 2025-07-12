import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { aiService } from '@/utils/aiService';
import type { AIProvider } from '@/utils/aiConfig';
import { PROVIDERS } from '@/utils/aiConfig';

const AISettings: React.FC = () => {
  const [provider, setProvider] = useState<AIProvider>('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const settingsStr = localStorage.getItem('ai_settings');
        if (settingsStr) {
          try {
        "@typescript-eslint/eslint-plugin": "^8.11.0",
        "@typescript-eslint/parser": "^8.11.0",          try {
            const settings = JSON.parse(settingsStr) as {
              provider?: AIProvider;
              model?: string;
              apiKey?: string;
            };
            
            if (settings.provider && settings.provider in PROVIDERS) {
              const provider = settings.provider as AIProvider;
              const defaultModel = PROVIDERS[provider].models[0]?.id || '';
              
              setProvider(provider);
              setModel(settings.model || defaultModel);
              setApiKey(settings.apiKey || '');
              return;
            }
          } catch (error) {
            console.error('Error parsing AI settings:', error);
          }
        }
        
        // Set defaults
        const defaultProvider = 'openrouter' as const;
        const defaultModel = PROVIDERS[defaultProvider].models[0]?.id || '';
        setProvider(defaultProvider);
        setModel(defaultModel);
      } catch (error) {
        console.error('Failed to load AI settings:', error);
        toast.error('Failed to load AI settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      toast.error('Please enter an API key');
      return;
    }

    try {
      setIsSaving(true);
      
      // Save to AI service (now async)
      await aiService.updateSettings(provider, apiKey, model);
      
      // No need to save to localStorage as aiService.updateSettings now handles this
      // but without the API key for security

      toast.success('AI settings saved successfully!');
    } catch (error) {
      console.error('Failed to save AI settings:', error);
      toast.error('Failed to save AI settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      toast.error('Please enter an API key first');
      return;
    }

    try {
      setIsTesting(true);
      toast.info('Testing connection to AI service...');
      
      // Test with a simple request
      await aiService.generateQuestions('test', 1);
      
      toast.success('Successfully connected to AI service!');
    } catch (err) {
      console.error('Connection test failed:', err);
      toast.error(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleProviderChange = (value: string) => {
    // Defensive: ensure value is a valid AIProvider
    if (value in PROVIDERS) {
      setProvider(value as AIProvider);
      // Reset to first model when changing provider
      const defaultModel = PROVIDERS[value as AIProvider].models[0]?.id || '';
      setModel(defaultModel);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>AI Settings</CardTitle>
          <CardDescription>
            Configure your AI provider and API keys for quiz generation and evaluation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">AI Provider</Label>
                <Select
                  value={provider}
                  onValueChange={handleProviderChange}
                  disabled={isLoading || isSaving || isTesting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROVIDERS).map(([id, config]) => (
                      <SelectItem key={id} value={id}>
                        {config.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="api-key">API Key</Label>
                  <a
                    href={PROVIDERS[provider].apiKeyHelpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Get API Key
                  </a>
                </div>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${PROVIDERS[provider].name} API key`}
                  disabled={isLoading || isSaving || isTesting}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select
                  value={model}
                  onValueChange={setModel}
                  disabled={isLoading || isSaving || isTesting || !provider}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS[provider]?.models.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={isLoading || isSaving || isTesting || !apiKey}
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || isSaving || isTesting || !apiKey}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISettings;
