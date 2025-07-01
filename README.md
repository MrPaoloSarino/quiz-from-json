# 🧠 QuizMaster AI - SaaS Learning Platform

An intelligent quiz platform with AI-powered explanations, personal data storage, and science-backed engagement features.

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure user sign-in
- ☁️ **Personal Cloud Storage** - Data stored in user's Google Drive
- 🤖 **AI-Powered Explanations** - Detailed feedback for every answer
- 💬 **Interactive AI Chat** - Ask follow-up questions
- 📊 **Learning Analytics** - Track progress and performance
- 🎯 **Spaced Repetition** - Science-backed learning optimization
- 🏆 **Gamification** - XP, levels, achievements, and streaks
- 📱 **Responsive Design** - Works on all devices

## 🚀 Quick Start

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup development environment
npm run setup

# 3. Start development server
npm run dev
```

The app opens at `http://localhost:8080` with auto-reload enabled.

### Full SaaS Setup (Optional)

For complete functionality including user accounts and cloud storage:

1. **Get Google API Credentials**
   - Follow [GOOGLE_SETUP.md](./GOOGLE_SETUP.md) for detailed instructions
   - Free for development and normal usage

2. **Configure Environment**
   - Edit `.env.local` with your Google API credentials
   - Restart the dev server

3. **Ready!** 
   - Users can sign in with Google
   - Data is stored in their personal Google Drive
   - Full SaaS experience enabled

### Quick Development (No Setup Required)

```bash
npm install && npm run dev
```

**Works immediately with:**
- Quiz creation and taking
- AI explanations and chat
- File import/export
- All UI features

**Requires Google setup for:**
- User accounts and profiles
- Cloud storage and sync
- Personal quiz libraries

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (fast development server)
- Tailwind CSS + shadcn/ui components
- Lucide React icons

**SaaS Infrastructure:**
- Google Drive API (user data storage)
- Google OAuth 2.0 (authentication)
- gapi-script (Google API client)

**Features:**
- AI explanations and chat
- Spaced repetition algorithms
- Learning analytics
- Gamification systems

## 📚 Documentation

- **[DEV_QUICKSTART.md](./DEV_QUICKSTART.md)** - Get started in 5 minutes
- **[GOOGLE_SETUP.md](./GOOGLE_SETUP.md)** - Google API configuration
- **[SAAS_IMPLEMENTATION.md](./SAAS_IMPLEMENTATION.md)** - Complete architecture overview

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run dev:host     # Start server (network accessible)
npm run setup        # Initialize development environment
npm run test:google  # Check Google API configuration
npm run build        # Build for production
npm run preview      # Preview production build
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e8593b99-e88b-4688-bbc1-8609f7198cae) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
