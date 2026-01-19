# NarrativeAI - Quick Start Guide

Complete guide to get your NarrativeAI application running with backend and frontend.

## Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**
- **Mistral AI API Key** (get from https://console.mistral.ai)

## Step-by-Step Setup

### 1. Clone/Navigate to Project

```bash
cd "/Users/mayank/Documents/Narrative AI"
```

### 2. Setup PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Start PostgreSQL service
# macOS with Homebrew:
brew services start postgresql@14

# Create database
createdb narrativeai

# Your DATABASE_URL will be:
# postgresql://your_username@localhost:5432/narrativeai
```

**Option B: Use Cloud PostgreSQL**
- Railway: https://railway.app (free tier available)
- Supabase: https://supabase.com (free tier available)
- ElephantSQL: https://www.elephantsql.com (free tier available)

### 3. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings
# Required fields:
#   - DATABASE_URL: Your PostgreSQL connection string
#   - JWT_SECRET: Any random secure string
#   - MISTRAL_API_KEY: Your Mistral AI API key
nano .env  # or use any text editor

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start backend server
npm run dev
```

Backend will run on: http://localhost:3001

### 4. Setup Frontend

```bash
# Open new terminal, navigate to project root
cd "/Users/mayank/Documents/Narrative AI"

# Install axios for API calls
npm install axios

# Create frontend .env
echo "VITE_API_BASE_URL=http://localhost:3001/api" > .env

# Start frontend
npm run dev
```

Frontend will run on: http://localhost:5173

### 5. Verify Setup

**Check Backend:**
```bash
curl http://localhost:3001/api/health
# Should return: {"success":true,"message":"Server is running"}
```

**Check Frontend:**
- Open http://localhost:5173 in browser
- Should see the NarrativeAI interface

## Configuration Files

### Backend .env
```env
# Server
NODE_ENV=development
PORT=3001
API_BASE_URL=http://localhost:3001

# Database - UPDATE THIS
DATABASE_URL="postgresql://username:password@localhost:5432/narrativeai?schema=public"

# JWT - CHANGE THIS
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Mistral AI - GET YOUR KEY FROM https://console.mistral.ai
MISTRAL_API_KEY=your-mistral-api-key-here
MISTRAL_MODEL_PRIMARY=mistral-large-latest
MISTRAL_MODEL_SECONDARY=mistral-medium-latest
MISTRAL_MAX_TOKENS=2000

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend .env
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Testing the Application

### 1. Register Account
1. Open http://localhost:5173
2. Click on login/register
3. Create an account with email and password

### 2. Generate Story
1. Select a genre (Fantasy, Sci-Fi, etc.)
2. Select POV (1st, 2nd, or 3rd person)
3. Set creativity level (1-10)
4. Type a story prompt (e.g., "A lone astronaut discovers an ancient alien artifact")
5. Click "Generate Story"

### 3. Try Features
- **Auto Generate**: Continue the story automatically
- **Story Summary**: Get a brief summary of your story
- **Reload Checkpoint**: Save and reload story versions
- **Refine Prompt**: Improve your story prompt
- **AI Suggestions**: Get continuation choices

## Troubleshooting

### Backend won't start

**Issue:** `Error: DATABASE_URL not found`
- **Fix:** Make sure `.env` exists in backend directory
- Check DATABASE_URL is correctly formatted

**Issue:** `Error: connect ECONNREFUSED`
- **Fix:** PostgreSQL is not running
- Start PostgreSQL: `brew services start postgresql@14`

**Issue:** `Mistral API error`
- **Fix:** Invalid or missing MISTRAL_API_KEY
- Get API key from https://console.mistral.ai
- Update MISTRAL_API_KEY in backend/.env

### Frontend won't connect

**Issue:** `Network Error` or `CORS error`
- **Fix:** Backend is not running
- Start backend: `cd backend && npm run dev`

**Issue:** `401 Unauthorized`
- **Fix:** Token expired or invalid
- Logout and login again

### Database issues

**Issue:** `Migration failed`
```bash
# Reset database
cd backend
npm run prisma:migrate reset

# Regenerate client
npm run prisma:generate
```

**Issue:** `Cannot connect to database`
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in .env
- Test connection: `psql $DATABASE_URL`

## Development Workflow

### Making Changes

**Backend changes:**
- Edit files in `backend/src/`
- Server auto-restarts (tsx watch)
- Check logs in terminal

**Frontend changes:**
- Edit files in `src/`
- Vite hot-reloads automatically
- Check browser console for errors

### Database Changes

```bash
cd backend

# Create migration
npx prisma migrate dev --name your_migration_name

# View database
npm run prisma:studio
```

### API Testing

Use curl or Postman:

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Generate Story (replace YOUR_TOKEN)
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "prompt": "A detective in a cyberpunk city",
    "genre": "scifi",
    "pov": "third",
    "creativity": 7
  }'
```

## Project Structure

```
Narrative AI/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation
│   │   └── utils/          # Utilities
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── .env                # Backend config
│   └── package.json
│
├── src/                    # Frontend React app
│   ├── components/         # UI components
│   ├── services/           # API integration
│   └── App.tsx            # Main app
│
├── .env                    # Frontend config
└── package.json

```

## Useful Commands

### Backend
```bash
cd backend
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build
npm run prisma:studio # Open database GUI
npm run prisma:migrate # Run migrations
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Next Steps

1. **Integrate Frontend with Backend**
   - Follow `INTEGRATION_GUIDE.md`
   - Implement API calls in React components

2. **Add Features**
   - Story export (PDF, DOCX)
   - Collaborative editing
   - Story templates
   - Advanced AI controls

3. **Deploy to Production**
   - Backend: Railway, Render, AWS
   - Frontend: Vercel, Netlify
   - Database: Use managed PostgreSQL

4. **Fine-tune AI Model**
   - Collect user feedback
   - Export training data
   - Train custom Mistral model

## Resources

- **Backend README**: `backend/README.md`
- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Mistral AI Docs**: https://docs.mistral.ai
- **Prisma Docs**: https://www.prisma.io/docs

## Support

If you encounter issues:
1. Check error messages in terminal
2. Review logs in browser console
3. Verify all environment variables
4. Ensure PostgreSQL and backend are running

## Mistral AI Costs

Free tier: €5 credit (~$5.50 USD)

Estimated costs per story generation:
- **Mistral Small**: ~$0.001 per story (500-5000 stories with free credits)
- **Mistral Large**: ~$0.01 per story (50-500 stories with free credits)

Monitor usage at: https://console.mistral.ai
