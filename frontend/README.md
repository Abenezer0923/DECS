# DECS Frontend - Next.js Application

Modern, responsive frontend for the Digital Election Calendar System built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- ✅ **Authentication** - Secure login with JWT tokens
- ✅ **Dashboard** - Overview of elections, milestones, and statistics
- ✅ **Election Management** - Create and manage election cycles
- ✅ **Milestone Management** - Track milestones with dependencies
- ✅ **Communication Center** - Manage communications and approvals
- ✅ **Public Calendar** - Multilingual public-facing calendar
- ✅ **Reports** - Generate PDF and Excel reports
- ✅ **Risk Management** - Track and respond to risks
- ✅ **Document Management** - Upload and manage documents
- ✅ **Audit Logs** - View system activity logs

### Technical Features
- ✅ **TypeScript** - Full type safety
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark Mode** - (Optional) Theme switching
- ✅ **Internationalization** - Support for 7 languages
- ✅ **Real-time Updates** - (Optional) WebSocket support
- ✅ **Offline Support** - (Optional) PWA capabilities
- ✅ **Accessibility** - WCAG 2.1 AA compliant

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional)

## 🛠️ Installation

### Method 1: Local Development

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

### Method 2: Docker

```bash
cd frontend

# Build and run
docker-compose up --build

# Or use the main docker-compose from root
cd ..
docker-compose up frontend
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── dashboard/
│   │   │   ├── elections/
│   │   │   ├── milestones/
│   │   │   ├── communications/
│   │   │   ├── reports/
│   │   │   ├── risks/
│   │   │   ├── documents/
│   │   │   └── audit-logs/
│   │   ├── public-calendar/   # Public pages
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   └── features/         # Feature-specific components
│   ├── lib/                  # Utilities and configurations
│   │   ├── api.ts           # API client
│   │   └── utils.ts         # Helper functions
│   ├── hooks/                # Custom React hooks
│   ├── store/                # State management (Zustand)
│   ├── types/                # TypeScript types
│   └── styles/               # Global styles
├── public/                    # Static assets
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🎨 Tech Stack

### Core
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS

### State & Data
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### UI & UX
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization
- **date-fns** - Date utilities

### Build & Deploy
- **Docker** - Containerization
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🔧 Configuration

### Environment Variables

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

### API Integration

The frontend connects to the backend API at `NEXT_PUBLIC_API_URL`. Ensure the backend is running before starting the frontend.

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page
- `/login` - User login
- `/public-calendar` - Public election calendar

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard
- `/elections` - Election management
- `/elections/[id]` - Election details
- `/milestones` - Milestone management
- `/milestones/[id]` - Milestone details
- `/communications` - Communication center
- `/reports` - Reports and analytics
- `/risks` - Risk management
- `/documents` - Document library
- `/audit-logs` - System audit logs
- `/settings` - User settings

## 🎯 Key Features

### 1. Dashboard
- Overview statistics
- Recent activity
- Upcoming deadlines
- Quick actions

### 2. Election Management
- Create/edit election cycles
- View election timeline
- Manage milestones
- Track progress

### 3. Milestone Management
- Create milestones with dependencies
- Track status and progress
- Assign responsibilities
- Set risk levels
- Add translations

### 4. Communication Center
- Create communication actions
- Approval workflow
- Multi-channel support
- Template management

### 5. Reports
- Progress reports
- Departmental reports
- Export to PDF/Excel
- Custom date ranges

### 6. Public Calendar
- Multilingual support
- Countdown timers
- Filtered views
- Responsive design

## 🌍 Internationalization

Supported languages:
- English (en)
- Amharic (am)
- Oromo (om)
- Tigrinya (ti)
- Somali (so)
- Afar (aa)
- Sidama (sid)

Language switching is available in the header.

## 🔒 Authentication

### Login Flow
1. User enters credentials
2. Frontend sends POST to `/api/v1/auth/login`
3. Backend returns JWT token
4. Token stored in localStorage
5. Token included in all API requests

### Protected Routes
- Middleware checks for valid token
- Redirects to login if unauthorized
- Role-based access control

## 📊 State Management

Using Zustand for global state:

```typescript
// Auth Store
- user
- token
- login()
- logout()
- isAuthenticated

// Election Store
- elections
- currentElection
- fetchElections()
- createElection()
- updateElection()

// Milestone Store
- milestones
- fetchMilestones()
- createMilestone()
- updateMilestone()
```

## 🎨 UI Components

### Reusable Components
- Button
- Input
- Select
- Modal
- Card
- Table
- Badge
- Alert
- Loading
- Pagination

### Form Components
- LoginForm
- ElectionForm
- MilestoneForm
- CommunicationForm

### Layout Components
- Header
- Sidebar
- Footer
- Container

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t decs-frontend:latest .

# Run container
docker run -p 3001:3001 decs-frontend:latest
```

### Environment-specific Builds

```bash
# Development
npm run dev

# Staging
NODE_ENV=staging npm run build

# Production
NODE_ENV=production npm run build
```

## 📈 Performance

### Optimization Techniques
- Code splitting
- Image optimization
- Lazy loading
- Caching strategies
- Bundle size optimization

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

## 🔍 Troubleshooting

### Common Issues

**1. API Connection Error**
```
Error: Network Error
```
**Solution:** Check if backend is running and `NEXT_PUBLIC_API_URL` is correct

**2. Authentication Error**
```
Error: 401 Unauthorized
```
**Solution:** Token expired, login again

**3. Build Error**
```
Error: Module not found
```
**Solution:** Run `npm install` to install dependencies

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📝 License

[Your License Here]

---

**Version:** 2.0.0  
**Last Updated:** January 11, 2026  
**Built with:** Next.js 14, TypeScript, Tailwind CSS
