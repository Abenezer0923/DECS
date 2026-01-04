import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import {
  sendNotificationToRole,
  escalateMilestone,
  notifyDeadline,
} from '../controllers/notificationController';

const router = Router();

/**
 * @swagger
 * /api/v1/notifications/send-to-role:
 *   post:
 *     summary: Send notification to all users in a role
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.post('/send-to-role', authenticate, authorize(['Admin', 'Board']), sendNotificationToRole);

/**
 * @swagger
 * /api/v1/notifications/escalate/:milestoneId:
 *   post:
 *     summary: Escalate a milestone to management
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.post('/escalate/:milestoneId', authenticate, escalateMilestone);

/**
 * @swagger
 * /api/v1/notifications/deadline:
 *   post:
 *     summary: Send deadline notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.post('/deadline', authenticate, authorize(['Admin']), notifyDeadline);

export default router;
