# How to Build the DECS Backend

This guide outlines the steps to build the backend for the Digital Election Calendar System (DECS) using **Node.js**, **TypeScript**, **PostgreSQL**, **Swagger**, and **REST API** principles.

## 1. Technology Stack

*   **Runtime:** Node.js (v18+ recommended)
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM:** Prisma (Recommended for type safety and schema management) or TypeORM
*   **Framework:** Express.js
*   **Documentation:** Swagger (OpenAPI 3.0)
*   **Validation:** Zod or Joi
*   **Authentication:** JSON Web Tokens (JWT) + Bcrypt

## 2. Project Initialization

### Step 2.1: Initialize Node.js and TypeScript

```bash
mkdir decs-backend
cd decs-backend
npm init -y

# Install core dependencies
npm install express cors helmet morgan dotenv pg swagger-ui-express swagger-jsdoc jsonwebtoken bcryptjs

# Install development dependencies
npm install -D typescript ts-node nodemon @types/node @types/express @types/cors @types/morgan @types/swagger-ui-express @types/swagger-jsdoc @types/jsonwebtoken @types/bcryptjs
```

### Step 2.2: Configure TypeScript (`tsconfig.json`)

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## 3. Project Structure

Organize the code using a modular, layered architecture to ensure scalability (Requirement II.1.1).

```text
src/
├── config/             # Environment variables, DB config
├── controllers/        # Request handlers (logic orchestration)
├── middlewares/        # Auth, validation, error handling
├── routes/             # API route definitions
├── services/           # Business logic (Calendar calculations, etc.)
├── utils/              # Helper functions (Date calc, Logger)
├── app.ts              # Express app setup
└── server.ts           # Entry point
```

## 4. Database Setup (PostgreSQL & Prisma)

### Step 4.1: Initialize Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

This creates a `prisma` folder. Configure your `.env` file with the PostgreSQL connection string:
`DATABASE_URL="postgresql://user:password@localhost:5432/decs_db?schema=public"`

### Step 4.2: Define Schema

Edit `prisma/schema.prisma` to define your models (See `database_schema.md` for details).

```prisma
// Example snippet
model Milestone {
  id          Int       @id @default(autoincrement())
  title       String
  startDate   DateTime
  endDate     DateTime
  isStatutory Boolean   @default(false)
  // ... relations
}
```

### Step 4.3: Run Migrations

```bash
npx prisma migrate dev --name init
```

## 5. Implementing the REST API

### Step 5.1: Express App Setup (`src/app.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import routes from './routes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1', routes);

export default app;
```

### Step 5.2: Swagger Configuration (`src/config/swagger.ts`)

```typescript
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DECS API',
      version: '1.0.0',
      description: 'API for Digital Election Calendar System',
    },
    servers: [
      { url: 'http://localhost:3000/api/v1' }
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to files containing annotations
};

export const swaggerSpec = swaggerJSDoc(options);
```

## 6. Key Feature Implementation Strategies

### 6.1 Electoral Calendar Logic (Req I.1)
*   **Dependency Calculation:** Create a `CalendarService`. When a milestone date is updated, recursively fetch child milestones (defined in `MilestoneDependency` table) and update their dates based on the offset.
*   **Validation:** Ensure statutory dates cannot be moved without specific override permissions (Role-based check).

### 6.2 Role-Based Access Control (Req I.4)
*   Implement a middleware `checkRole(['ADMIN', 'LEGAL'])`.
*   Store roles in the JWT payload upon login.

### 6.3 Alerts & Notifications (Req I.5)
*   Use a cron job (e.g., `node-cron`) running daily.
*   Query database for `Milestones` where `endDate` is approaching.
*   Send emails/SMS via an external service (e.g., SendGrid, Twilio) or internal notification system.

### 6.4 Audit Logging (Req I.9)
*   Create an `AuditLog` entity.
*   Use middleware or service interceptors to log every `POST`, `PUT`, `DELETE` action with `userId`, `action`, `oldValue`, and `newValue`.

## 7. Running the Project

```bash
# Development
npm run dev

# Build for Production
npm run build
node dist/server.js
```
