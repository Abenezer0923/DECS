import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { AlertPriority } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AppError } from '../middlewares/errorHandler';

export const sendNotificationToRole = async (req: Request, res: Response) => {
  try {
    const { roleId, subject, message, priority } = req.body;
    const userRole = (req as AuthRequest).user?.role;

    // Only Admin and Board can send notifications
    if (!['Admin', 'Board'].includes(userRole)) {
      throw new AppError(403, 'You do not have permission to send notifications');
    }

    await NotificationService.notifyRole(
      Number(roleId),
      subject,
      message,
      priority as AlertPriority
    );

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, 'Failed to send notification');
  }
};

export const escalateMilestone = async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.params;
    const { reason } = req.body;
    const userRole = (req as AuthRequest).user?.role;

    // Any authenticated user can escalate
    if (!userRole) {
      throw new AppError(401, 'Unauthorized');
    }

    await NotificationService.escalateToManagement(Number(milestoneId), reason);

    res.json({ message: 'Milestone escalated to management' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, 'Failed to escalate milestone');
  }
};

export const notifyDeadline = async (req: Request, res: Response) => {
  try {
    const { milestoneId, daysUntil } = req.body;

    await NotificationService.notifyUpcomingDeadline(
      Number(milestoneId),
      Number(daysUntil)
    );

    res.json({ message: 'Deadline notification sent' });
  } catch (error) {
    throw new AppError(500, 'Failed to send deadline notification');
  }
};
