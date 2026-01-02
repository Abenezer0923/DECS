import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const createRiskResponse = async (req: Request, res: Response) => {
  try {
    const { milestoneId, content, type } = req.body;
    
    const riskResponse = await prisma.riskResponse.create({
      data: {
        milestoneId: Number(milestoneId),
        content,
        type
      }
    });

    res.status(201).json(riskResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRiskResponses = async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.params;
    
    const responses = await prisma.riskResponse.findMany({
      where: { milestoneId: Number(milestoneId) },
      orderBy: { createdAt: 'desc' }
    });

    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRiskResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, type } = req.body;

    const response = await prisma.riskResponse.update({
      where: { id: Number(id) },
      data: { content, type }
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRiskResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.riskResponse.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Risk response deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
