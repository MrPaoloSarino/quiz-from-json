# 🚀 QuizMaster AI - Development Quick Start

Get QuizMaster AI running locally in under 5 minutes!

## ⚡ Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Run setup script
npm run setup

# 3. Start development server
npm run dev
```

The app will open at `http://localhost:8080` with auto-reload enabled.

## 🔧 Configuration Options

### Basic Development (No Google APIs)
- **What works**: Quiz creation, taking quizzes, file import/export
- **What doesn't**: User sign-in, cloud storage, user profiles
- **Perfect for**: Testing core functionality, UI development

### Full SaaS Development (With Google APIs)
1. Follow [GOOGLE_SETUP.md](./GOOGLE_SETUP.md) to get credentials
2. Edit `.env.local` with your Google API credentials
3. Restart dev server: `npm run dev`
4. **What works**: Everything! Full SaaS experience

## 📋 Available Scripts

### Development
```bash
npm run dev           # Start dev server (localhost only)
npm run dev:host      # Start dev server (accessible from network)
npm run dev:debug     # Start with debug logging
npm run setup         # Initialize development environment
```

### Testing & Building
```bash
npm run test:google   # Check Google API configuration
npm run lint          # Check code quality
npm run lint:fix      # Fix linting issues
npm run build         # Build for production
npm run preview       # Preview production build
```

### Utilities
```bash
npm run clean         # Clear build cache
npm run check         # Full code check (lint + build)
```

## 🌐 Development Server Features

- **Auto-reload**: Changes refresh automatically
- **Auto-open**: Browser opens automatically
- **CORS enabled**: For Google API requests
- **Network access**: Use `npm run dev:host` for mobile testing
- **Fast HMR**: Hot module replacement for instant updates

## 🔍 Environment Variables

The app automatically checks for these variables:

```bash
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
```

Run `npm run test:google` to verify your configuration.

## 📱 Testing Options

### Desktop Development
```bash
npm run dev
# Opens: http://localhost:8080
```

### Mobile/Network Testing
```bash
npm run dev:host
# Access from any device on your network
# Find your IP: http://YOUR_IP:8080
```

### Production Preview
```bash
npm run build
npm run preview
# Test production build locally
```

## 🐛 Troubleshooting

### Common Issues

**"Google API not configured"**
- Solution: Follow [GOOGLE_SETUP.md](./GOOGLE_SETUP.md)
- Workaround: Use without Google APIs (limited features)

**Port 8080 in use**
- The dev server will automatically find an available port
- Or specify: `npm run dev -- --port 3000`

**Network access issues**
- Use: `npm run dev:host`
- Check firewall settings
- Try: `http://localhost:8080` first

**Build failures**
- Run: `npm run clean && npm install`
- Check: `npm run lint:fix`

### Getting Help

1. Check [GOOGLE_SETUP.md](./GOOGLE_SETUP.md) for API setup
2. Check [SAAS_IMPLEMENTATION.md](./SAAS_IMPLEMENTATION.md) for architecture
3. Run `npm run setup` to verify environment
4. Check browser console for errors

## 🎯 Development Tips

### For UI Development
- Use `npm run dev` without Google APIs
- Focus on component development
- Hot reload makes iteration fast

### For SaaS Feature Development
- Set up Google APIs first
- Use real Google accounts for testing
- Test sign-in/sign-out flows

### For Production Testing
- Use `npm run build && npm run preview`
- Test with production environment variables
- Verify all features work without dev tools

## 📁 Key Development Files

```
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # User dashboard
│   │   └── QuizMasterApp.tsx  # Main app component
│   ├── utils/
│   │   └── googleDriveStorage.ts  # SaaS storage system
│   └── types/
│       └── user.ts            # Enhanced type definitions
├── vite.config.ts             # Development server config
├── .env.local                 # Your local environment (create this)
└── scripts/
    └── dev-setup.js           # Setup automation
```

Happy coding! 🎉 