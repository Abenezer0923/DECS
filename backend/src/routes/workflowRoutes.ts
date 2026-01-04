import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import {
  approveCommunication,
  validateMilestoneTransition,
  checkCircularDependency,
  validateStatutoryChange,
} from '../controllers/workflowController';

const router = Router();

/**
 * @swagger
 * /api/v1/workflow/approve-communication/:id:
 *   post:
 *     summary: Approve or reject a communication action
 *     tags: [Workflow]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/approve-communication/:id',
  authenticate,
  authorize(['Admin', 'Board', 'Communication']),
  approveCommunication
);

/**
 * @swagger
 * /api/v1/workflow/validate-transition:
 *   post:
 *     summary: Validate if a milestone status transition is allowed
 *     tags: [Workflow]
 */
router.post('/validate-transition', validateMilestoneTransition);

/**
 * @swagger
 * /api/v1/workflow/check-circular-dependency:
 *   post:
 *     summary: Check if adding a dependency would create a circular reference
 *     tags: [Workflow]
 */
router.post('/check-circular-dependency', checkCircularDependency);

/**
 * @swagger
 * /api/v1/workflow/validate-statutory/:milestoneId:
 *   get:
 *     summary: Validate if user can modify statutory milestone dates
 *     tags: [Workflow]
 *     security:
 *       - bearerAuth: []
 */
router.get('/validate-statutory/:milestoneId', authenticate, validateStatutoryChange);

export default router;
