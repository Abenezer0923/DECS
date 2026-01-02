import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     ElectionCycle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [National, ByElection, Referendum]
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [Planning, Active, Archived]
 */

export const getElectionCycles = async (req: Request, res: Response) => {
  try {
    const cycles = await prisma.electionCycle.findMany({
        orderBy: { startDate: 'desc' }
    });
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getElectionCycleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cycle = await prisma.electionCycle.findUnique({
      where: { id: Number(id) },
      include: { milestones: true }
    });
    if (!cycle) return res.status(404).json({ message: 'Election Cycle not found' });
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createElectionCycle = async (req: Request, res: Response) => {
  try {
    const { name, type, startDate, endDate } = req.body;
    
    if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const cycle = await prisma.electionCycle.create({
      data: {
        name,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'Planning'
      },
    });
    res.status(201).json(cycle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateElectionCycle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, startDate, endDate, status } = req.body;

    const cycle = await prisma.electionCycle.update({
      where: { id: Number(id) },
      data: {
        name,
        type,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status
      },
    });
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteElectionCycle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.electionCycle.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Election Cycle deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
