#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 QuizMaster AI - Development Setup\n');

// Check if .env.local exists
const envPath = path.join(path.dirname(__dirname), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env.local template...');
  
  const envTemplate = `# QuizMaster AI - Local Development Environment
# Get your credentials from: https://console.cloud.google.com/

VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_google_api_key_here

# Development Settings
VITE_APP_ENV=development
VITE_DEBUG_MODE=true

# Optional Settings
VITE_APP_NAME="QuizMaster AI"
VITE_APP_DESCRIPTION="Your personal AI-powered learning companion"
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
} else {
  console.log('✅ .env.local already exists');
}

// Check environment variables
console.log('\n🔍 Checking environment variables...');

const clientId = process.env.VITE_GOOGLE_CLIENT_ID;
const apiKey = process.env.VITE_GOOGLE_API_KEY;

if (!clientId || clientId.includes('your_google_client_id')) {
  console.log('❌ VITE_GOOGLE_CLIENT_ID not configured');
  console.log('   Please edit .env.local and add your Google Client ID');
} else {
  console.log('✅ VITE_GOOGLE_CLIENT_ID configured');
}

if (!apiKey || apiKey.includes('your_google_api_key')) {
  console.log('❌ VITE_GOOGLE_API_KEY not configured');
  console.log('   Please edit .env.local and add your Google API Key');
} else {
  console.log('✅ VITE_GOOGLE_API_KEY configured');
}

console.log('\n📚 Next Steps:');
console.log('1. Follow GOOGLE_SETUP.md to get your Google API credentials');
console.log('2. Edit .env.local with your actual credentials');
console.log('3. Run: npm run dev');
console.log('4. Open: http://localhost:8080');

console.log('\n🔧 Available Scripts:');
console.log('  npm run dev         - Start development server');
console.log('  npm run dev:host    - Start server accessible from network');
console.log('  npm run dev:debug   - Start with debug logging');
console.log('  npm run test:google - Test Google API configuration');
console.log('  npm run build       - Build for production');
console.log('  npm run preview     - Preview production build');

if (!clientId || !apiKey || clientId.includes('your_google_client_id') || apiKey.includes('your_google_api_key')) {
  console.log('\n⚠️  Google API credentials not configured.');
  console.log('   The app will work but SaaS features will be disabled.');
  console.log('   Users will see a "credentials not configured" message.');
}

console.log('\n🎉 Development environment ready!');
console.log('   Run "npm run dev" to start the development server.'); 