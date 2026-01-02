# DECS Backend - Testing & Deployment Guide

## 1. Running Tests

The project uses **Jest** and **Supertest** for testing.

### Prerequisites
Ensure the Docker containers are running:
```bash
docker-compose up -d
```

### Run Tests
Execute the tests inside the running container:
```bash
docker-compose exec api npm test
```

This will run all files ending in `.test.ts` located in `src/tests/`.

## 2. Production Deployment

The `Dockerfile` is optimized using multi-stage builds to ensure a small and secure production image.

### Build for Production
To build the production image (which discards dev dependencies and source code, keeping only the built artifacts):

```bash
docker build --target production -t decs-backend:prod .
```

### Run Production Container
```bash
docker run -d -p 3000:3000 --env-file .env decs-backend:prod
```

*Note: Ensure your `.env` file points to a valid production database URL.*

## 3. Docker Structure

*   **Base Stage:** Installs OS dependencies (OpenSSL) and copies package files.
*   **Dev Stage:** Installs all dependencies (including dev) and runs `nodemon`. Used by `docker-compose`.
*   **Builder Stage:** Compiles TypeScript to JavaScript.
*   **Production Stage:** Installs only production dependencies, copies built artifacts from Builder, and runs the compiled code.
