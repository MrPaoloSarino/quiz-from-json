// Security configuration
export const securityConfig = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': [
      "'self'",
      'https://api.openai.com',
      'https://api.openrouter.ai',
      'https://generativelanguage.googleapis.com'
    ],
    'media-src': ["'self'", 'https://cdn.example.com'],
    'font-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  },

  // Rate limiting
  rateLimit: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests, please try again later'
  },

  // Input validation
  validation: {
    maxContentLength: 10000,
    maxJsonSize: 1024 * 1024, // 1MB
    allowedFileTypes: ['.json', '.txt'],
    maxFileSize: 5 * 1024 * 1024 // 5MB
  },

  // API key validation
  apiKey: {
    minLength: 32,
    maxLength: 100,
    patterns: {
      openai: /^sk-[A-Za-z0-9]{32,}$/,
      gemini: /^AI[a-zA-Z0-9_-]{35,}$/,
      openrouter: /^sk-or-[A-Za-z0-9]{32,}$/
    }
  },

  // Resource integrity
  integrity: {
    algorithm: 'SHA-384',
    enabled: true
  },

  // Error handling
  errorHandling: {
    showDetails: process.env.NODE_ENV === 'development',
    logErrors: true,
    reportErrors: false
  },

  // Session security
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  }
};

// Security headers
export const securityHeaders = {
  'Content-Security-Policy': Object.entries(securityConfig.csp)
    .map(([key, value]) => `${key} ${value.join(' ')}`)
    .join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}; 