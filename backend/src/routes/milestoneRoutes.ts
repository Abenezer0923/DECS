import { Router } from 'express';
import { 
    getMilestones, 
    createMilestone, 
    updateMilestone, 
    deleteMilestone 
} from '../controllers/milestoneController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /milestones:
 *   get:
 *     summary: Get milestones
 *     tags: [Milestones]
 *     parameters:
 *       - in: query
 *         name: electionCycleId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of milestones
 */
router.get('/', authenticate, getMilestones);

/**
 * @swagger
 * /milestones:
 *   post:
 *     summary: Create a milestone
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Milestone'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticate, authorize(['Admin', 'ManagementBoard', 'Operations']), createMilestone);

router.put('/:id', authenticate, authorize(['Admin', 'ManagementBoard', 'Operations']), updateMilestone);
router.delete('/:id', authenticate, authorize(['Admin']), deleteMilestone);

export default router;
