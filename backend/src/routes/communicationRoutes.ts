import { Router } from 'express';
import { 
    getCommunicationActions, 
    createCommunicationAction, 
    updateCommunicationAction, 
    deleteCommunicationAction 
} from '../controllers/communicationController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /communications:
 *   get:
 *     summary: Get communication actions
 *     tags: [Communications]
 *     parameters:
 *       - in: query
 *         name: milestoneId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of actions
 */
router.get('/', authenticate, authorize(['Admin', 'Communication', 'ManagementBoard']), getCommunicationActions);

/**
 * @swagger
 * /communications:
 *   post:
 *     summary: Create a communication action
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommunicationAction'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticate, authorize(['Admin', 'Communication']), createCommunicationAction);

router.put('/:id', authenticate, authorize(['Admin', 'Communication', 'ManagementBoard']), updateCommunicationAction);
router.delete('/:id', authenticate, authorize(['Admin', 'Communication']), deleteCommunicationAction);

export default router;
