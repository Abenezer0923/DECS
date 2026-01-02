import { PrismaClient, Milestone, DependencyType } from '@prisma/client';

const prisma = new PrismaClient();

export class CalendarService {
  /**
   * Recalculates dates for dependent milestones when a milestone's date changes.
   * @param milestoneId The ID of the milestone that changed.
   * @param newStartDate The new start date of the milestone.
   * @param newEndDate The new end date of the milestone.
   */
  async recalculateDependencies(milestoneId: number, newStartDate: Date, newEndDate: Date) {
    // 1. Find all successors (milestones that depend on this one)
    const dependencies = await prisma.milestoneDependency.findMany({
      where: { predecessorMilestoneId: milestoneId },
      include: { successor: true },
    });

    for (const dep of dependencies) {
      const successor = dep.successor;
      let successorNewStart = new Date(successor.startDate || new Date());
      let successorNewEnd = new Date(successor.endDate || new Date());
      let changed = false;

      // Calculate new dates based on dependency type
      if (dep.dependencyType === DependencyType.FinishToStart) {
        // Successor starts after Predecessor ends + lag
        const calculatedStart = new Date(newEndDate);
        calculatedStart.setDate(calculatedStart.getDate() + dep.lagDays);
        
        if (calculatedStart.getTime() !== successorNewStart.getTime()) {
            const duration = (successor.endDate?.getTime() || 0) - (successor.startDate?.getTime() || 0);
            successorNewStart = calculatedStart;
            successorNewEnd = new Date(successorNewStart.getTime() + duration);
            changed = true;
        }
      } else if (dep.dependencyType === DependencyType.StartToStart) {
         // Successor starts after Predecessor starts + lag
         const calculatedStart = new Date(newStartDate);
         calculatedStart.setDate(calculatedStart.getDate() + dep.lagDays);

         if (calculatedStart.getTime() !== successorNewStart.getTime()) {
            const duration = (successor.endDate?.getTime() || 0) - (successor.startDate?.getTime() || 0);
            successorNewStart = calculatedStart;
            successorNewEnd = new Date(successorNewStart.getTime() + duration);
            changed = true;
         }
      }

      if (changed) {
        // Update the successor
        await prisma.milestone.update({
          where: { id: successor.id },
          data: {
            startDate: successorNewStart,
            endDate: successorNewEnd,
          },
        });

        // Recursively update dependencies of the successor
        await this.recalculateDependencies(successor.id, successorNewStart, successorNewEnd);
      }
    }
  }
}
