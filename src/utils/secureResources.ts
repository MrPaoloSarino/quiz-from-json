import { validateUrl } from './sanitize';

// Resource integrity hashes
const RESOURCE_INTEGRITY = {
  'correct.mp3': 'sha384-...', // Add actual hash
  'incorrect.mp3': 'sha384-...', // Add actual hash
  'start.mp3': 'sha384-...', // Add actual hash
  'complete.mp3': 'sha384-...', // Add actual hash
  'next.mp3': 'sha384-...', // Add actual hash
  'error.mp3': 'sha384-...', // Add actual hash
  'success.mp3': 'sha384-...', // Add actual hash
  'shuffle.mp3': 'sha384-...', // Add actual hash
  'reset.mp3': 'sha384-...', // Add actual hash
};

// Fallback resources (local copies)
const FALLBACK_RESOURCES = {
  'correct.mp3': '/sounds/correct.mp3',
  'incorrect.mp3': '/sounds/incorrect.mp3',
  'start.mp3': '/sounds/start.mp3',
  'complete.mp3': '/sounds/complete.mp3',
  'next.mp3': '/sounds/next.mp3',
  'error.mp3': '/sounds/error.mp3',
  'success.mp3': '/sounds/success.mp3',
  'shuffle.mp3': '/sounds/shuffle.mp3',
  'reset.mp3': '/sounds/reset.mp3',
};

// Load resource with integrity check
export const loadResource = async (
  url: string,
  resourceName: string
): Promise<Response> => {
  if (!validateUrl(url)) {
    throw new Error('Invalid resource URL');
  }

  try {
    const response = await fetch(url, {
      integrity: RESOURCE_INTEGRITY[resourceName as keyof typeof RESOURCE_INTEGRITY],
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`Failed to load resource: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.warn(`Failed to load resource from ${url}, using fallback`);
    return fetch(FALLBACK_RESOURCES[resourceName as keyof typeof FALLBACK_RESOURCES]);
  }
};

// Preload resources
export const preloadResources = async (): Promise<void> => {
  const resources = Object.keys(RESOURCE_INTEGRITY);
  
  await Promise.all(
    resources.map(async (resource) => {
      try {
        const response = await loadResource(
          `https://cdn.example.com/sounds/${resource}`,
          resource
        );
        if (!response.ok) {
          throw new Error(`Failed to preload ${resource}`);
        }
      } catch (error) {
        console.error(`Error preloading ${resource}:`, error);
      }
    })
  );
};

// Verify resource integrity
export const verifyResourceIntegrity = async (
  resource: ArrayBuffer,
  resourceName: string
): Promise<boolean> => {
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-384', resource);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex === RESOURCE_INTEGRITY[resourceName as keyof typeof RESOURCE_INTEGRITY];
  } catch (error) {
    console.error('Integrity verification failed:', error);
    return false;
  }
}; 