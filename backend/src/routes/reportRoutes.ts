import { Router } from 'express';
import { getProgressReport } from '../controllers/reportController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/v1/reports/progress:
 *   get:
 *     summary: Generate progress report
 *     description: Generate a progress report in JSON, PDF, or Excel format showing milestone statistics and details
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, pdf, excel]
 *         description: Report format (json, pdf, or excel)
 *         example: pdf
 *     responses:
 *       200:
 *         description: Report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     completed:
 *                       type: integer
 *                     ongoing:
 *                       type: integer
 *                     delayed:
 *                       type: integer
 *                     planned:
 *                       type: integer
 *                 milestones:
 *                   type: array
 *                   items:
 *                     type: object
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or ManagementBoard role required
 *       500:
 *         description: Server error
 */
router.get('/progress', authenticate, authorize(['Admin', 'ManagementBoard']), getProgressReport);

export default router;
