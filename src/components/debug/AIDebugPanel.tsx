import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PROVIDERS, AIProvider } from '@/utils/aiConfig';
import { AIServiceTester } from '@/utils/aiServiceTest';
import { toast } from 'sonner';

interface TestResult {
  provider: AIProvider;
  model: string;
  success: boolean;
  error?: string;
  response?: any;
  timing?: number;
}

const AIDebugPanel: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    openrouter: '',
    gemini: '',
    openai: ''
  });
  
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState<Record<string, boolean>>({});
  const [showRawResponses, setShowRawResponses] = useState(false);

  const handleApiKeyChange = (provider: AIProvider, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const testSingleProvider = async (provider: AIProvider, model?: string) => {
    const apiKey = apiKeys[provider];
    if (!apiKey) {
      toast.error(`Please enter an API key for ${provider}`);
      return;
    }

    const testKey = `${provider}-${model || 'default'}`;
    setIsRunning(prev => ({ ...prev, [testKey]: true }));

    try {
      const startTime = Date.now();
      const result = await AIServiceTester.testProvider(provider, apiKey, model);
      const endTime = Date.now();
      
      const testResult: TestResult = {
        provider,
        model: model || PROVIDERS[provider].models[0].id,
        success: result.success,
        error: result.error,
        response: result.response,
        timing: endTime - startTime
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 9)]); // Keep last 10 results
      
      if (result.success) {
        toast.success(`${provider} test passed! (${testResult.timing}ms)`);
      } else {
        toast.error(`${provider} test failed: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(prev => ({ ...prev, [testKey]: false }));
    }
  };

  const testAllProviders = async () => {
    const providersWithKeys = (Object.keys(apiKeys) as AIProvider[])
      .filter(provider => apiKeys[provider].trim() !== '');
    
    if (providersWithKeys.length === 0) {
      toast.error('Please enter at least one API key');
      return;
    }

    for (const provider of providersWithKeys) {
      await testSingleProvider(provider);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const clearResults = () => {
    setTestResults([]);
    toast.info('Test results cleared');
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="default" className="bg-green-100 text-green-800">✅ PASS</Badge>
    ) : (
      <Badge variant="destructive">❌ FAIL</Badge>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 AI Service Debug Panel
            <Badge variant="outline">v2.0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Key Inputs */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">API Keys</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(PROVIDERS) as AIProvider[]).map(provider => (
                <div key={provider} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    {PROVIDERS[provider].name}
                    <a 
                      href={PROVIDERS[provider].apiKeyHelpUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-xs"
                    >
                      Get Key
                    </a>
                  </label>
                  <Input
                    type="password"
                    placeholder={`Enter ${provider} API key`}
                    value={apiKeys[provider]}
                    onChange={(e) => handleApiKeyChange(provider, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Test Controls */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={testAllProviders}
              disabled={Object.values(isRunning).some(Boolean)}
            >
              🚀 Test All Providers
            </Button>
            
            {(Object.keys(PROVIDERS) as AIProvider[]).map(provider => (
              <Button 
                key={provider}
                variant="outline"
                onClick={() => testSingleProvider(provider)}
                disabled={!apiKeys[provider] || isRunning[`${provider}-default`]}
              >
                Test {PROVIDERS[provider].name}
              </Button>
            ))}
            
            <Button variant="outline" onClick={clearResults}>
              🗑️ Clear Results
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowRawResponses(!showRawResponses)}
            >
              {showRawResponses ? '👁️ Hide' : '👁️ Show'} Raw Responses
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Provider Information */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Available Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.entries(PROVIDERS) as [AIProvider, typeof PROVIDERS[AIProvider]][]).map(([id, config]) => (
              <div key={id} className="border rounded p-3 space-y-2">
                <div className="font-medium text-sm">{config.name}</div>
                <div className="text-xs text-gray-600">{config.models.length} models</div>
                <div className="space-y-1">
                  {config.models.slice(0, 3).map(model => (
                    <div key={model.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {model.name}
                    </div>
                  ))}
                  {config.models.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{config.models.length - 3} more...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Test Results ({testResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(result.success)}
                      <span className="font-medium">{PROVIDERS[result.provider].name}</span>
                      <Badge variant="outline">{result.model}</Badge>
                      {result.timing && (
                        <Badge variant="outline">{result.timing}ms</Badge>
                      )}
                    </div>
                  </div>
                  
                  {result.error && (
                    <Alert variant="destructive">
                      <AlertDescription>{result.error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {result.success && result.response && (
                    <div className="bg-green-50 p-2 rounded text-sm">
                      <div className="font-medium text-green-800">Generated Question:</div>
                      <div className="text-green-700">{result.response.question}</div>
                      {result.response.options && (
                        <div className="text-green-600 text-xs mt-1">
                          Options: {result.response.options.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {showRawResponses && result.response && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-600">Raw Response</summary>
                      <pre className="bg-gray-100 p-2 mt-1 rounded overflow-auto">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIDebugPanel;
