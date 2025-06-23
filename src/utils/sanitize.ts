// Only import DOMPurify in browser environment
let DOMPurify: any = null;

if (typeof window !== 'undefined') {
  try {
    DOMPurify = require('dompurify');
  } catch (error) {
    console.warn('DOMPurify not available, using basic sanitization');
  }
}

// Configure DOMPurify if available
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

// Basic HTML sanitization fallback
const basicSanitize = (content: string): string => {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '');
};

// Sanitize HTML content
export const sanitizeHtml = (content: string): string => {
  if (DOMPurify && typeof window !== 'undefined') {
    return DOMPurify.sanitize(content, config);
  }
  return basicSanitize(content);
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