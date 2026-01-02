import { Router } from 'express';
import { getPublicCalendar, createPublicEntry, updatePublicEntry } from '../controllers/publicController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /public/calendar:
 *   get:
 *     summary: Get public election calendar
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of published milestones
 */
router.get('/calendar', getPublicCalendar);

// Internal routes to manage public entries
router.post('/entries', authenticate, authorize(['Admin', 'Communication']), createPublicEntry);
router.put('/entries/:id', authenticate, authorize(['Admin', 'Communication']), updatePublicEntry);

export default router;
