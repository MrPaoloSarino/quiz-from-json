const debugLogger = {
  log: (...args: any[]) => {
    if (import.meta.env.MODE === 'development') {
      // Only log in development mode
      // eslint-disable-next-line no-console
      console.log('[DEBUG]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (import.meta.env.MODE === 'development') {
      // eslint-disable-next-line no-console
      console.error('[DEBUG]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (import.meta.env.MODE === 'development') {
      // eslint-disable-next-line no-console
      console.warn('[DEBUG]', ...args);
    }
  }
};

export default debugLogger; 