# DECS Backend - Digital Election Calendar System

A comprehensive backend system for managing electoral calendars, milestones, communications, and compliance for national election management.

## 🚀 Features

### Core Functionality
- ✅ **Electoral Calendar Management** - Multiple election cycles with statutory and flexible milestones
- ✅ **Milestone Dependencies** - Automatic date recalculation with dependency tracking
- ✅ **Communication Management** - Multi-channel communication planning and approval workflows
- ✅ **Role-Based Access Control** - Granular permissions for different departments
- ✅ **Alerts & Notifications** - Automated deadline reminders and escalation workflows
- ✅ **Public Calendar API** - Multilingual public-facing calendar with selective publishing
- ✅ **Risk Management** - Risk assessment and rapid response capabilities
- ✅ **Audit Trail** - Comprehensive logging of all system changes
- ✅ **Document Management** - File attachments for milestones
- ✅ **Reporting** - PDF and Excel export capabilities

### Advanced Features (New)
- ✅ **Workflow Automation** - Approval workflows and status transition validation
- ✅ **Circular Dependency Detection** - Prevents invalid milestone relationships
- ✅ **Statutory Date Protection** - Role-based restrictions on statutory milestone changes
- ✅ **Enhanced Notifications** - Email and SMS support with escalation to management
- ✅ **Input Validation** - Comprehensive request validation using Zod
- ✅ **Rate Limiting** - API protection against abuse
- ✅ **Error Handling** - Structured error responses and logging
- ✅ **Pagination** - Efficient data retrieval for large datasets
- ✅ **Security Hardening** - Helmet.js, CORS, password policies

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+ (managed via Docker)

## 🛠️ Getting Started

### 1. Clone and Setup

```bash
git clone <repository-url>
cd backend
```

### 2. Environment Configuration

Create a `.env` file:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:password@db:5432/decs_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="DECS System <noreply@decs.et>"

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# SMS Configuration (Future)
SMS_GATEWAY_URL=
SMS_API_KEY=
```

### 3. Start with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f api
```

### 4. Database Setup

```bash
# Run migrations
docker-compose exec api npx prisma migrate deploy

# Seed initial data
docker-compose exec api npx prisma db seed
```

### 5. Access the Application

- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 📚 API Documentation

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration (Admin only)

#### Election Cycles
- `GET /api/v1/elections` - List all election cycles
- `POST /api/v1/elections` - Create new election cycle
- `GET /api/v1/elections/:id` - Get election cycle details
- `PUT /api/v1/elections/:id` - Update election cycle
- `DELETE /api/v1/elections/:id` - Delete election cycle

#### Milestones
- `GET /api/v1/milestones?electionCycleId=1&lang=en` - List milestones
- `POST /api/v1/milestones` - Create milestone
- `PUT /api/v1/milestones/:id` - Update milestone (triggers dependency recalculation)
- `DELETE /api/v1/milestones/:id` - Delete milestone

#### Workflow (New)
- `POST /api/v1/workflow/approve-communication/:id` - Approve/reject communication
- `POST /api/v1/workflow/validate-transition` - Validate status transition
- `POST /api/v1/workflow/check-circular-dependency` - Check for circular dependencies
- `GET /api/v1/workflow/validate-statutory/:milestoneId` - Validate statutory change permission

#### Notifications (New)
- `POST /api/v1/notifications/send-to-role` - Send notification to role
- `POST /api/v1/notifications/escalate/:milestoneId` - Escalate to management
- `POST /api/v1/notifications/deadline` - Send deadline notification

#### Communications
- `GET /api/v1/communications?milestoneId=1` - List communication actions
- `POST /api/v1/communications` - Create communication action
- `PUT /api/v1/communications/:id` - Update communication action

#### Public API
- `GET /api/v1/public/calendar?lang=am` - Get published calendar entries

#### Reports
- `GET /api/v1/reports/progress?format=pdf` - Generate progress report
- `GET /api/v1/reports/progress?format=excel` - Export to Excel

#### Risk Management
- `POST /api/v1/risk-responses` - Create risk response
- `GET /api/v1/risk-responses/:milestoneId` - Get risk responses for milestone

#### Audit Logs
- `GET /api/v1/audit-logs?entityTable=Milestone&limit=50` - View audit trail

## 🔒 Security Features

### Implemented
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting on all API endpoints
- Helmet.js security headers
- CORS configuration
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- Comprehensive audit logging

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Express middlewares
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations
│   └── seed.ts          # Seed data
├── uploads/             # File storage
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- milestone.test.ts
```

## 📊 Background Jobs

The system runs several automated background tasks:

1. **Alert Checker** - Runs daily at midnight to check upcoming deadlines
2. **Status Updater** - Runs hourly to auto-update milestone statuses
3. **Rate Limit Cleanup** - Runs every minute to clean expired rate limit entries

## 🌍 Multilingual Support

The system supports multiple languages for public-facing content:

- English (en)
- Amharic (am)
- Oromo (om)
- Tigrinya (ti)
- Somali (so)
- Afar (aa)
- Sidama (sid)

Add translations when creating/updating milestones:

```json
{
  "title": "Voter Registration",
  "translations": [
    {
      "language": "am",
      "title": "የመራጮች ምዝገባ",
      "description": "..."
    }
  ]
}
```

## 🚀 Deployment

### Production Checklist

- [ ] Update `JWT_SECRET` to a strong random value
- [ ] Configure production database URL
- [ ] Set `NODE_ENV=production`
- [ ] Configure SMTP credentials for email notifications
- [ ] Set up SMS gateway integration
- [ ] Configure `ALLOWED_ORIGINS` for CORS
- [ ] Set up SSL/TLS certificates
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging
- [ ] Review and adjust rate limits
- [ ] Enable database connection pooling
- [ ] Set up Redis for caching (optional)

### Docker Production Build

```bash
# Build production image
docker build -t decs-backend:latest .

# Run with production env
docker run -p 3000:3000 --env-file .env.production decs-backend:latest
```

## 📈 Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "UP",
  "timestamp": "2026-01-02T10:30:00.000Z",
  "environment": "production"
}
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📝 License

[Your License Here]

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api-docs`

---

**Version**: 2.0.0  
**Last Updated**: January 2, 2026
