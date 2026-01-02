import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Alert:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         milestoneId:
 *           type: integer
 *         triggerCondition:
 *           type: string
 *           example: "3_DAYS_BEFORE_START"
 *         recipientRoleId:
 *           type: integer
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High, Critical]
 */

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany({
      include: { milestone: true, recipientRole: true }
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAlert = async (req: Request, res: Response) => {
  try {
    const { milestoneId, triggerCondition, recipientRoleId, priority } = req.body;

    const alert = await prisma.alert.create({
      data: {
        milestoneId: Number(milestoneId),
        triggerCondition,
        recipientRoleId: Number(recipientRoleId),
        priority
      },
    });
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.alert.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
