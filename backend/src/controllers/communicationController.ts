import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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

    const action = await prisma.communicationAction.update({
      where: { id: Number(id) },
      data: {
        contentDraft,
        targetAudience,
        status,
        language
      },
    });
    res.json(action);
  } catch (error) {
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
