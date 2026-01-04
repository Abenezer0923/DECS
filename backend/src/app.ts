import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { AlertService } from './services/alertService';
import { WorkflowService } from './services/workflowService';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { rateLimiter } from './middlewares/rateLimiter';
import { logger } from './utils/logger';
import cron from 'node-cron';

const app = express();

// Initialize Background Services
new AlertService();

// Schedule automatic milestone status updates (runs every hour)
cron.schedule('0 * * * *', async () => {
  logger.info('Running automatic milestone status update...');
  await WorkflowService.autoUpdateMilestoneStatuses();
});

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// CORS Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Rate Limiting
app.use('/api/', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests from this IP, please try again later',
}));

// Public API has stricter rate limiting
app.use('/api/v1/public/', rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 50,
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1', routes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 Handler
app.use(notFoundHandler);

// Error Handler (must be last)
app.use(errorHandler);

export default app;
