// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  department?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Election Types
export type ElectionType = 'National' | 'ByElection' | 'Referendum';
export type ElectionStatus = 'Planning' | 'Active' | 'Archived';

export interface ElectionCycle {
  id: number;
  name: string;
  type: ElectionType;
  startDate: string;
  endDate: string;
  status: ElectionStatus;
  milestones?: Milestone[];
}

// Milestone Types
export type MilestoneStatus = 'Planned' | 'Ongoing' | 'Completed' | 'Delayed' | 'Cancelled';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Milestone {
  id: number;
  electionCycleId: number;
  title: string;
  description?: string;
  legalBasis?: string;
  responsibleDepartment?: string;
  startDate: string;
  endDate: string;
  isStatutory: boolean;
  status: MilestoneStatus;
  riskLevel: RiskLevel;
  parentMilestoneId?: number;
  translations?: MilestoneTranslation[];
  electionCycle?: ElectionCycle;
}

export interface MilestoneTranslation {
  id: number;
  milestoneId: number;
  language: string;
  title: string;
  description?: string;
}

// Communication Types
export type CommunicationType = 'PressRelease' | 'SocialMedia' | 'SMS' | 'WebsiteUpdate';
export type CommunicationStatus = 'Draft' | 'PendingApproval' | 'Published';

export interface CommunicationAction {
  id: number;
  milestoneId: number;
  type: CommunicationType;
  contentDraft?: string;
  targetAudience?: string;
  language?: string;
  status: CommunicationStatus;
  isRiskResponse: boolean;
  milestone?: Milestone;
}

// Alert Types
export type AlertPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Alert {
  id: number;
  milestoneId: number;
  triggerCondition: string;
  recipientRoleId: number;
  priority: AlertPriority;
  isActive: boolean;
  milestone?: Milestone;
}

// Report Types
export interface ProgressStats {
  total: number;
  completed: number;
  ongoing: number;
  delayed: number;
  planned: number;
}

export interface ProgressReport {
  stats: ProgressStats;
  milestones: Milestone[];
}

// Public Calendar Types
export interface PublicCalendarEntry {
  id: number;
  milestoneId: number;
  publicTitle: string;
  publicDescription?: string;
  isPublished: boolean;
  milestone: {
    startDate: string;
    endDate: string;
    status: MilestoneStatus;
  };
}

// Risk Management Types
export type RiskResponseType = 'FAQ' | 'HoldingStatement' | 'Clarification' | 'KeyMessage';

export interface RiskResponse {
  id: number;
  milestoneId: number;
  content: string;
  type: RiskResponseType;
  createdAt: string;
  updatedAt: string;
}

// Document Types
export interface Document {
  id: number;
  milestoneId: number;
  filePath: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  uploader?: {
    username: string;
  };
}

// Audit Log Types
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'ACCESS';

export interface AuditLog {
  id: string;
  userId: string;
  entityTable: string;
  entityId: number;
  action: AuditAction;
  oldValues?: any;
  newValues?: any;
  timestamp: string;
  user: {
    username: string;
    email: string;
    role: {
      name: string;
    };
  };
}

// API Response Types
export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form Types
export interface CreateElectionForm {
  name: string;
  type: ElectionType;
  startDate: string;
  endDate: string;
}

export interface CreateMilestoneForm {
  electionCycleId: number;
  title: string;
  description?: string;
  legalBasis?: string;
  responsibleDepartment?: string;
  startDate: string;
  endDate: string;
  isStatutory: boolean;
  parentMilestoneId?: number;
  riskLevel?: RiskLevel;
}

export interface CreateCommunicationForm {
  milestoneId: number;
  type: CommunicationType;
  contentDraft?: string;
  targetAudience?: string;
  language?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalElections: number;
  activeMilestones: number;
  pendingCommunications: number;
  delayedMilestones: number;
}

// Language Types
export type Language = 'en' | 'am' | 'om' | 'ti' | 'so' | 'aa' | 'sid';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}
