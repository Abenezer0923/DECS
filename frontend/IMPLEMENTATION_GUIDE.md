# DECS Frontend Implementation Guide

This guide explains how to implement the complete frontend application step by step.

## Phase 1: Core Setup (Completed ✅)

### Files Created:
- ✅ `package.json` - Dependencies and scripts
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `next.config.js` - Next.js configuration
- ✅ `tailwind.config.ts` - Tailwind CSS configuration
- ✅ `Dockerfile` - Docker configuration
- ✅ `docker-compose.yml` - Docker Compose setup
- ✅ `.env.local` - Environment variables
- ✅ `.gitignore` - Git ignore rules

### What's Configured:
- Next.js 14 with App Router
- TypeScript with strict mode
- Tailwind CSS with custom theme
- Docker multi-stage build
- Path aliases (@/*)
- Internationalization (7 languages)

---

## Phase 2: Type Definitions & Utilities (Completed ✅)

### Files Created:
- ✅ `src/types/index.ts` - All TypeScript interfaces
- ✅ `src/lib/api.ts` - API client with Axios
- ✅ `src/lib/utils.ts` - Utility functions

### What's Included:
- Complete type definitions for all entities
- API client with interceptors
- Authentication handling
- Error handling
- Utility functions (date formatting, status colors, etc.)

---

## Phase 3: State Management (To Implement)

### Files to Create:

#### 1. Auth Store
```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        localStorage.setItem('token', response.token);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

#### 2. Election Store
```typescript
// src/store/electionStore.ts
import { create } from 'zustand';

interface ElectionState {
  elections: ElectionCycle[];
  currentElection: ElectionCycle | null;
  loading: boolean;
  error: string | null;
  fetchElections: () => Promise<void>;
  createElection: (data: CreateElectionForm) => Promise<void>;
  updateElection: (id: number, data: Partial<ElectionCycle>) => Promise<void>;
  deleteElection: (id: number) => Promise<void>;
  setCurrentElection: (election: ElectionCycle | null) => void;
}

export const useElectionStore = create<ElectionState>((set) => ({
  elections: [],
  currentElection: null,
  loading: false,
  error: null,
  
  fetchElections: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.get<ElectionCycle[]>('/elections');
      set({ elections: data, loading: false });
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
    }
  },
  
  createElection: async (data) => {
    const election = await apiClient.post<ElectionCycle>('/elections', data);
    set((state) => ({
      elections: [...state.elections, election],
    }));
  },
  
  // ... other methods
}));
```

#### 3. Milestone Store
```typescript
// src/store/milestoneStore.ts
// Similar structure to election store
```

---

## Phase 4: UI Components (To Implement)

### Base Components

#### 1. Button Component
```typescript
// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
            'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
            'hover:bg-gray-100': variant === 'ghost',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading && <span className="mr-2">Loading...</span>}
        {children}
      </button>
    );
  }
);
```

#### 2. Input Component
```typescript
// src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);
```

#### 3. Card Component
```typescript
// src/components/ui/Card.tsx
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function Card({ className, title, description, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}
```

---

## Phase 5: Layout Components (To Implement)

#### 1. Header Component
```typescript
// src/components/layout/Header.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary-600">DECS</h1>
          <nav className="hidden md:flex space-x-4">
            <a href="/dashboard" className="text-gray-700 hover:text-primary-600">
              Dashboard
            </a>
            <a href="/elections" className="text-gray-700 hover:text-primary-600">
              Elections
            </a>
            <a href="/milestones" className="text-gray-700 hover:text-primary-600">
              Milestones
            </a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user?.username} ({user?.role})
          </span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
```

#### 2. Sidebar Component
```typescript
// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Elections', href: '/elections', icon: '🗳️' },
  { name: 'Milestones', href: '/milestones', icon: '📅' },
  { name: 'Communications', href: '/communications', icon: '📢' },
  { name: 'Reports', href: '/reports', icon: '📈' },
  { name: 'Risks', href: '/risks', icon: '⚠️' },
  { name: 'Documents', href: '/documents', icon: '📄' },
  { name: 'Audit Logs', href: '/audit-logs', icon: '📋' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-2 rounded-md transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

---

## Phase 6: Pages (To Implement)

### App Router Structure

```
src/app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Landing page
├── (auth)/
│   ├── layout.tsx            # Auth layout
│   └── login/
│       └── page.tsx          # Login page
├── (dashboard)/
│   ├── layout.tsx            # Dashboard layout (with sidebar)
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard page
│   ├── elections/
│   │   ├── page.tsx          # Elections list
│   │   ├── [id]/
│   │   │   └── page.tsx      # Election details
│   │   └── new/
│   │       └── page.tsx      # Create election
│   ├── milestones/
│   │   ├── page.tsx          # Milestones list
│   │   └── [id]/
│   │       └── page.tsx      # Milestone details
│   └── ...
└── public-calendar/
    └── page.tsx              # Public calendar
```

#### Root Layout
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DECS - Digital Election Calendar System',
  description: 'Manage electoral calendars and milestones',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

#### Login Page
```typescript
// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ username, password });
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">DECS</h2>
          <p className="mt-2 text-center text-gray-600">
            Digital Election Calendar System
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
```

#### Dashboard Page
```typescript
// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api';
import { DashboardStats } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Fetch dashboard stats
    apiClient.get<DashboardStats>('/dashboard/stats')
      .then(setStats)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Elections">
          <p className="text-4xl font-bold">{stats?.totalElections || 0}</p>
        </Card>
        
        <Card title="Active Milestones">
          <p className="text-4xl font-bold">{stats?.activeMilestones || 0}</p>
        </Card>
        
        <Card title="Pending Communications">
          <p className="text-4xl font-bold">{stats?.pendingCommunications || 0}</p>
        </Card>
        
        <Card title="Delayed Milestones">
          <p className="text-4xl font-bold text-red-600">
            {stats?.delayedMilestones || 0}
          </p>
        </Card>
      </div>
    </div>
  );
}
```

---

## Phase 7: Forms & Validation (To Implement)

Use React Hook Form with Zod validation:

```typescript
// src/components/forms/ElectionForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['National', 'ByElection', 'Referendum']),
  startDate: z.string(),
  endDate: z.string(),
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
  message: 'Start date must be before end date',
  path: ['startDate'],
});

export function ElectionForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Election Name"
        {...register('name')}
        error={errors.name?.message}
      />
      
      {/* More fields... */}
      
      <Button type="submit">Create Election</Button>
    </form>
  );
}
```

---

## Implementation Checklist

### Phase 1: Setup ✅
- [x] Package.json
- [x] TypeScript config
- [x] Next.js config
- [x] Tailwind config
- [x] Docker setup

### Phase 2: Core Files ✅
- [x] Type definitions
- [x] API client
- [x] Utility functions

### Phase 3: State Management ⏳
- [ ] Auth store
- [ ] Election store
- [ ] Milestone store
- [ ] Communication store

### Phase 4: UI Components ⏳
- [ ] Button
- [ ] Input
- [ ] Select
- [ ] Card
- [ ] Modal
- [ ] Table
- [ ] Badge

### Phase 5: Layout ⏳
- [ ] Header
- [ ] Sidebar
- [ ] Footer
- [ ] Container

### Phase 6: Pages ⏳
- [ ] Landing page
- [ ] Login page
- [ ] Dashboard
- [ ] Elections list
- [ ] Election details
- [ ] Milestones list
- [ ] Milestone details
- [ ] Communications
- [ ] Reports
- [ ] Public calendar

### Phase 7: Features ⏳
- [ ] Authentication flow
- [ ] CRUD operations
- [ ] File uploads
- [ ] Report generation
- [ ] Multilingual support
- [ ] Real-time updates

---

## Next Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development**
   ```bash
   npm run dev
   ```

3. **Implement Components**
   - Start with UI components
   - Then layout components
   - Then pages

4. **Test Features**
   - Test each component
   - Test API integration
   - Test user flows

5. **Deploy**
   - Build for production
   - Deploy with Docker

---

**Estimated Time:** 2-3 weeks for full implementation  
**Difficulty:** Intermediate  
**Team Size:** 2-3 developers recommended
