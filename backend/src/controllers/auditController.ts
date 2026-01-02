import { Request, Response } from 'express';
import { AuditService } from '../services/auditService';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { entityTable, entityId, userId, limit } = req.query;

    const logs = await AuditService.getLogs({
      entityTable: entityTable as string,
      entityId: entityId ? parseInt(entityId as string) : undefined,
      userId: userId as string,
      limit: limit ? parseInt(limit as string) : 50,
    });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
