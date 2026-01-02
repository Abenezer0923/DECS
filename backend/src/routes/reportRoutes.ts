import { Router } from 'express';
import { getProgressReport } from '../controllers/reportController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Only Admins and Managers can generate reports
router.get('/progress', authenticate, authorize(['Admin', 'Manager']), getProgressReport);

export default router;
