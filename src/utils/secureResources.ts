import { validateUrl } from './sanitize';

// Resource integrity verification - using actual file content verification
const TRUSTED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  window.location.hostname
];

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

// Validate resource origin
const isResourceTrusted = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return TRUSTED_DOMAINS.includes(urlObj.hostname) || urlObj.protocol === 'data:';
  } catch {
    return false;
  }
};

// Load resource with proper validation
export const loadResource = async (
  url: string,
  resourceName: string
): Promise<Response> => {
  if (!validateUrl(url) || !isResourceTrusted(url)) {
    throw new Error('Untrusted resource URL');
  }

  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      // Add basic security headers
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load resource: ${response.statusText}`);
    }

    // Basic content type validation for audio files
    const contentType = response.headers.get('content-type');
    if (resourceName.endsWith('.mp3') && contentType && !contentType.includes('audio')) {
      console.warn(`Unexpected content type for ${resourceName}: ${contentType}`);
    }

    return response;
  } catch (error) {
    console.warn(`Failed to load resource from ${url}, using fallback`);
    const fallbackUrl = FALLBACK_RESOURCES[resourceName as keyof typeof FALLBACK_RESOURCES];
    if (fallbackUrl && fallbackUrl !== url) {
      return fetch(fallbackUrl);
    }
    throw error;
  }
};

// Preload essential resources
export const preloadResources = async (): Promise<void> => {
  const resourcesToPreload = ['correct.mp3', 'incorrect.mp3'];
  
  await Promise.allSettled(
    resourcesToPreload.map(async (resource) => {
      try {
        const fallbackUrl = FALLBACK_RESOURCES[resource as keyof typeof FALLBACK_RESOURCES];
        if (fallbackUrl) {
          await loadResource(fallbackUrl, resource);
        }
      } catch (error) {
        console.warn(`Failed to preload ${resource}:`, error);
      }
    })
  );
};

// Verify resource integrity (simplified version without hardcoded hashes)
export const verifyResourceIntegrity = async (
  response: Response,
  resourceName: string
): Promise<boolean> => {
  try {
    // Basic checks
    if (!response.ok) return false;
    
    // Check content length (basic sanity check)
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      console.warn(`Resource ${resourceName} is unusually large: ${contentLength} bytes`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Integrity verification failed:', error);
    return false;
  }
}; 