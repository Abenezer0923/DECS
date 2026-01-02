import { PrismaClient, AuditAction } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditService {
  /**
   * Logs a change to the audit trail.
   * @param userId The ID of the user performing the action.
   * @param entityTable The name of the table being modified (e.g., 'Milestone').
   * @param entityId The ID of the entity being modified.
   * @param action The type of action (CREATE, UPDATE, DELETE).
   * @param oldValues The state of the entity before the change (optional).
   * @param newValues The state of the entity after the change (optional).
   */
  static async logChange(
    userId: string,
    entityTable: string,
    entityId: number,
    action: AuditAction,
    oldValues?: any,
    newValues?: any
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          entityTable,
          entityId,
          action,
          oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : undefined,
          newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : undefined,
        },
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // We don't want to fail the main operation if logging fails, but we should alert/log the error.
    }
  }

  /**
   * Retrieves audit logs with optional filtering.
   */
  static async getLogs(filters: { entityTable?: string; entityId?: number; userId?: string; limit?: number }) {
    const { entityTable, entityId, userId, limit = 50 } = filters;
    
    const logs = await prisma.auditLog.findMany({
      where: {
        entityTable,
        entityId,
        userId,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: { select: { name: true } }
          }
        }
      }
    });

    // Handle BigInt serialization
    return logs.map(log => ({
      ...log,
      id: log.id.toString(),
    }));
  }
}
