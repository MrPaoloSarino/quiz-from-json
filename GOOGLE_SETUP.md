# Google Drive API Setup for QuizMaster AI

To enable the full SaaS functionality with personal user data storage, you need to configure Google Drive API credentials.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

## Step 2: Enable APIs

1. Navigate to "APIs & Services" > "Library"
2. Search and enable:
   - **Google Drive API**
   - **Google Identity Services** (for authentication)

## Step 3: Create Credentials

### API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. **Restrict the key** to only Google Drive API for security

### OAuth 2.0 Client ID
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Configure OAuth consent screen if prompted
4. Choose "Web application"
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production domain (e.g., `https://yourdomain.com`)
6. Copy the Client ID

## Step 4: Configure Environment Variables

Create a `.env` file in your project root with:

```bash
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_api_key_here
```

## Step 5: OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Fill in required information:
   - App name: "QuizMaster AI"
   - User support email: your email
   - Developer contact: your email
3. Add scopes:
   - `https://www.googleapis.com/auth/drive.appdata`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/userinfo.email`

## Security Notes

- Keep your credentials secure and never commit them to version control
- Use environment variables for all sensitive data
- Restrict API keys to specific APIs and domains
- Regularly rotate your credentials

## Testing

After setup, users will be able to:
- Sign in with their Google account
- Store quizzes in their personal Google Drive
- Access their data from any device
- Maintain complete privacy of their quiz data

## Costs

- Google Drive API: **FREE** for normal usage
- Google Identity Services: **FREE**
- Quotas are generous for educational apps like QuizMaster AI 