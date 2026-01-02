import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Only Admins can view audit logs
router.get('/', authenticate, authorize(['Admin']), getAuditLogs);

export default router;
