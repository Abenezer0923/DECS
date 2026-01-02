# Base stage
FROM node:18-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache openssl
COPY package*.json ./
COPY prisma ./prisma/

# Development stage
FROM base AS dev
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Builder stage
FROM dev AS builder
RUN npm run build

# Production stage
FROM base AS production
RUN npm install --production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
EXPOSE 3000
CMD ["node", "dist/server.js"]
