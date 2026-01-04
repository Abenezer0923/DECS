# DECS Production Deployment Guide

## Overview

This guide covers deploying the Digital Election Calendar System (DECS) backend to a production environment.

## Pre-Deployment Checklist

### 1. Infrastructure Requirements

**Minimum Server Specifications:**
- CPU: 4 cores
- RAM: 8GB
- Storage: 100GB SSD
- OS: Ubuntu 22.04 LTS or similar

**Required Services:**
- PostgreSQL 15+
- Node.js 18+
- Docker & Docker Compose (recommended)
- Nginx (reverse proxy)
- SSL Certificate (Let's Encrypt recommended)

### 2. Security Configuration

#### Environment Variables

Create a production `.env` file:

```env
# Application
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL="postgresql://decs_user:STRONG_PASSWORD_HERE@localhost:5432/decs_production?schema=public"

# Authentication
JWT_SECRET=GENERATE_STRONG_RANDOM_SECRET_HERE_MIN_64_CHARS
JWT_EXPIRY=24h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notifications@yourdomain.et
SMTP_PASS=your-app-specific-password
EMAIL_FROM="DECS System <noreply@yourdomain.et>"

# SMS Gateway (Africa's Talking example)
SMS_GATEWAY_URL=https://api.africastalking.com/version1/messaging
SMS_API_KEY=your-api-key-here
SMS_USERNAME=your-username

# CORS
ALLOWED_ORIGINS=https://yourdomain.et,https://www.yourdomain.et

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/decs/app.log
```

#### Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Database Setup

#### Create Production Database

```sql
-- Connect as postgres superuser
CREATE USER decs_user WITH PASSWORD 'STRONG_PASSWORD';
CREATE DATABASE decs_production OWNER decs_user;
GRANT ALL PRIVILEGES ON DATABASE decs_production TO decs_user;

-- Enable required extensions
\c decs_production
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### Run Migrations

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://decs_user:PASSWORD@localhost:5432/decs_production"

# Run migrations
npx prisma migrate deploy

# Seed initial data (roles, etc.)
npx prisma db seed
```

#### Database Backup Strategy

Create automated backup script (`/opt/decs/backup.sh`):

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/decs"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="decs_production"
DB_USER="decs_user"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $DB_USER -F c -b -v -f "$BACKUP_DIR/decs_$DATE.backup" $DB_NAME

# Keep only last 30 days
find $BACKUP_DIR -name "decs_*.backup" -mtime +30 -delete

# Upload to S3 (optional)
# aws s3 cp "$BACKUP_DIR/decs_$DATE.backup" s3://your-bucket/backups/
```

Add to crontab:
```bash
0 2 * * * /opt/decs/backup.sh >> /var/log/decs/backup.log 2>&1
```

## Deployment Methods

### Method 1: Docker Deployment (Recommended)

#### 1. Build Production Image

```dockerfile
# Dockerfile.production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

#### 2. Docker Compose for Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.production
    ports:
      - "127.0.0.1:3000:3000"
    env_file:
      - .env.production
    depends_on:
      - db
    restart: unless-stopped
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/var/log/decs
    networks:
      - decs-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: decs_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: decs_production
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - decs-network

volumes:
  postgres-data:

networks:
  decs-network:
    driver: bridge
```

#### 3. Deploy

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f api

# Stop
docker-compose -f docker-compose.prod.yml down
```

### Method 2: PM2 Deployment

#### 1. Install PM2

```bash
npm install -g pm2
```

#### 2. PM2 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'decs-api',
    script: './dist/server.js',
    instances: 4,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/decs/error.log',
    out_file: '/var/log/decs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
};
```

#### 3. Deploy with PM2

```bash
# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
```

## Nginx Configuration

### 1. Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 2. Configure Reverse Proxy

Create `/etc/nginx/sites-available/decs`:

```nginx
upstream decs_backend {
    least_conn;
    server 127.0.0.1:3000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.yourdomain.et;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name api.yourdomain.et;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.et/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.et/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/decs_access.log;
    error_log /var/log/nginx/decs_error.log;

    # File Upload Size
    client_max_body_size 10M;

    # Proxy Settings
    location / {
        proxy_pass http://decs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files (if needed)
    location /uploads {
        alias /opt/decs/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/decs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.et
```

## Monitoring & Logging

### 1. Application Logging

Install Winston for production logging:

```bash
npm install winston winston-daily-rotate-file
```

### 2. System Monitoring

Install monitoring tools:

```bash
# Install Node.js monitoring
npm install -g pm2
pm2 install pm2-logrotate

# System monitoring
sudo apt install htop iotop nethogs
```

### 3. Database Monitoring

```sql
-- Enable pg_stat_statements
CREATE EXTENSION pg_stat_statements;

-- Monitor slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 4. Health Check Monitoring

Set up external monitoring (e.g., UptimeRobot, Pingdom):
- Endpoint: `https://api.yourdomain.et/health`
- Interval: 5 minutes
- Alert on: Status code != 200

## Performance Optimization

### 1. Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_milestones_election_cycle ON milestones(election_cycle_id);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_dates ON milestones(start_date, end_date);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_table, entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- Analyze tables
ANALYZE milestones;
ANALYZE audit_logs;
```

### 2. Connection Pooling

Update Prisma configuration:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  
  // Connection pool settings
  pool_timeout = 20
  connection_limit = 20
}
```

### 3. Caching (Optional - Redis)

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Check connections
   sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
   ```

2. **High Memory Usage**
   ```bash
   # Check Node.js processes
   pm2 monit
   
   # Restart if needed
   pm2 restart decs-api
   ```

3. **Slow Queries**
   ```sql
   -- Enable query logging
   ALTER SYSTEM SET log_min_duration_statement = 1000;
   SELECT pg_reload_conf();
   ```

## Rollback Procedure

### 1. Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration-name>

# Restore from backup
pg_restore -U decs_user -d decs_production /var/backups/decs/decs_YYYYMMDD.backup
```

### 2. Application Rollback

```bash
# With Docker
docker-compose -f docker-compose.prod.yml down
docker pull decs-backend:previous-version
docker-compose -f docker-compose.prod.yml up -d

# With PM2
pm2 stop decs-api
git checkout previous-version
npm run build
pm2 restart decs-api
```

## Security Hardening

### 1. Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Fail2Ban

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 3. Regular Updates

```bash
# System updates
sudo apt update && sudo apt upgrade -y

# Node.js security updates
npm audit fix
```

## Maintenance Schedule

- **Daily**: Automated database backups
- **Weekly**: Review error logs and performance metrics
- **Monthly**: Security updates and dependency updates
- **Quarterly**: Full system audit and load testing

---

**Document Version**: 1.0  
**Last Updated**: January 2, 2026
