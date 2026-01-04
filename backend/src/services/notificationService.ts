import { PrismaClient, AlertPriority } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configure email transporter (use environment variables in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'test@ethereal.email',
    pass: process.env.SMTP_PASS || 'test',
  },
});

export interface NotificationPayload {
  recipients: string[];
  subject: string;
  message: string;
  priority: AlertPriority;
  type: 'email' | 'sms' | 'push';
}

export class NotificationService {
  /**
   * Send email notification
   */
  static async sendEmail(payload: NotificationPayload) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"DECS System" <system@decs.et>',
        to: payload.recipients.join(', '),
        subject: `[${payload.priority}] ${payload.subject}`,
        text: payload.message,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">${payload.subject}</h2>
            <p style="color: #666;">${payload.message}</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">
              This is an automated message from the Digital Election Calendar System.
            </p>
          </div>
        `,
      };

      if (process.env.NODE_ENV === 'production') {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${payload.recipients.join(', ')}`);
      } else {
        console.log('[MOCK EMAIL]', mailOptions);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }
  }

  /**
   * Send SMS notification (placeholder for SMS gateway integration)
   */
  static async sendSMS(payload: NotificationPayload) {
    // TODO: Integrate with SMS gateway (e.g., Twilio, Africa's Talking)
    console.log('[SMS PLACEHOLDER]', {
      recipients: payload.recipients,
      message: payload.message,
    });

    return { success: true, message: 'SMS gateway not configured' };
  }

  /**
   * Send notification to users based on their role
   */
  static async notifyRole(
    roleId: number,
    subject: string,
    message: string,
    priority: AlertPriority = AlertPriority.Medium
  ) {
    const users = await prisma.user.findMany({
      where: { roleId, isActive: true },
      select: { email: true },
    });

    if (users.length === 0) {
      console.log(`No active users found for role ${roleId}`);
      return;
    }

    const recipients = users.map(u => u.email);
    await this.sendEmail({
      recipients,
      subject,
      message,
      priority,
      type: 'email',
    });
  }

  /**
   * Send escalation notification to management
   */
  static async escalateToManagement(
    milestoneId: number,
    reason: string
  ) {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { electionCycle: true },
    });

    if (!milestone) {
      console.error(`Milestone ${milestoneId} not found for escalation`);
      return;
    }

    // Find management board role
    const managementRole = await prisma.role.findFirst({
      where: { name: 'Board' },
    });

    if (!managementRole) {
      console.error('Management Board role not found');
      return;
    }

    const subject = `URGENT: Milestone Escalation - ${milestone.title}`;
    const message = `
      A critical milestone requires immediate attention:
      
      Election Cycle: ${milestone.electionCycle.name}
      Milestone: ${milestone.title}
      Status: ${milestone.status}
      Risk Level: ${milestone.riskLevel}
      
      Reason for Escalation: ${reason}
      
      Please review and take necessary action.
    `;

    await this.notifyRole(managementRole.id, subject, message, AlertPriority.Critical);
  }

  /**
   * Send notification for upcoming deadline
   */
  static async notifyUpcomingDeadline(
    milestoneId: number,
    daysUntil: number
  ) {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { electionCycle: true },
    });

    if (!milestone || !milestone.responsibleDepartment) {
      return;
    }

    // Find users in the responsible department
    const users = await prisma.user.findMany({
      where: {
        department: milestone.responsibleDepartment,
        isActive: true,
      },
      select: { email: true },
    });

    if (users.length === 0) {
      console.log(`No users found for department: ${milestone.responsibleDepartment}`);
      return;
    }

    const subject = `Upcoming Deadline: ${milestone.title}`;
    const message = `
      Reminder: The following milestone is due in ${daysUntil} days:
      
      Title: ${milestone.title}
      Election Cycle: ${milestone.electionCycle.name}
      Start Date: ${milestone.startDate?.toLocaleDateString()}
      End Date: ${milestone.endDate?.toLocaleDateString()}
      Status: ${milestone.status}
      
      ${milestone.description || ''}
      
      Please ensure all tasks are completed on time.
    `;

    await this.sendEmail({
      recipients: users.map(u => u.email),
      subject,
      message,
      priority: daysUntil <= 3 ? AlertPriority.High : AlertPriority.Medium,
      type: 'email',
    });
  }
}
