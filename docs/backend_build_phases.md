# Backend Build Phases with Docker

This document outlines the step-by-step phases to build the DECS backend using **Docker** and **Docker Compose** to manage the Node.js application and PostgreSQL database.

## Phase 1: Containerization & Environment Setup

**Goal:** Establish a reproducible development environment using Docker.

### 1.1 Create `Dockerfile`
Create a `Dockerfile` in the root directory to define the Node.js environment.

```dockerfile
# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD [ "npm", "start" ]
```

### 1.2 Create `docker-compose.yml`
Create a `docker-compose.yml` file to orchestrate the Node.js backend and the PostgreSQL database.

```yaml
version: '3.8'

services:
  # Node.js Backend Service
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/decs_db?schema=public
      - JWT_SECRET=supersecretkey
    depends_on:
      - db
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    command: npm run dev # Use nodemon for hot-reloading in dev

  # PostgreSQL Database Service
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: decs_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### 1.3 Update `package.json` scripts
Ensure you have scripts for development and building.

```json
"scripts": {
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

### 1.4 Verify Setup
Run `docker-compose up --build` to start the services. You should see logs indicating the database is ready and the Node app is listening on port 3000.

---

## Phase 2: Database Layer Implementation

**Goal:** Connect the application to the database and define the schema.

### 2.1 Initialize Prisma with Docker
Since the app is running inside Docker, Prisma needs to connect to the `db` service host defined in docker-compose.

1.  **Schema Definition:** Update `prisma/schema.prisma` with the models defined in `database_schema.md`.
2.  **Migration:** Run migrations to create tables in the Dockerized database.
    *   *Note:* You can run commands inside the container:
        ```bash
        docker-compose exec api npx prisma migrate dev --name init
        ```

### 2.2 Seed Data
Create a seed script (`prisma/seed.ts`) to populate initial data (e.g., default Roles like 'Admin', 'Legal').

---

## Phase 3: API Architecture & Authentication

**Goal:** Build the secure foundation for the API.

### 3.1 Express & Swagger Setup
*   Set up the Express app structure (`src/app.ts`).
*   Configure Swagger UI at `/api-docs`.

### 3.2 Authentication Module
*   **Models:** User, Role.
*   **Routes:** `/auth/login`, `/auth/register`.
*   **Middleware:** Implement `authMiddleware` to verify JWT tokens.
*   **RBAC:** Implement `roleMiddleware` to check permissions (e.g., only 'Admin' can create users).

---

## Phase 4: Core Business Logic (The "DECS" Logic)

**Goal:** Implement the specific election management features.

### 4.1 Election Cycle Management
*   **CRUD:** Create, Read, Update, Delete Election Cycles.
*   **Validation:** Ensure dates are logical (Start Date < End Date).

### 4.2 Milestone Management
*   **CRUD:** Manage Milestones.
*   **Logic:** Implement the `isStatutory` check (Req I.1.2).

### 4.3 Dependency Engine (Crucial)
*   **Service:** Create `CalendarService`.
*   **Logic:** When a milestone date changes, trigger a function to recalculate dates for all dependent milestones based on `lag_days`.

---

## Phase 5: Communication & Reporting

**Goal:** Add the public-facing and reporting capabilities.

### 5.1 Communication Module
*   **Endpoints:** Link communication actions (Press Releases, SMS) to milestones.
*   **Workflow:** Implement status changes (Draft -> Approved).

### 5.2 Public API
*   Create a separate route set (e.g., `/api/v1/public/calendar`) that only returns milestones where `status='Published'`.

---

## Phase 6: Testing & Deployment Preparation

**Goal:** Ensure reliability and prepare for production.

### 6.1 Testing
*   **Unit Tests:** Test utility functions (date calculations).
*   **Integration Tests:** Test API endpoints using `supertest` against a test database container.

### 6.2 Production Docker Optimization
*   Ensure the `Dockerfile` uses multi-stage builds to keep the image size small.
*   Remove dev dependencies in the final image.

```dockerfile
# Example Multi-stage build
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```
