# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it **"NarrativeAI"** and click **"Create"**

## Step 2: Enable Google+ API

1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

## Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - Choose **"External"** user type
   - Fill in app name: **"NarrativeAI"**
   - Add your email as support email
   - Click **"Save and Continue"** through all steps

4. Now create the OAuth client:
   - Application type: **"Web application"**
   - Name: **"NarrativeAI Web Client"**
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173`
     - `http://localhost:3001`
   - **Authorized redirect URIs**:
     - `http://localhost:3001/api/auth/google/callback`
   - Click **"Create"**

5. Copy your **Client ID** and **Client Secret**

## Step 4: Update Environment Variables

Open `/backend/.env` and update:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

## Step 5: Restart Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd ..
npm run dev
```

## Step 6: Test Google Login

1. Open http://localhost:5173
2. Click **"Login"** or **"Sign Up"**
3. Click **"Continue with Google"**
4. You should see Google's account selection screen
5. Choose your account and authorize
6. You'll be redirected back to the app, logged in!

## How It Works

1. User clicks "Continue with Google"
2. Frontend redirects to: `http://localhost:3001/api/auth/google`
3. Backend redirects to Google's OAuth consent screen
4. User selects their Google account and authorizes
5. Google redirects back to: `http://localhost:3001/api/auth/google/callback`
6. Backend creates/finds user in database
7. Backend generates JWT token
8. Backend redirects to frontend with token and user data
9. Frontend saves token and logs user in

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure you added `http://localhost:3001/api/auth/google/callback` to authorized redirect URIs

### "Origin not allowed" error  
- Add `http://localhost:5173` and `http://localhost:3001` to authorized JavaScript origins

### Database errors
- Run `npx prisma migrate dev` to update the database schema
- The schema already supports OAuth with `provider` and `providerId` fields

## Production Setup

When deploying to production:

1. Update authorized origins and redirect URIs in Google Cloud Console:
   - Add your production domain (e.g., `https://narrativeai.com`)
   - Add production redirect URI (e.g., `https://narrativeai.com/api/auth/google/callback`)

2. Update `.env` in production:
   ```env
   API_BASE_URL=https://narrativeai.com
   CORS_ORIGIN=https://narrativeai.com
   ```

3. Keep your `GOOGLE_CLIENT_SECRET` secure - never commit it to Git!
