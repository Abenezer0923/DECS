import { Router } from 'express';
import { getAlerts, createAlert, deleteAlert } from '../controllers/alertController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: Get all configured alerts
 *     tags: [Alerts]
 *     responses:
 *       200:
 *         description: List of alerts
 */
router.get('/', authenticate, authorize(['Admin', 'ManagementBoard']), getAlerts);

/**
 * @swagger
 * /alerts:
 *   post:
 *     summary: Create a new alert rule
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alert'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticate, authorize(['Admin']), createAlert);

router.delete('/:id', authenticate, authorize(['Admin']), deleteAlert);

export default router;
