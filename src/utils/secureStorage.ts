// Browser-compatible secure storage using Web Crypto API

// Encryption key derivation
const deriveKey = async (password: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('quiz-app-salt'), // Use a fixed salt for simplicity
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

// Encrypt data using AES-GCM
const encryptData = async (data: string, password: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const key = await deriveKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encoder.encode(data)
    );

    // Combine IV and encrypted data, then base64 encode
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt data using AES-GCM
const decryptData = async (encryptedData: string, password: string): Promise<string> => {
  try {
    const decoder = new TextDecoder();
    const key = await deriveKey(password);
    
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encrypted
    );

    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

// API key validation
const validateApiKey = (key: string, provider: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  
  switch (provider) {
    case 'openrouter':
      return key.startsWith('sk-') && key.length > 20;
    case 'openai':
      return key.startsWith('sk-') && key.length > 20;
    case 'gemini':
      return key.length > 20;
    default:
      return key.length > 10;
  }
};

// Simple password for encryption (in a real app, this should be user-derived)
const getEncryptionPassword = (): string => {
  const stored = localStorage.getItem('quiz-app-session-id');
  if (stored) return stored;
  
  const sessionId = crypto.getRandomValues(new Uint32Array(4)).join('-');
  localStorage.setItem('quiz-app-session-id', sessionId);
  return sessionId;
};

// Main secure storage interface
export const secureStorage = {
  async setApiKey(apiKey: string, provider: string): Promise<void> {
    if (!validateApiKey(apiKey, provider)) {
      throw new Error('Invalid API key format');
    }
    
    try {
      const password = getEncryptionPassword();
      const encrypted = await encryptData(apiKey, password);
      localStorage.setItem(`secure-api-key-${provider}`, encrypted);
    } catch (error) {
      throw new Error('Failed to store API key securely');
    }
  },

  async getApiKey(provider: string): Promise<string | null> {
    try {
      const encrypted = localStorage.getItem(`secure-api-key-${provider}`);
      if (!encrypted) return null;
      
      const password = getEncryptionPassword();
      return await decryptData(encrypted, password);
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  },

  removeApiKey(provider: string): void {
    localStorage.removeItem(`secure-api-key-${provider}`);
  },

  validateApiKey
}; 