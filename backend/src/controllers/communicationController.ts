import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notificationService';

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     CommunicationAction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         milestoneId:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [PressRelease, SocialMedia, SMS, WebsiteUpdate]
 *         contentDraft:
 *           type: string
 *         targetAudience:
 *           type: string
 *         status:
 *           type: string
 *           enum: [Draft, PendingApproval, Published]
 */

export const getCommunicationActions = async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.query;
    const where = milestoneId ? { milestoneId: Number(milestoneId) } : {};
    
    const actions = await prisma.communicationAction.findMany({
      where,
      include: { milestone: true }
    });
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCommunicationAction = async (req: Request, res: Response) => {
  try {
    const { milestoneId, type, contentDraft, targetAudience, language, isRiskResponse } = req.body;

    const action = await prisma.communicationAction.create({
      data: {
        milestoneId: Number(milestoneId),
        type,
        contentDraft,
        targetAudience,
        language,
        isRiskResponse: isRiskResponse || false,
        status: 'Draft'
      },
    });
    res.status(201).json(action);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCommunicationAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { contentDraft, targetAudience, status, language } = req.body;

    // Check previous status to trigger notifications on change
    const existingAction = await prisma.communicationAction.findUnique({
      where: { id: Number(id) },
      include: { milestone: true }
    });

    if (!existingAction) {
      return res.status(404).json({ message: 'Action not found' });
    }

    const action = await prisma.communicationAction.update({
      where: { id: Number(id) },
      data: {
        contentDraft,
        targetAudience,
        status,
        language
      },
      include: { milestone: true }
    });

    // Handle Notifications based on status change
    if (status && status !== existingAction.status) {
      let subject = '';
      let message = '';
      let priority: 'Low' | 'Medium' | 'High' = 'Medium';
      
      // Fetch recipients (e.g., Communication Officers and Admins)
      const recipients = await prisma.user.findMany({
        where: {
          role: {
            name: { in: ['Admin', 'Communication', 'ManagementBoard'] }
          }
        },
        select: { email: true }
      });
      const recipientEmails = recipients.map(u => u.email).filter(Boolean);

      if (status === 'PendingApproval') {
        subject = `Approval Request: Communication for ${action.milestone?.title}`;
        message = `A communication draft (${action.type}) requires approval.\n\nSummary: ${action.contentDraft?.substring(0, 100)}...`;
        priority = 'High';
      } else if (status === 'Published') {
        subject = `PUBLISHED: Communication for ${action.milestone?.title}`;
        message = `A communication (${action.type}) has been published to ${action.targetAudience}.\n\nContent: ${action.contentDraft}`;
        priority = 'High';
      }

      if (subject && recipientEmails.length > 0) {
        await NotificationService.sendEmail({
          recipients: recipientEmails,
          subject,
          message,
          priority,
          type: 'email'
        });
      }
    }

    res.json(action);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCommunicationAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.communicationAction.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Communication Action deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
