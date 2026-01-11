import { PrismaClient, DependencyType } from '@prisma/client';
import { addDays, differenceInDays } from 'date-fns';
import cron from 'node-cron';
import { NotificationService } from './notificationService';

const prisma = new PrismaClient();

export class SchedulerService {
  /**
   * Cascades date changes to successor milestones.
   * If a milestone's end date changes, shift all dependent successors by the same delta
   * OR ensure they start after the predecessor (depending on business rule).
   * 
   * Simple Logic for DECS: FinishToStart constraint.
   * Successor.StartDate must be >= Predecessor.EndDate + LagDays.
   * If Predecessor is delayed, push Successor.
   */
  static async cascadeDateChanges(milestoneId: number, oldEndDate: Date, newEndDate: Date) {
    if (oldEndDate.getTime() === newEndDate.getTime()) return;

    const diffDays = differenceInDays(newEndDate, oldEndDate);
    if (diffDays === 0) return;

    // Find direct successors
    const dependencies = await prisma.milestoneDependency.findMany({
      where: { 
        predecessorMilestoneId: milestoneId,
        dependencyType: DependencyType.FinishToStart 
      },
      include: { successor: true }
    });

    for (const dep of dependencies) {
      const successor = dep.successor;
      if (!successor.startDate || !successor.endDate) continue;

      // Calculate new dates for successor
      // We shift the successor by the same amount the predecessor moved
      // This preserves the duration and buffer
      const newStart = addDays(successor.startDate, diffDays);
      const newEnd = addDays(successor.endDate, diffDays);

      console.log(`Shifting Milestone ${successor.id} (${successor.title}) by ${diffDays} days.`);

      // Update successor
      await prisma.milestone.update({
        where: { id: successor.id },
        data: {
          startDate: newStart,
          endDate: newEnd
        }
      });

      // Recursively update downstream
      await this.cascadeDateChanges(successor.id, successor.endDate, newEnd);
    }
  }

  /**
   * Initializes cron jobs for the system.
   * Can be called from server.ts on startup.
   */
  static initCronJobs() {
    console.log('Initializing Scheduler Cron Jobs...');
    
    // Check deadlines every day at 08:00 AM
    cron.schedule('0 8 * * *', async () => {
        console.log('Running daily deadline check...');
        try {
            await this.checkUpcomingDeadlines();
        } catch (error) {
            console.error('Error running deadline check:', error);
        }
    });
  }

  /**
   * Checks for milestones ending within 48 hours and sends notifications.
   * Requirement I.2.2
   */
  static async checkUpcomingDeadlines() {
      const now = new Date();
      const next48h = addDays(now, 2);

      // Find milestones ending between NOW and NOW+48h
      const expiringMilestones = await prisma.milestone.findMany({
          where: {
              endDate: {
                  gte: now,
                  lte: next48h
              },
              status: {
                  in: ['Planned', 'Ongoing'] // Only notify for active items
              }
          },
          include: {
              alerts: {
                  where: { isActive: true },
                  include: { recipientRole: { include: { users: true } } }
              }
          }
      });

      console.log(`Found ${expiringMilestones.length} milestones ending soon.`);

      for (const milestone of expiringMilestones) {
          if (milestone.alerts.length > 0) {
              for (const alert of milestone.alerts) {
                  const recipients = alert.recipientRole.users.map(u => u.email).filter(e => e);
                  if (recipients.length > 0) {
                      await NotificationService.sendEmail({
                          recipients,
                          subject: `[Reminder] ${milestone.title} ending soon`,
                          message: `The milestone "${milestone.title}" is scheduled to end on ${milestone.endDate?.toDateString()}.\nPlease ensure all tasks are completed.`,
                          priority: alert.priority,
                          type: 'email'
                      });
                  }
              }
          }
      }
  }
}
