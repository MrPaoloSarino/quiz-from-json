import { Buffer } from 'buffer';

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
      salt: encoder.encode('quiz-platform-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

// Encrypt data
const encrypt = async (data: string, password: string): Promise<string> => {
  const key = await deriveKey(password);
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encoder.encode(data)
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);

  return Buffer.from(combined).toString('base64');
};

// Decrypt data
const decrypt = async (encryptedData: string, password: string): Promise<string> => {
  try {
    const key = await deriveKey(password);
    const combined = Buffer.from(encryptedData, 'base64');
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv)
      },
      key,
      new Uint8Array(data)
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

// Secure storage interface
export const secureStorage = {
  // Store API key securely
  setApiKey: async (key: string, provider: string): Promise<void> => {
    try {
      const encrypted = await encrypt(key, process.env.NEXT_PUBLIC_STORAGE_KEY || 'default-key');
      localStorage.setItem(`api_key_${provider}`, encrypted);
    } catch (error) {
      console.error('Failed to store API key:', error);
      throw new Error('Failed to store API key securely');
    }
  },

  // Retrieve API key securely
  getApiKey: async (provider: string): Promise<string> => {
    try {
      const encrypted = localStorage.getItem(`api_key_${provider}`);
      if (!encrypted) return '';
      return await decrypt(encrypted, process.env.NEXT_PUBLIC_STORAGE_KEY || 'default-key');
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return '';
    }
  },

  // Remove API key
  removeApiKey: (provider: string): void => {
    localStorage.removeItem(`api_key_${provider}`);
  },

  // Validate API key format
  validateApiKey: (key: string, provider: string): boolean => {
    if (!key) return false;

    const patterns = {
      openai: /^sk-[A-Za-z0-9]{32,}$/,
      gemini: /^AI[a-zA-Z0-9_-]{35,}$/,
      openrouter: /^sk-or-[A-Za-z0-9]{32,}$/
    };

    return patterns[provider as keyof typeof patterns]?.test(key) || false;
  }
}; 