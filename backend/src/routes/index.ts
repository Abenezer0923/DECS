import { Router } from 'express';
import authRoutes from './authRoutes';
import electionRoutes from './electionRoutes';
import milestoneRoutes from './milestoneRoutes';
import communicationRoutes from './communicationRoutes';
import publicRoutes from './publicRoutes';
import alertRoutes from './alertRoutes';
import documentRoutes from './documentRoutes';
import reportRoutes from './reportRoutes';
import auditRoutes from './auditRoutes';
import riskRoutes from './riskRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/elections', electionRoutes);
router.use('/milestones', milestoneRoutes);
router.use('/communications', communicationRoutes);
router.use('/public', publicRoutes);
router.use('/alerts', alertRoutes);
router.use('/documents', documentRoutes);
router.use('/reports', reportRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/risk-responses', riskRoutes);

export default router;
