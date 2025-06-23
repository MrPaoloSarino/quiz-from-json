import DOMPurify from 'dompurify';

// Configure DOMPurify
const purify = DOMPurify(window);

// Configure allowed tags and attributes
const config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOWED_STYLES: [],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
};

// Sanitize HTML content
export const sanitizeHtml = (content: string): string => {
  return purify.sanitize(content, config);
};

// Sanitize markdown content
export const sanitizeMarkdown = (content: string): string => {
  // First sanitize any HTML in the markdown
  const sanitizedHtml = sanitizeHtml(content);
  
  // Additional markdown-specific sanitization
  return sanitizedHtml
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+=/gi, '');
};

// Validate and sanitize JSON input
export const sanitizeJson = (json: string): any => {
  try {
    const parsed = JSON.parse(json);
    
    // Recursively sanitize string values
    const sanitizeValue = (value: any): any => {
      if (typeof value === 'string') {
        return sanitizeHtml(value);
      } else if (Array.isArray(value)) {
        return value.map(sanitizeValue);
      } else if (value && typeof value === 'object') {
        const sanitized: any = {};
        for (const [key, val] of Object.entries(value)) {
          sanitized[sanitizeHtml(key)] = sanitizeValue(val);
        }
        return sanitized;
      }
      return value;
    };

    return sanitizeValue(parsed);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

// Validate content length
export const validateContentLength = (content: string, maxLength: number = 10000): boolean => {
  return content.length <= maxLength;
};

// Validate URL
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}; 