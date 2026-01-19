# NarrativeAI Backend

Backend API for the NarrativeAI story generator application with Mistral AI integration.

## Features

- 🔐 User authentication (JWT-based)
- 📝 Story CRUD operations
- 🤖 AI story generation with Mistral AI
- 💾 Checkpoint system for story versioning
- 📊 User statistics tracking
- 🎨 Fine-tuning support (ready for custom models)

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Mistral AI API
- **Authentication**: JWT + bcrypt

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/narrativeai?schema=public"

# JWT Secret - Generate a secure random string
JWT_SECRET=your-super-secret-jwt-key-change-this

# Mistral AI - Get your API key from https://console.mistral.ai
MISTRAL_API_KEY=your-mistral-api-key-here

# Server
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Database Setup

Make sure PostgreSQL is installed and running, then:

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view your database
npm run prisma:studio
```

### 4. Start the Server

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The server will start on http://localhost:3001

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Stories

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/stories` | Create new story |
| GET | `/api/stories` | Get all user stories |
| GET | `/api/stories/:id` | Get story by ID |
| PUT | `/api/stories/:id` | Update story |
| DELETE | `/api/stories/:id` | Delete story |

### Checkpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/stories/:id/checkpoints` | Create checkpoint |
| GET | `/api/stories/:id/checkpoints` | Get all checkpoints |
| GET | `/api/stories/:id/checkpoints/:checkpointId` | Get specific checkpoint |

### AI Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Generate story from prompt |
| POST | `/api/ai/auto-generate` | Auto-continue story |
| POST | `/api/ai/summary` | Generate story summary |
| POST | `/api/ai/refine-prompt` | Refine user prompt |
| POST | `/api/ai/rewrite` | Rewrite content with tone |
| POST | `/api/ai/expand` | Expand content with details |
| POST | `/api/ai/choices` | Generate story continuation choices |

## Example API Calls

### Register User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Generate Story

```bash
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "prompt": "A cyberpunk detective uncovers a conspiracy in Neo Tokyo",
    "genre": "scifi",
    "pov": "third",
    "creativity": 8
  }'
```

### Create Story

```bash
curl -X POST http://localhost:3001/api/stories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Neon Conspiracy",
    "content": "In the year 2084, Neo Tokyo glowed with artificial light...",
    "genre": "scifi",
    "pov": "third",
    "mode": "ai-assisted"
  }'
```

## Mistral AI Configuration

The backend supports multiple Mistral models:

- **mistral-large-latest**: Used for story generation (high quality)
- **mistral-medium-latest**: Used for summaries and refinements (faster)

Temperature is automatically mapped from the creativity slider (1-10) to Mistral's temperature range (0.3-1.0).

## Fine-Tuning Support

The backend is designed to support fine-tuning:

1. All AI generations are logged in the `ai_generations` table
2. Track user feedback and preferences
3. Export data for fine-tuning datasets
4. Switch models via environment variables

To prepare for fine-tuning:
- Collect high-quality prompt/response pairs
- Filter based on user satisfaction metrics
- Format as JSONL for Mistral fine-tuning API

## Database Schema

- **users**: User accounts and profiles
- **stories**: User-created stories
- **checkpoints**: Story version snapshots
- **ai_generations**: AI generation logs and analytics
- **user_stats**: Aggregated user statistics

## Development

### Run Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

### Create New Migration

```bash
npx prisma migrate dev --name migration_name
```

### Reset Database

```bash
npx prisma migrate reset
```

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation

## Performance

- Database connection pooling
- Efficient queries with Prisma
- Proper indexing on frequently queried fields
- Token usage tracking for cost monitoring

## License

MIT
