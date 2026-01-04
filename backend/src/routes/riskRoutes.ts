import { Router } from 'express';
import { createRiskResponse, getRiskResponses, updateRiskResponse, deleteRiskResponse } from '../controllers/riskController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Risk responses are sensitive, so restrict to Admin and ManagementBoard

router.post('/', authenticate, authorize(['Admin', 'ManagementBoard']), createRiskResponse);
router.get('/milestone/:milestoneId', authenticate, authorize(['Admin', 'ManagementBoard']), getRiskResponses);
router.put('/:id', authenticate, authorize(['Admin', 'ManagementBoard']), updateRiskResponse);
router.delete('/:id', authenticate, authorize(['Admin', 'ManagementBoard']), deleteRiskResponse);

export default router;
