import { Router } from 'express';
import { 
    getElectionCycles, 
    getElectionCycleById, 
    createElectionCycle, 
    updateElectionCycle, 
    deleteElectionCycle 
} from '../controllers/electionController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /elections:
 *   get:
 *     summary: Get all election cycles
 *     tags: [Elections]
 *     responses:
 *       200:
 *         description: List of election cycles
 */
router.get('/', authenticate, getElectionCycles);

/**
 * @swagger
 * /elections/{id}:
 *   get:
 *     summary: Get election cycle by ID
 *     tags: [Elections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Election cycle details
 */
router.get('/:id', authenticate, getElectionCycleById);

/**
 * @swagger
 * /elections:
 *   post:
 *     summary: Create a new election cycle
 *     tags: [Elections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ElectionCycle'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticate, authorize(['Admin', 'ManagementBoard']), createElectionCycle);

router.put('/:id', authenticate, authorize(['Admin', 'ManagementBoard']), updateElectionCycle);
router.delete('/:id', authenticate, authorize(['Admin']), deleteElectionCycle);

export default router;
