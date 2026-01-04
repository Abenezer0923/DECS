import { z } from 'zod';

// Common validation schemas
export const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
  }),
});

// Election Cycle Schemas
export const createElectionCycleSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(255),
    type: z.enum(['National', 'ByElection', 'Referendum']),
    startDate: z.string().datetime('Invalid date format'),
    endDate: z.string().datetime('Invalid date format'),
  }).refine(data => new Date(data.startDate) < new Date(data.endDate), {
    message: 'Start date must be before end date',
    path: ['startDate'],
  }),
});

export const updateElectionCycleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    name: z.string().min(3).max(255).optional(),
    type: z.enum(['National', 'ByElection', 'Referendum']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z.enum(['Planning', 'Active', 'Archived']).optional(),
  }),
});

// Milestone Schemas
export const createMilestoneSchema = z.object({
  body: z.object({
    electionCycleId: z.number().int().positive(),
    title: z.string().min(3).max(255),
    description: z.string().max(2000).optional(),
    legalBasis: z.string().max(500).optional(),
    responsibleDepartment: z.string().max(255).optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    isStatutory: z.boolean().optional(),
    parentMilestoneId: z.number().int().positive().optional(),
  }).refine(data => new Date(data.startDate) < new Date(data.endDate), {
    message: 'Start date must be before end date',
    path: ['startDate'],
  }),
});

export const updateMilestoneSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    title: z.string().min(3).max(255).optional(),
    description: z.string().max(2000).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z.enum(['Planned', 'Ongoing', 'Completed', 'Delayed', 'Cancelled']).optional(),
    isStatutory: z.boolean().optional(),
    riskLevel: z.enum(['Low', 'Medium', 'High']).optional(),
    translations: z.array(z.object({
      language: z.string().length(2),
      title: z.string().min(3).max(255),
      description: z.string().max(2000).optional(),
    })).optional(),
  }),
});

// Communication Action Schemas
export const createCommunicationActionSchema = z.object({
  body: z.object({
    milestoneId: z.number().int().positive(),
    type: z.enum(['PressRelease', 'SocialMedia', 'SMS', 'WebsiteUpdate']),
    contentDraft: z.string().max(5000).optional(),
    targetAudience: z.string().max(500).optional(),
    language: z.string().length(2).optional(),
    isRiskResponse: z.boolean().optional(),
  }),
});

// Alert Schemas
export const createAlertSchema = z.object({
  body: z.object({
    milestoneId: z.number().int().positive(),
    triggerCondition: z.string().regex(/^\d+_DAYS_BEFORE_(START|END)$/, 
      'Invalid trigger condition format. Use: X_DAYS_BEFORE_START or X_DAYS_BEFORE_END'),
    recipientRoleId: z.number().int().positive(),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  }),
});

// Auth Schemas
export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 
      'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    roleId: z.number().int().positive(),
    department: z.string().max(255).optional(),
  }),
});

// Risk Response Schemas
export const createRiskResponseSchema = z.object({
  body: z.object({
    milestoneId: z.number().int().positive(),
    content: z.string().min(10).max(5000),
    type: z.enum(['FAQ', 'HoldingStatement', 'Clarification', 'KeyMessage']),
  }),
});

// Document Upload Schema
export const uploadDocumentSchema = z.object({
  body: z.object({
    milestoneId: z.string().regex(/^\d+$/, 'Milestone ID must be a number'),
  }),
});
