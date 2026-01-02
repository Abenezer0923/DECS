import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { AlertService } from './services/alertService';

const app = express();

// Initialize Background Services
new AlertService();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1', routes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

export default app;
