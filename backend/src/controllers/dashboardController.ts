import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalElections = await prisma.electionCycle.count();

    const activeMilestones = await prisma.milestone.count({
      where: {
        status: {
          in: ['Ongoing', 'Planned']
        }
      }
    });

    // Assuming we have a CommunicationAction model or similar, 
    // but based on `communicationController.ts` existence, let's assume `CommunicationAction`.
    // I need to check schema.prisma to be sure about table names. 
    // But for now I'll check what tables exist or rely on what I saw in seed.
    // The schema was read earlier, let me check that partial read.

    // Schema excerpt showed:
    // enum CommunicationStatus { Draft, PendingApproval, Published }
    // model CommunicationAction { ... status CommunicationStatus ... }
    
    // Let's count PendingApproval communications
    const pendingCommunications = await prisma.communicationAction.count({
      where: {
        status: 'PendingApproval'
      }
    });

    const delayedMilestones = await prisma.milestone.count({
      where: {
        status: 'Delayed'
      }
    });

    res.json({
      totalElections,
      activeMilestones,
      pendingCommunications,
      delayedMilestones
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
