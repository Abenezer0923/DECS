# DECS Testing Guide

## Overview

This guide covers testing strategies, test setup, and best practices for the DECS backend.

## Testing Stack

- **Test Framework**: Jest
- **API Testing**: Supertest
- **Database**: PostgreSQL test database
- **Mocking**: Jest mocks

## Test Structure

```
backend/src/tests/
├── unit/              # Unit tests for services and utilities
├── integration/       # API endpoint tests
├── fixtures/          # Test data
└── setup.ts          # Test configuration
```

## Setup

### 1. Test Database

Create a separate test database:

```sql
CREATE DATABASE decs_test;
CREATE USER decs_test_user WITH PASSWORD 'test_password';
GRANT ALL PRIVILEGES ON DATABASE decs_test TO decs_test_user;
```

### 2. Test Environment

Create `.env.test`:

```env
NODE_ENV=test
DATABASE_URL="postgresql://decs_test_user:test_password@localhost:5432/decs_test?schema=public"
JWT_SECRET=test-secret-key
```

### 3. Jest Configuration

Update `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/tests/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- milestone.test.ts

# Run in watch mode
npm test -- --watch

# Run integration tests only
npm test -- integration/
```

## Test Examples

### Unit Test Example

```typescript
// src/tests/unit/workflowService.test.ts
import { WorkflowService } from '../../services/workflowService';
import { MilestoneStatus } from '@prisma/client';

describe('WorkflowService', () => {
  describe('isValidStatusTransition', () => {
    it('should allow transition from Planned to Ongoing', () => {
      const result = WorkflowService.isValidStatusTransition(
        MilestoneStatus.Planned,
        MilestoneStatus.Ongoing
      );
      expect(result).toBe(true);
    });

    it('should not allow transition from Completed to Ongoing', () => {
      const result = WorkflowService.isValidStatusTransition(
        MilestoneStatus.Completed,
        MilestoneStatus.Ongoing
      );
      expect(result).toBe(false);
    });

    it('should allow transition from Delayed to Ongoing', () => {
      const result = WorkflowService.isValidStatusTransition(
        MilestoneStatus.Delayed,
        MilestoneStatus.Ongoing
      );
      expect(result).toBe(true);
    });
  });
});
```

### Integration Test Example

```typescript
// src/tests/integration/milestone.test.ts
import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Milestone API', () => {
  let authToken: string;
  let electionCycleId: number;

  beforeAll(async () => {
    // Login and get token
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'admin',
        password: 'Admin@123',
      });
    
    authToken = loginRes.body.token;

    // Create test election cycle
    const cycle = await prisma.electionCycle.create({
      data: {
        name: 'Test Election 2026',
        type: 'National',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      },
    });
    electionCycleId = cycle.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.milestone.deleteMany({});
    await prisma.electionCycle.deleteMany({});
    await prisma.$disconnect();
  });

  describe('POST /api/v1/milestones', () => {
    it('should create a new milestone', async () => {
      const res = await request(app)
        .post('/api/v1/milestones')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          electionCycleId,
          title: 'Voter Registration',
          description: 'Register eligible voters',
          startDate: '2026-03-01T00:00:00Z',
          endDate: '2026-03-31T23:59:59Z',
          isStatutory: true,
          legalBasis: 'Article 45',
          responsibleDepartment: 'Operations',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Voter Registration');
      expect(res.body.isStatutory).toBe(true);
    });

    it('should reject milestone with invalid dates', async () => {
      const res = await request(app)
        .post('/api/v1/milestones')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          electionCycleId,
          title: 'Invalid Milestone',
          startDate: '2026-03-31T00:00:00Z',
          endDate: '2026-03-01T00:00:00Z', // End before start
        });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/v1/milestones')
        .send({
          electionCycleId,
          title: 'Test Milestone',
          startDate: '2026-03-01T00:00:00Z',
          endDate: '2026-03-31T23:59:59Z',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/milestones', () => {
    it('should return list of milestones', async () => {
      const res = await request(app)
        .get('/api/v1/milestones')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should filter by election cycle', async () => {
      const res = await request(app)
        .get(`/api/v1/milestones?electionCycleId=${electionCycleId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      res.body.forEach((milestone: any) => {
        expect(milestone.electionCycleId).toBe(electionCycleId);
      });
    });
  });
});
```

## Test Coverage Goals

### Minimum Coverage Requirements

- **Overall**: 70%
- **Critical Services**: 90%
  - WorkflowService
  - CalendarService
  - AuditService
  - NotificationService
- **Controllers**: 80%
- **Utilities**: 85%

### Priority Testing Areas

1. **Authentication & Authorization**
   - Login/logout flows
   - Token validation
   - Role-based access control
   - Permission checks

2. **Milestone Management**
   - CRUD operations
   - Dependency calculations
   - Status transitions
   - Statutory date protection

3. **Workflow Logic**
   - Approval workflows
   - Circular dependency detection
   - Status validation

4. **Notifications**
   - Alert triggering
   - Escalation logic
   - Email/SMS sending

5. **Data Validation**
   - Input validation
   - Date logic
   - Required fields

## Best Practices

### 1. Test Isolation

Each test should be independent:

```typescript
beforeEach(async () => {
  // Clean database before each test
  await prisma.milestone.deleteMany({});
});
```

### 2. Use Factories

Create test data factories:

```typescript
// src/tests/fixtures/factories.ts
export const createTestUser = async (overrides = {}) => {
  return prisma.user.create({
    data: {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('Test@123', 10),
      roleId: 1,
      ...overrides,
    },
  });
};

export const createTestMilestone = async (overrides = {}) => {
  return prisma.milestone.create({
    data: {
      electionCycleId: 1,
      title: 'Test Milestone',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
      status: 'Planned',
      ...overrides,
    },
  });
};
```

### 3. Mock External Services

```typescript
jest.mock('../../services/notificationService', () => ({
  NotificationService: {
    sendEmail: jest.fn().mockResolvedValue({ success: true }),
    sendSMS: jest.fn().mockResolvedValue({ success: true }),
  },
}));
```

### 4. Test Error Cases

```typescript
it('should handle database errors gracefully', async () => {
  jest.spyOn(prisma.milestone, 'create').mockRejectedValue(
    new Error('Database error')
  );

  const res = await request(app)
    .post('/api/v1/milestones')
    .set('Authorization', `Bearer ${authToken}`)
    .send(validMilestoneData);

  expect(res.status).toBe(500);
  expect(res.body).toHaveProperty('message');
});
```

### 5. Test Edge Cases

```typescript
describe('Edge Cases', () => {
  it('should handle very long milestone titles', async () => {
    const longTitle = 'A'.repeat(300);
    const res = await request(app)
      .post('/api/v1/milestones')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        ...validMilestoneData,
        title: longTitle,
      });

    expect(res.status).toBe(400);
  });

  it('should handle concurrent updates', async () => {
    // Test race conditions
  });
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: decs_test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: decs_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://decs_test_user:test_password@localhost:5432/decs_test
          
      - name: Run tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://decs_test_user:test_password@localhost:5432/decs_test
          JWT_SECRET: test-secret
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Performance Testing

### Load Testing with Artillery

```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
  
scenarios:
  - name: "Get milestones"
    flow:
      - post:
          url: "/api/v1/auth/login"
          json:
            username: "testuser"
            password: "Test@123"
          capture:
            - json: "$.token"
              as: "token"
      - get:
          url: "/api/v1/milestones"
          headers:
            Authorization: "Bearer {{ token }}"
```

Run load test:
```bash
npm install -g artillery
artillery run artillery-config.yml
```

## Security Testing

### 1. SQL Injection Tests

```typescript
it('should prevent SQL injection in milestone title', async () => {
  const res = await request(app)
    .post('/api/v1/milestones')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      ...validMilestoneData,
      title: "'; DROP TABLE milestones; --",
    });

  // Should either reject or sanitize
  expect(res.status).not.toBe(500);
});
```

### 2. XSS Tests

```typescript
it('should sanitize XSS in descriptions', async () => {
  const res = await request(app)
    .post('/api/v1/milestones')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      ...validMilestoneData,
      description: '<script>alert("XSS")</script>',
    });

  expect(res.body.description).not.toContain('<script>');
});
```

### 3. Authentication Tests

```typescript
describe('Authentication Security', () => {
  it('should reject expired tokens', async () => {
    const expiredToken = generateToken('user-id', 'Admin', '-1h');
    
    const res = await request(app)
      .get('/api/v1/milestones')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  it('should reject malformed tokens', async () => {
    const res = await request(app)
      .get('/api/v1/milestones')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
  });
});
```

---

**Document Version**: 1.0  
**Last Updated**: January 2, 2026
