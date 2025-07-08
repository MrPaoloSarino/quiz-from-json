import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { PROVIDERS, AIProvider } from '@/utils/aiConfig';
import aiManager from '@/utils/aiManager';
import { secureStorage } from '@/utils/secureStorage';

const SimpleAISettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    openrouter: '',
    gemini: '',
    openai: ''
  });
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedKeys, setSavedKeys] = useState<Record<AIProvider, boolean>>({
    openrouter: false,
    gemini: false,
    openai: false
  });

  useEffect(() => {
    loadSavedKeys();
    checkActiveProvider();
  }, []);

  const loadSavedKeys = async () => {
    const newSavedKeys = { ...savedKeys };
    
    for (const provider of Object.keys(PROVIDERS) as AIProvider[]) {
      const key = await secureStorage.getApiKey(provider);
      newSavedKeys[provider] = !!key;
      if (key) {
        setApiKeys(prev => ({ ...prev, [provider]: '••••••••' })); // Show masked
      }
    }
    
    setSavedKeys(newSavedKeys);
  };

  const checkActiveProvider = () => {
    const providerInfo = aiManager.getProviderInfo();
    setActiveProvider(providerInfo ? `${providerInfo.name} (${providerInfo.model})` : null);
  };

  const handleSaveApiKey = async (provider: AIProvider) => {
    const apiKey = apiKeys[provider];
    
    if (!apiKey || apiKey === '••••••••') {
      toast.error('Please enter a valid API key');
      return;
    }

    try {
      setIsLoading(true);
      
      // Save the API key
      await aiManager.saveApiKey(provider, apiKey);
      
      // Update UI
      setSavedKeys(prev => ({ ...prev, [provider]: true }));
      setApiKeys(prev => ({ ...prev, [provider]: '••••••••' }));
      
      // Check if this became the active provider
      checkActiveProvider();
      
      toast.success(`${PROVIDERS[provider].name} API key saved! ${aiManager.isAvailable() ? 'AI features are now active.' : ''}`);
    } catch (error) {
      console.error('Failed to save API key:', error);
      toast.error('Failed to save API key. Please check the format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveApiKey = async (provider: AIProvider) => {
    try {
      secureStorage.removeApiKey(provider);
      setSavedKeys(prev => ({ ...prev, [provider]: false }));
      setApiKeys(prev => ({ ...prev, [provider]: '' }));
      
      // Refresh active provider
      await aiManager.refreshProvider();
      checkActiveProvider();
      
      toast.info(`${PROVIDERS[provider].name} API key removed`);
    } catch (error) {
      toast.error('Failed to remove API key');
    }
  };

  const handleTestConnection = async (provider: AIProvider) => {
    if (!savedKeys[provider]) {
      toast.error('Please save the API key first');
      return;
    }

    try {
      setIsLoading(true);
      toast.info('Testing AI connection...');
      
      // Test with a simple explanation
      const testContext = {
        question: 'What is 2 + 2?',
        userAnswer: '4',
        correctAnswer: '4',
        isCorrect: true,
        questionType: 'multiple' as const,
        options: ['3', '4', '5', '6']
      };
      
      const response = await aiManager.generateExplanation(testContext);
      
      if (response && response.length > 10) {
        toast.success(`${PROVIDERS[provider].name} connection successful!`);
      } else {
        toast.error('Connection test failed - empty response');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 AI Settings
            {activeProvider && (
              <Badge variant="default" className="bg-success/10 text-success">
                Active: {activeProvider}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!activeProvider && (
            <Alert className="mb-6">
              <AlertDescription>
                💡 Add an API key below to enable AI explanations and chat features. The first valid key you save will be automatically used.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            {(Object.keys(PROVIDERS) as AIProvider[]).map(provider => {
              const config = PROVIDERS[provider];
              const isSaved = savedKeys[provider];
              
              return (
                <div key={provider} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        {config.name}
                        {isSaved && (
                          <Badge variant="outline" className="text-success border-success">
                            ✅ Saved
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {config.models.length} models available
                      </p>
                    </div>
                    <a 
                      href={config.apiKeyHelpUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Get API Key →
                    </a>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type={isSaved ? "password" : "text"}
                      placeholder={`Enter your ${config.name} API key`}
                      value={apiKeys[provider]}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, [provider]: e.target.value }))}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    
                    {!isSaved ? (
                      <Button 
                        onClick={() => handleSaveApiKey(provider)}
                        disabled={isLoading || !apiKeys[provider]}
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => handleTestConnection(provider)}
                          disabled={isLoading}
                        >
                          Test
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleRemoveApiKey(provider)}
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {/* Show available models */}
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Available Models ({config.models.length})
                    </summary>
                    <div className="mt-2 space-y-1">
                      {config.models.slice(0, 5).map(model => (
                        <div key={model.id} className="bg-muted px-2 py-1 rounded text-xs">
                          {model.name}
                        </div>
                      ))}
                      {config.models.length > 5 && (
                        <div className="text-muted-foreground text-xs">
                          +{config.models.length - 5} more models...
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div>1. <strong>Save an API key</strong> above - it will automatically become your active AI provider</div>
          <div>2. <strong>Take a quiz</strong> - click "AI Explainer" on any question to get detailed explanations</div>
          <div>3. <strong>Chat with AI</strong> - ask follow-up questions and get context-aware responses</div>
          <div>4. <strong>Automatic context</strong> - AI remembers your answer, the correct answer, and the question</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAISettings;
