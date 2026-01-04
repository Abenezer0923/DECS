import { PrismaClient, CommunicationStatus, MilestoneStatus } from '@prisma/client';
import { AuditService } from './auditService';

const prisma = new PrismaClient();

export class WorkflowService {
  /**
   * Handles communication action approval workflow
   */
  static async approveCommunicationAction(
    actionId: number,
    userId: string,
    approved: boolean,
    comments?: string
  ) {
    const action = await prisma.communicationAction.findUnique({
      where: { id: actionId },
    });

    if (!action) {
      throw new Error('Communication action not found');
    }

    if (action.status !== CommunicationStatus.PendingApproval) {
      throw new Error('Action is not pending approval');
    }

    const newStatus = approved ? CommunicationStatus.Published : CommunicationStatus.Draft;

    const updated = await prisma.communicationAction.update({
      where: { id: actionId },
      data: { status: newStatus },
    });

    await AuditService.logChange(
      userId,
      'CommunicationAction',
      actionId,
      'UPDATE' as any,
      action,
      { ...updated, approvalComments: comments }
    );

    return updated;
  }

  /**
   * Validates milestone status transitions
   */
  static isValidStatusTransition(
    currentStatus: MilestoneStatus,
    newStatus: MilestoneStatus
  ): boolean {
    const validTransitions: Record<MilestoneStatus, MilestoneStatus[]> = {
      Planned: ['Ongoing', 'Cancelled'],
      Ongoing: ['Completed', 'Delayed', 'Cancelled'],
      Completed: [], // Cannot transition from completed
      Delayed: ['Ongoing', 'Cancelled'],
      Cancelled: [], // Cannot transition from cancelled
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Automatically updates milestone status based on dates
   */
  static async autoUpdateMilestoneStatuses() {
    const now = new Date();

    // Find milestones that should be ongoing
    const plannedMilestones = await prisma.milestone.findMany({
      where: {
        status: MilestoneStatus.Planned,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    for (const milestone of plannedMilestones) {
      await prisma.milestone.update({
        where: { id: milestone.id },
        data: { status: MilestoneStatus.Ongoing },
      });
    }

    // Find milestones that should be delayed
    const ongoingMilestones = await prisma.milestone.findMany({
      where: {
        status: MilestoneStatus.Ongoing,
        endDate: { lt: now },
      },
    });

    for (const milestone of ongoingMilestones) {
      await prisma.milestone.update({
        where: { id: milestone.id },
        data: { status: MilestoneStatus.Delayed },
      });
    }
  }

  /**
   * Checks for circular dependencies in milestone relationships
   */
  static async detectCircularDependency(
    predecessorId: number,
    successorId: number
  ): Promise<boolean> {
    const visited = new Set<number>();
    const queue = [successorId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      if (currentId === predecessorId) {
        return true; // Circular dependency detected
      }

      if (visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);

      const dependencies = await prisma.milestoneDependency.findMany({
        where: { predecessorMilestoneId: currentId },
        select: { successorMilestoneId: true },
      });

      queue.push(...dependencies.map(d => d.successorMilestoneId));
    }

    return false;
  }

  /**
   * Validates that statutory milestone dates are not changed without proper authorization
   */
  static async validateStatutoryDateChange(
    milestoneId: number,
    userId: string,
    userRole: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone) {
      return { allowed: false, reason: 'Milestone not found' };
    }

    if (!milestone.isStatutory) {
      return { allowed: true };
    }

    // Only Admin and Legal roles can modify statutory dates
    const authorizedRoles = ['Admin', 'Legal'];
    if (!authorizedRoles.includes(userRole)) {
      return {
        allowed: false,
        reason: 'Only Admin or Legal roles can modify statutory milestone dates',
      };
    }

    return { allowed: true };
  }
}
