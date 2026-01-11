# DECS Frontend Setup Guide

Complete guide to set up and run the DECS frontend application.

## Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment

```bash
# Copy the environment file
cp .env.local .env.local

# Edit if needed (default values work with backend on localhost:3000)
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Open Browser

```
http://localhost:3001
```

### Step 5: Login

```
Username: admin
Password: Admin@123
```

✅ **Done!** You should see the dashboard.

---

## Detailed Setup

### Prerequisites

1. **Node.js 18+**
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **npm or yarn**
   ```bash
   npm --version
   ```

3. **Backend Running**
   - Backend must be running on `http://localhost:3000`
   - See `backend/README.md` for backend setup

### Installation Steps

#### 1. Clone and Navigate

```bash
cd frontend
```

#### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Zustand
- React Hook Form
- And more...

#### 3. Environment Configuration

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME=DECS
NEXT_PUBLIC_APP_VERSION=2.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_MULTILINGUAL=true
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

**Important:** 
- `NEXT_PUBLIC_` prefix makes variables available in the browser
- Change `NEXT_PUBLIC_API_URL` if backend is on different host/port

#### 4. Start Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.1.0
- Local:        http://localhost:3001
- Ready in 2.3s
```

#### 5. Verify Setup

Open browser and navigate to:
```
http://localhost:3001
```

You should see the DECS landing page.

---

## Docker Setup

### Using Docker Compose (Recommended)

#### 1. Build and Run

```bash
cd frontend
docker-compose up --build
```

#### 2. Access Application

```
http://localhost:3001
```

### Using Dockerfile Directly

#### 1. Build Image

```bash
docker build -t decs-frontend:latest .
```

#### 2. Run Container

```bash
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 \
  decs-frontend:latest
```

### Full Stack with Docker

From the project root:

```bash
# Start both backend and frontend
docker-compose up

# Backend: http://localhost:3000
# Frontend: http://localhost:3001
```

---

## Project Structure

After setup, your project should look like this:

```
frontend/
├── node_modules/          # Dependencies (created after npm install)
├── public/                # Static files
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   ├── hooks/            # Custom hooks
│   ├── store/            # State management
│   ├── types/            # TypeScript types
│   └── styles/           # Global styles
├── .env.local            # Environment variables (create this)
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Development Workflow

### 1. Start Backend First

```bash
cd backend
docker-compose up
```

Wait for: `Server is running on port 3000`

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Make Changes

- Edit files in `src/`
- Changes auto-reload (Hot Module Replacement)
- Check browser console for errors

### 4. Test Features

1. **Login**
   - Go to `/login`
   - Use: admin / Admin@123

2. **Dashboard**
   - View statistics
   - See recent activity

3. **Elections**
   - Create new election
   - View election list

4. **Milestones**
   - Create milestone
   - Update status

---

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 3001)

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types

# Testing (when implemented)
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

---

## Configuration Files

### next.config.js

```javascript
module.exports = {
  reactStrictMode: true,
  output: 'standalone',  // For Docker
  
  images: {
    domains: ['localhost'],
  },

  i18n: {
    locales: ['en', 'am', 'om', 'ti', 'so', 'aa', 'sid'],
    defaultLocale: 'en',
  },
};
```

### tailwind.config.ts

```typescript
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { /* ... */ },
        secondary: { /* ... */ },
      },
    },
  },
};
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Connecting to Backend

### API Client Setup

The frontend uses Axios to communicate with the backend:

```typescript
// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Making API Calls

```typescript
// Login
const response = await apiClient.post('/auth/login', {
  username: 'admin',
  password: 'Admin@123',
});

// Get elections
const elections = await apiClient.get('/elections');

// Create milestone
const milestone = await apiClient.post('/milestones', data);
```

---

## Troubleshooting

### Issue 1: Port Already in Use

```
Error: Port 3001 is already in use
```

**Solution:**
```bash
# Find process using port 3001
lsof -i :3001  # Mac/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process or use different port
PORT=3002 npm run dev
```

### Issue 2: Cannot Connect to Backend

```
Error: Network Error
```

**Solutions:**
1. Check backend is running: `http://localhost:3000/health`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check CORS settings in backend
4. Disable browser extensions (ad blockers)

### Issue 3: Module Not Found

```
Error: Cannot find module '@/components/...'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: TypeScript Errors

```
Error: Type 'X' is not assignable to type 'Y'
```

**Solution:**
```bash
# Check types
npm run type-check

# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Issue 5: Styles Not Loading

```
Tailwind classes not working
```

**Solution:**
1. Check `tailwind.config.ts` content paths
2. Restart dev server
3. Clear `.next` folder:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## IDE Setup

### VS Code (Recommended)

#### Extensions

Install these extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

#### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Testing the Application

### Manual Testing Checklist

- [ ] Login page loads
- [ ] Can login with admin credentials
- [ ] Dashboard shows statistics
- [ ] Can create election cycle
- [ ] Can create milestone
- [ ] Can view election details
- [ ] Can create communication
- [ ] Can generate reports
- [ ] Can view public calendar
- [ ] Can logout

### Test Users

```
Admin:
  Username: admin
  Password: Admin@123
  Access: Full system access

Board Member:
  Username: board_member
  Password: Admin@123
  Access: View and approve

Communication Officer:
  Username: comm_officer
  Password: Admin@123
  Access: Manage communications
```

---

## Production Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Test production build locally
npm start
```

### Environment Variables

Create `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.et/api/v1
NEXT_PUBLIC_APP_NAME=DECS
NEXT_PUBLIC_APP_VERSION=2.0.0
```

### Docker Production

```bash
# Build production image
docker build -t decs-frontend:prod .

# Run production container
docker run -p 3001:3001 \
  --env-file .env.production \
  decs-frontend:prod
```

---

## Performance Optimization

### 1. Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="DECS Logo"
  width={200}
  height={50}
  priority
/>
```

### 2. Code Splitting

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### 3. Caching

```typescript
// API calls with caching
const { data } = useSWR('/elections', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000,
});
```

---

## Next Steps

1. ✅ Complete setup
2. ✅ Test login
3. ✅ Explore dashboard
4. ⏳ Create test data
5. ⏳ Customize theme
6. ⏳ Add custom features
7. ⏳ Deploy to production

---

## Getting Help

- **Documentation:** See `README.md`
- **Backend API:** `http://localhost:3000/api-docs`
- **Issues:** Create issue in repository
- **Questions:** Contact development team

---

**Setup Time:** 5-10 minutes  
**Difficulty:** Beginner  
**Prerequisites:** Node.js 18+, Backend running

Happy Coding! 🚀
