# Deployment Guide for NarrativeAI

This guide covers deploying both the frontend and backend of your NarrativeAI application.

## Table of Contents
1. [Backend Deployment (Railway/Render)](#backend-deployment)
2. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
3. [Database Setup (Railway PostgreSQL)](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Configuration](#post-deployment)

---

## Prerequisites

- GitHub account (you already have the repo)
- Accounts for deployment platforms (free tiers available)
- Google OAuth credentials (update for production)

---

## Backend Deployment

### Option 1: Railway (Recommended)

**Why Railway?** Free PostgreSQL database included, easy deployment, great for Node.js.

#### Steps:

1. **Sign up at [Railway.app](https://railway.app/)**
   - Connect your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `NarrativeAI` repository
   - Select the `backend` folder as root directory

3. **Add PostgreSQL Database**
   - In your project, click "New"
   - Select "Database" → "Add PostgreSQL"
   - Railway will provision a database and provide connection string

4. **Configure Environment Variables**
   - Click on your backend service
   - Go to "Variables" tab
   - Add these variables:

   ```env
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-super-secret-production-jwt-key
   JWT_EXPIRES_IN=7d
   MISTRAL_API_KEY=your-mistral-api-key
   MISTRAL_MODEL_PRIMARY=mistral-large-latest
   MISTRAL_MODEL_SECONDARY=mistral-medium-latest
   MISTRAL_MAX_TOKENS=2000
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   API_BASE_URL=https://your-backend.railway.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Configure Build Settings**
   - Root Directory: `/backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma migrate deploy && node dist/server.js`

6. **Deploy**
   - Railway auto-deploys on push
   - Your backend URL: `https://your-app.railway.app`

---

### Option 2: Render

1. **Sign up at [Render.com](https://render.com/)**

2. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Choose free tier
   - Copy the "Internal Database URL"

3. **Create Web Service**
   - New → Web Service
   - Connect your GitHub repo
   - Settings:
     - Root Directory: `backend`
     - Build Command: `npm install && npx prisma generate && npm run build`
     - Start Command: `npx prisma migrate deploy && node dist/server.js`

4. **Add Environment Variables** (same as Railway)

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Why Vercel?** Built for React/Vite, automatic deployments, great performance.

#### Steps:

1. **Sign up at [Vercel.com](https://vercel.com/)**
   - Connect your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import your `NarrativeAI` repository
   - Vercel auto-detects Vite configuration

3. **Configure Project**
   - Root Directory: `./` (leave as root since package.json is there)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables**
   - Add this variable:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Your frontend URL: `https://your-app.vercel.app`

---

### Option 2: Netlify

1. **Sign up at [Netlify.com](https://netlify.com/)**

2. **Import from Git**
   - New site from Git → GitHub
   - Select your repository

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Environment Variables**
   - Site settings → Environment variables
   - Add: `VITE_API_URL=https://your-backend.railway.app`

---

## Update Frontend API Calls

Create an API configuration file:

### File: `src/config/api.ts`
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export { API_URL };
```

### Update App.tsx

Replace hardcoded URLs:
```typescript
// Change this:
fetch('http://localhost:3001/api/auth/login', ...)

// To this:
import { API_URL } from './config/api';
fetch(`${API_URL}/api/auth/login`, ...)
```

---

## Database Setup

### Railway PostgreSQL (Recommended)

1. **Automatic Setup**
   - Railway creates database automatically
   - Connection string available as `${{Postgres.DATABASE_URL}}`

2. **Run Migrations**
   - Migrations run automatically on deploy via start command
   - Or manually: `npx prisma migrate deploy`

3. **View Database**
   - Use Railway's built-in PostgreSQL explorer
   - Or connect with your preferred database client

---

## Google OAuth Production Setup

1. **Update Google Cloud Console**
   - Go to your OAuth credentials
   - Add production URLs to **Authorized JavaScript origins**:
     - `https://your-frontend.vercel.app`
     - `https://your-backend.railway.app`
   
   - Add to **Authorized redirect URIs**:
     - `https://your-backend.railway.app/api/auth/google/callback`

2. **Update Backend .env** (already done in deployment variables)

---

## Post-Deployment Checklist

### Backend
- [ ] Check backend health: `https://your-backend.railway.app/api/health`
- [ ] Verify database connection
- [ ] Test API endpoints with Postman/Thunder Client
- [ ] Check logs for errors

### Frontend
- [ ] Update `AuthModal.tsx` Google redirect URL:
  ```typescript
  // Change:
  window.location.href = 'http://localhost:3001/api/auth/google';
  // To:
  window.location.href = `${API_URL}/api/auth/google`;
  ```
- [ ] Test registration and login
- [ ] Test Google OAuth
- [ ] Verify all API calls work
- [ ] Check console for CORS errors

### Database
- [ ] Confirm tables created (User, Story, Checkpoint, etc.)
- [ ] Test creating a user
- [ ] Verify data persistence

---

## Environment Variables Summary

### Backend (Railway/Render)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=<from-railway-postgres>
JWT_SECRET=<generate-secure-key>
JWT_EXPIRES_IN=7d
MISTRAL_API_KEY=<your-key>
MISTRAL_MODEL_PRIMARY=mistral-large-latest
MISTRAL_MODEL_SECONDARY=mistral-medium-latest
MISTRAL_MAX_TOKENS=2000
CORS_ORIGIN=<your-frontend-url>
API_BASE_URL=<your-backend-url>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Vercel/Netlify)
```env
VITE_API_URL=<your-backend-url>
```

---

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` in backend matches your frontend URL
- Check that your backend allows credentials

### Database Connection Failed
- Verify `DATABASE_URL` is correct
- Check Railway/Render database status
- Ensure migrations ran successfully

### Google OAuth Not Working
- Verify redirect URIs in Google Cloud Console
- Check that production URLs are added
- Ensure `API_BASE_URL` is correct in backend

### Build Failures
- Check build logs in Railway/Vercel
- Verify all dependencies are in package.json
- Ensure TypeScript compiles without errors

---

## Monitoring & Maintenance

### Logs
- **Railway**: Click on service → Deployments → View logs
- **Vercel**: Project → Deployments → View function logs

### Database Backups
- **Railway**: Automatic backups on paid plans
- Manual backup: Use `pg_dump` or Railway CLI

### Updates
- Push to GitHub → Automatic deployment
- Monitor deployment status in Railway/Vercel dashboard

---

## Cost Estimation

### Free Tier Limits
- **Railway**: $5 free credit/month, ~500 hours
- **Vercel**: Unlimited bandwidth, 100 GB hours
- **Render**: 750 hours free tier
- **Netlify**: 100 GB bandwidth, 300 build minutes

### Paid Plans (if needed)
- **Railway**: $5/month for hobby plan
- **Vercel**: $20/month for pro
- **Render**: $7/month for starter

---

## Quick Deploy Commands

After configuring platforms, deployments are automatic via Git:

```bash
# Make changes
git add .
git commit -m "Update for production"
git push origin main

# Both frontend and backend deploy automatically!
```

---

## Support

- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- GitHub Issues: Create issues in your repo

---

## Next Steps

1. Choose deployment platforms
2. Set up accounts
3. Follow platform-specific steps above
4. Update environment variables
5. Test thoroughly
6. Share your deployed app! 🚀
