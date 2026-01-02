import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Mock Transporter (In production, use real SMTP credentials)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'test@ethereal.email',
    pass: 'test',
  },
});

export class AlertService {
  
  constructor() {
    // Initialize Cron Job: Run every day at midnight
    cron.schedule('0 0 * * *', () => {
      console.log('Running daily deadline check...');
      this.checkDeadlines();
    });
  }

  async checkDeadlines() {
    try {
      const alerts = await prisma.alert.findMany({
        where: { isActive: true },
        include: { milestone: true, recipientRole: { include: { users: true } } }
      });

      const today = new Date();

      for (const alert of alerts) {
        if (!alert.milestone.startDate) continue;

        // Parse trigger condition (Simple implementation: "X_DAYS_BEFORE_START")
        const daysBefore = this.parseCondition(alert.triggerCondition);
        
        if (daysBefore !== null) {
            const targetDate = new Date(alert.milestone.startDate);
            targetDate.setDate(targetDate.getDate() - daysBefore);

            // Check if today matches the target notification date (ignoring time)
            if (this.isSameDay(today, targetDate)) {
                await this.sendNotification(alert);
            }
        }
      }
    } catch (error) {
      console.error('Error checking deadlines:', error);
    }
  }

  private parseCondition(condition: string): number | null {
    // Example format: "3_DAYS_BEFORE_START"
    const match = condition.match(/^(\d+)_DAYS_BEFORE_START$/);
    return match ? parseInt(match[1], 10) : null;
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  private async sendNotification(alert: any) {
    const recipients = alert.recipientRole.users.map((u: any) => u.email);
    
    if (recipients.length === 0) return;

    const message = {
      from: '"DECS System" <system@decs.et>',
      to: recipients.join(', '),
      subject: `[${alert.priority}] Upcoming Milestone: ${alert.milestone.title}`,
      text: `Reminder: The milestone "${alert.milestone.title}" is scheduled to start on ${alert.milestone.startDate}. \n\nDescription: ${alert.milestone.description || 'N/A'}`,
    };

    try {
        // In a real app, uncomment this:
        // await transporter.sendMail(message);
        console.log(`[MOCK EMAIL] Sent to ${recipients.join(', ')}: ${message.subject}`);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
  }
}
