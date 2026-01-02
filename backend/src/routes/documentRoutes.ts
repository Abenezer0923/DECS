import { Router } from 'express';
import { uploadDocument, getDocumentsByMilestone, downloadDocument, deleteDocument } from '../controllers/documentController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { upload } from '../config/multer';

const router = Router();

/**
 * @swagger
 * /documents/upload:
 *   post:
 *     summary: Upload a document for a milestone
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               milestoneId:
 *                 type: integer
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Uploaded successfully
 */
router.post('/upload', authenticate, authorize(['Admin', 'Legal', 'Communication', 'Operations']), upload.single('file'), uploadDocument);

/**
 * @swagger
 * /documents/milestone/{milestoneId}:
 *   get:
 *     summary: Get documents for a milestone
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: milestoneId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of documents
 */
router.get('/milestone/:milestoneId', authenticate, getDocumentsByMilestone);

/**
 * @swagger
 * /documents/{id}/download:
 *   get:
 *     summary: Download a document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File download
 */
router.get('/:id/download', authenticate, downloadDocument);

router.delete('/:id', authenticate, authorize(['Admin']), deleteDocument);

export default router;
