import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    open: true, // Auto-open browser on dev server start
    cors: true, // Enable CORS for Google API requests
    headers: {
      // Security headers for Google OAuth
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    }
  },
  // Use GitHub Pages base path only for production builds, root path for development/Lovable
  base: process.env.GITHUB_ACTIONS ? '/quiz-from-json/' : '/',
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Ensure environment variables are available in development
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  optimizeDeps: {
    // Pre-bundle Google API dependencies for faster dev server startup
    include: ['gapi-script'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Google APIs into their own chunk for better caching
          'google-apis': ['gapi-script'],
        },
      },
    },
  },
}));
