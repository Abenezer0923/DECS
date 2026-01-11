import { Request, Response } from 'express';
import { PrismaClient, AuditAction } from '@prisma/client';
import { CalendarService } from '../services/calendarService';
import { AuditService } from '../services/auditService';
import { SchedulerService } from '../services/schedulerService';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();
const calendarService = new CalendarService();

/**
 * @swagger
 * components:
 *   schemas:
 *     Milestone:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         isStatutory:
 *           type: boolean
 */

export const getMilestones = async (req: Request, res: Response) => {
  try {
    const { electionCycleId, lang } = req.query;
    const where = electionCycleId ? { electionCycleId: Number(electionCycleId) } : {};
    
    const milestones = await prisma.milestone.findMany({
      where,
      orderBy: { startDate: 'asc' },
      include: { 
        predecessors: true, 
        successors: true,
        translations: lang ? { where: { language: String(lang) } } : false
      }
    });

    // If lang is provided, overlay the translation
    const result = milestones.map(m => {
      if (m.translations && m.translations.length > 0) {
        return {
          ...m,
          title: m.translations[0].title,
          description: m.translations[0].description || m.description,
          originalTitle: m.title // Keep original for reference
        };
      }
      return m;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createMilestone = async (req: Request, res: Response) => {
  try {
    const { 
        electionCycleId, title, description, startDate, endDate, 
        isStatutory, legalBasis, responsibleDepartment, riskLevel 
    } = req.body;
    
    const userId = (req as AuthRequest).user?.id;

    const milestone = await prisma.milestone.create({
      data: {
        electionCycleId: Number(electionCycleId),
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isStatutory: isStatutory || false,
        legalBasis,
        responsibleDepartment,
        status: 'Planned',
        riskLevel: riskLevel || 'Low'
      },
    });

    if (userId) {
      await AuditService.logChange(
        userId,
        'Milestone',
        milestone.id,
        AuditAction.CREATE,
        null,
        milestone
      );
    }

    res.status(201).json(milestone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMilestone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, startDate, endDate, status, isStatutory, riskLevel, translations } = req.body;
    const userId = (req as AuthRequest).user?.id;

    // Check if statutory
    const currentMilestone = await prisma.milestone.findUnique({ where: { id: Number(id) } });
    if (!currentMilestone) return res.status(404).json({ message: 'Milestone not found' });

    // If trying to move a statutory date, check permissions (simplified here)
    if (currentMilestone.isStatutory && (startDate || endDate)) {
        // In a real app, check if user has specific override permission
        // For now, we allow it but maybe log a warning or require a flag
    }

    // Handle translations update if provided
    if (translations && Array.isArray(translations)) {
      for (const t of translations) {
        await prisma.milestoneTranslation.upsert({
          where: {
            milestoneId_language: {
              milestoneId: Number(id),
              language: t.language
            }
          },
          update: { title: t.title, description: t.description },
          create: {
            milestoneId: Number(id),
            language: t.language,
            title: t.title,
            description: t.description
          }
        });
      }
    }

    const milestone = await prisma.milestone.update({
      where: { id: Number(id) },
      data: {
        title,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
        isStatutory,
        riskLevel
      },
    });

    // Trigger date cascade if end date changed
    if (currentMilestone.endDate && milestone.endDate) {
        await SchedulerService.cascadeDateChanges(
            milestone.id, 
            currentMilestone.endDate, 
            milestone.endDate
        );
    }

    // Log Audit
    if (userId) {
      await AuditService.logChange(
        userId,
        'Milestone',
        milestone.id,
        AuditAction.UPDATE,
        currentMilestone,
        milestone
      );
    }

    // Trigger dependency recalculation if dates changed
    if (startDate || endDate) {
        await calendarService.recalculateDependencies(
            milestone.id, 
            milestone.startDate!, 
            milestone.endDate!
        );
    }

    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteMilestone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.id;

    const currentMilestone = await prisma.milestone.findUnique({ where: { id: Number(id) } });
    if (!currentMilestone) return res.status(404).json({ message: 'Milestone not found' });

    await prisma.milestone.delete({
      where: { id: Number(id) },
    });

    if (userId) {
      await AuditService.logChange(
        userId,
        'Milestone',
        Number(id),
        AuditAction.DELETE,
        currentMilestone,
        null
      );
    }

    res.json({ message: 'Milestone deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
