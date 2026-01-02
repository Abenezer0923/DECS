import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     PublicCalendarEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         publicTitle:
 *           type: string
 *         publicDescription:
 *           type: string
 *         milestone:
 *           $ref: '#/components/schemas/Milestone'
 */

export const getPublicCalendar = async (req: Request, res: Response) => {
  try {
    const { lang } = req.query;
    
    const entries = await prisma.publicCalendarEntry.findMany({
      where: { isPublished: true },
      include: { 
        milestone: {
            select: {
                startDate: true,
                endDate: true,
                status: true,
                translations: lang ? { where: { language: String(lang) } } : false
            }
        } 
      },
      orderBy: { milestone: { startDate: 'asc' } }
    });

    const result = entries.map(entry => {
        // If translation exists for the milestone, we might want to use it.
        // However, PublicCalendarEntry has its own title/desc. 
        // Ideally, PublicCalendarEntry should ALSO have translations, but for now, 
        // let's assume if a translation exists on the milestone, we might use it as a fallback 
        // or if the public entry itself is just a proxy.
        
        // Requirement I.6 says "Support Ethiopia's multiple languages".
        // If the public title is hardcoded in English, we need a way to translate it.
        // For simplicity in this phase, let's assume we return the milestone translation 
        // if the public title matches the milestone title, OR we should have added translations to PublicCalendarEntry too.
        // Given the scope, let's just return the milestone translation alongside for the frontend to decide.
        
        const translation = entry.milestone.translations?.[0];
        
        return {
            ...entry,
            publicTitle: translation ? translation.title : entry.publicTitle,
            publicDescription: translation ? (translation.description || entry.publicDescription) : entry.publicDescription
        };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPublicEntry = async (req: Request, res: Response) => {
    try {
        const { milestoneId, publicTitle, publicDescription, isPublished } = req.body;
        const entry = await prisma.publicCalendarEntry.create({
            data: {
                milestoneId: Number(milestoneId),
                publicTitle,
                publicDescription,
                isPublished: isPublished || false
            }
        });
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePublicEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { publicTitle, publicDescription, isPublished } = req.body;
        const entry = await prisma.publicCalendarEntry.update({
            where: { id: Number(id) },
            data: {
                publicTitle,
                publicDescription,
                isPublished
            }
        });
        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
