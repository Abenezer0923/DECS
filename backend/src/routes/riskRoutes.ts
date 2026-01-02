import { Router } from 'express';
import { createRiskResponse, getRiskResponses, updateRiskResponse, deleteRiskResponse } from '../controllers/riskController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Risk responses are sensitive, so restrict to Admin, Manager, and maybe a specific "Comms" role if it existed.
// For now, Admin and Manager.

router.post('/', authenticate, authorize(['Admin', 'Manager']), createRiskResponse);
router.get('/milestone/:milestoneId', authenticate, authorize(['Admin', 'Manager']), getRiskResponses);
router.put('/:id', authenticate, authorize(['Admin', 'Manager']), updateRiskResponse);
router.delete('/:id', authenticate, authorize(['Admin', 'Manager']), deleteRiskResponse);

export default router;
