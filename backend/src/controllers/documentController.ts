import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         milestoneId:
 *           type: integer
 *         filePath:
 *           type: string
 *         fileType:
 *           type: string
 *         uploadedBy:
 *           type: string
 */

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.body;
    const file = req.file;
    const userId = (req as any).user.userId;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document = await prisma.document.create({
      data: {
        milestoneId: Number(milestoneId),
        filePath: file.path,
        fileType: file.mimetype,
        uploadedBy: userId,
      },
    });

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDocumentsByMilestone = async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.params;
    const documents = await prisma.document.findMany({
      where: { milestoneId: Number(milestoneId) },
      include: { uploader: { select: { username: true } } }
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const downloadDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({
      where: { id: Number(id) },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const absolutePath = path.resolve(document.filePath);
    if (fs.existsSync(absolutePath)) {
        res.download(absolutePath);
    } else {
        res.status(404).json({ message: 'File not found on server' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const document = await prisma.document.findUnique({
        where: { id: Number(id) },
      });
  
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      // Delete from DB
      await prisma.document.delete({ where: { id: Number(id) } });

      // Delete from File System
      const absolutePath = path.resolve(document.filePath);
      if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
      }
  
      res.json({ message: 'Document deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
