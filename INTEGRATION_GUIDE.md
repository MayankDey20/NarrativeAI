# Frontend Integration Guide

This guide explains how to connect your React frontend to the NarrativeAI backend.

## Setup Steps

### 1. Install Axios in Frontend

```bash
cd "/Users/mayank/Documents/Narrative AI"
npm install axios
```

### 2. Create API Service File

Create `src/services/api.ts` in your frontend:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('narrativeflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('narrativeflow_token');
      localStorage.removeItem('narrativeflow_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Create API Methods

Create `src/services/narrative-api.ts`:

```typescript
import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  genre?: string;
  pov?: string;
  mode?: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

// Auth APIs
export const authAPI = {
  register: async (email: string, password: string, name: string) => {
    const { data } = await api.post('/auth/register', { email, password, name });
    return data;
  },
  
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  
  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },
};

// Story APIs
export const storyAPI = {
  create: async (storyData: {
    title: string;
    content: string;
    genre?: string;
    pov?: string;
    mode?: string;
  }) => {
    const { data } = await api.post('/stories', storyData);
    return data;
  },
  
  getAll: async (limit = 10, offset = 0) => {
    const { data } = await api.get(`/stories?limit=${limit}&offset=${offset}`);
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await api.get(`/stories/${id}`);
    return data;
  },
  
  update: async (id: string, updates: Partial<Story>) => {
    const { data } = await api.put(`/stories/${id}`, updates);
    return data;
  },
  
  delete: async (id: string) => {
    const { data } = await api.delete(`/stories/${id}`);
    return data;
  },
  
  createCheckpoint: async (storyId: string, content: string, label?: string) => {
    const { data } = await api.post(`/stories/${storyId}/checkpoints`, { content, label });
    return data;
  },
  
  getCheckpoints: async (storyId: string) => {
    const { data } = await api.get(`/stories/${storyId}/checkpoints`);
    return data;
  },
  
  loadCheckpoint: async (storyId: string, checkpointId: string) => {
    const { data } = await api.get(`/stories/${storyId}/checkpoints/${checkpointId}`);
    return data;
  },
};

// AI APIs
export const aiAPI = {
  generateStory: async (params: {
    prompt: string;
    genre: string;
    pov: string;
    creativity: number;
  }) => {
    const { data } = await api.post('/ai/generate', params);
    return data;
  },
  
  autoGenerate: async (params: {
    storyId?: string;
    currentContent: string;
    genre: string;
    pov: string;
    creativity: number;
  }) => {
    const { data } = await api.post('/ai/auto-generate', params);
    return data;
  },
  
  generateSummary: async (storyId: string, content: string) => {
    const { data } = await api.post('/ai/summary', { storyId, content });
    return data;
  },
  
  refinePrompt: async (originalPrompt: string, genre: string) => {
    const { data } = await api.post('/ai/refine-prompt', { originalPrompt, genre });
    return data;
  },
  
  rewrite: async (content: string, tone: string, creativity: number) => {
    const { data } = await api.post('/ai/rewrite', { content, tone, creativity });
    return data;
  },
  
  expand: async (content: string, creativity: number) => {
    const { data } = await api.post('/ai/expand', { content, creativity });
    return data;
  },
  
  generateChoices: async (params: {
    storyContent: string;
    genre: string;
    pov: string;
    creativity: number;
  }) => {
    const { data } = await api.post('/ai/choices', params);
    return data;
  },
};
```

### 4. Update Environment Variables

Add to frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 5. Update App.tsx

Replace your current App.tsx imports and add:

```typescript
import { useEffect, useState } from 'react';
import { authAPI, storyAPI, aiAPI } from './services/narrative-api';

// Update your existing functions to use the API:

// Generate Story
const handleGenerate = async () => {
  if (!selectedGenre || !pov || !currentStory.content) return;
  
  setIsGenerating(true);
  try {
    const result = await aiAPI.generateStory({
      prompt: currentStory.content,
      genre: selectedGenre,
      pov: pov,
      creativity: creativity,
    });
    
    // Update story with generated content
    setCurrentStory(prev => ({
      ...prev,
      content: result.generatedStory,
    }));
    
    // Generate new choices
    const choicesResult = await aiAPI.generateChoices({
      storyContent: result.generatedStory,
      genre: selectedGenre,
      pov: pov,
      creativity: creativity,
    });
    
    setChoices(choicesResult.choices);
  } catch (error) {
    console.error('Failed to generate story:', error);
    alert('Failed to generate story. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};

// Auto-generate
const handleAutoGenerate = async () => {
  if (!currentStory.content || !selectedGenre || !pov) return;
  
  try {
    const result = await aiAPI.autoGenerate({
      currentContent: currentStory.content,
      genre: selectedGenre,
      pov: pov,
      creativity: creativity,
    });
    
    setCurrentStory(prev => ({
      ...prev,
      content: prev.content + '\n\n' + result.continuation,
    }));
  } catch (error) {
    console.error('Auto-generate failed:', error);
  }
};

// Save Story
const handleSaveStory = async () => {
  try {
    if (currentStory.id) {
      // Update existing
      await storyAPI.update(currentStory.id, {
        content: currentStory.content,
      });
    } else {
      // Create new
      const result = await storyAPI.create({
        title: currentStory.title || 'Untitled Story',
        content: currentStory.content,
        genre: selectedGenre,
        pov: pov,
        mode: currentMode,
      });
      setCurrentStory(result.story);
    }
    alert('Story saved successfully!');
  } catch (error) {
    console.error('Failed to save story:', error);
    alert('Failed to save story');
  }
};

// Generate Summary
const handleGenerateSummary = async () => {
  if (!currentStory.content) return;
  
  try {
    const result = await aiAPI.generateSummary(
      currentStory.id || '',
      currentStory.content
    );
    alert(`Summary:\n\n${result.summary}`);
  } catch (error) {
    console.error('Failed to generate summary:', error);
  }
};

// Create Checkpoint
const handleCreateCheckpoint = async () => {
  if (!currentStory.id || !currentStory.content) return;
  
  try {
    await storyAPI.createCheckpoint(
      currentStory.id,
      currentStory.content,
      `Checkpoint ${new Date().toLocaleTimeString()}`
    );
    alert('Checkpoint created!');
  } catch (error) {
    console.error('Failed to create checkpoint:', error);
  }
};
```

### 6. Update AuthModal.tsx

Add actual authentication:

```typescript
const handleEmailSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const result = await authAPI.register(email, password, name);
    
    // Save token and user
    localStorage.setItem('narrativeflow_token', result.token);
    localStorage.setItem('narrativeflow_user', JSON.stringify(result.user));
    localStorage.setItem('narrativeflow_loggedIn', 'true');
    
    onLogin(result.user);
  } catch (error: any) {
    alert(error.response?.data?.message || 'Registration failed');
  }
};

const handleEmailLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const result = await authAPI.login(email, password);
    
    // Save token and user
    localStorage.setItem('narrativeflow_token', result.token);
    localStorage.setItem('narrativeflow_user', JSON.stringify(result.user));
    localStorage.setItem('narrativeflow_loggedIn', 'true');
    
    onLogin(result.user);
  } catch (error: any) {
    alert(error.response?.data?.message || 'Login failed');
  }
};
```

### 7. Update CenterPanel.tsx

Wire up the control buttons:

```typescript
// In CenterPanel component, update button onClick handlers:

<Button 
  variant="secondary"
  onClick={handleAutoGenerate}
  className="flex-1 text-sm py-2"
>
  <span className="mr-1.5">↻</span>
  Auto Generate
</Button>

<Button 
  variant="secondary"
  onClick={handleCreateCheckpoint}
  className="flex-1 text-sm py-2"
>
  <span className="mr-1.5">⟲</span>
  Reload Checkpoint
</Button>

<Button 
  variant="outline"
  onClick={handleGenerateSummary}
  className="flex-1 text-sm py-2"
>
  <span className="mr-1.5">📋</span>
  Story Summary
</Button>
```

## Testing the Integration

### 1. Start Backend

```bash
cd backend
npm run dev
```

### 2. Start Frontend

```bash
cd ..
npm run dev
```

### 3. Test Flow

1. Open http://localhost:5173
2. Register a new account
3. Create a story prompt
4. Click "Generate Story"
5. Try other features (auto-generate, summary, checkpoints)

## Common Issues

### CORS Error
- Make sure backend CORS_ORIGIN matches frontend URL
- Check that backend is running on port 3001

### 401 Unauthorized
- Token expired or invalid
- Re-login to get new token

### Mistral API Error
- Verify MISTRAL_API_KEY in backend .env
- Check you have credits in your Mistral account

## Next Steps

1. Add loading states for all API calls
2. Add error handling and user feedback
3. Implement auto-save functionality
4. Add offline support with local storage
5. Implement real-time updates with WebSockets

## Production Deployment

### Backend
- Deploy to Railway, Render, or AWS
- Use environment variables for secrets
- Enable HTTPS
- Set up PostgreSQL database

### Frontend
- Update VITE_API_BASE_URL to production backend URL
- Deploy to Vercel, Netlify, or similar
- Enable HTTPS

### Environment Variables
```env
# Production Backend .env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=strong-random-secret
MISTRAL_API_KEY=your-key
CORS_ORIGIN=https://your-frontend-domain.com

# Production Frontend .env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```
