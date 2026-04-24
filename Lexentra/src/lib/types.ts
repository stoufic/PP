export type UserRole =
  | "ADMIN"
  | "LEGAL_MANAGER"
  | "REVIEWER"
  | "APPROVER"
  | "SIGNER"
  | "VIEWER";

export type AgreementStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "NEEDS_CHANGES"
  | "APPROVED"
  | "AWAITING_SIGNATURE"
  | "EXECUTED"
  | "EXPIRED"
  | "ARCHIVED";

export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED";

export type SignatureStatus = "PENDING" | "SENT" | "COMPLETED" | "DECLINED";

export type Permission =
  | "agreements:view"
  | "agreements:create"
  | "agreements:review"
  | "agreements:approve"
  | "agreements:sign"
  | "templates:manage"
  | "playbooks:manage"
  | "reports:view"
  | "admin:manage-users"
  | "admin:view-audit"
  | "settings:manage-ai";

export type SessionUser = {
  id: string;
  organizationId: string;
  workspaceId: string;
  departmentId?: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
};

export type AppUser = SessionUser & {
  initials: string;
  departmentName: string;
};

export type CommentThread = {
  id: string;
  author: string;
  authorRole: string;
  body: string;
  sectionAnchor: string;
  createdAt: string;
  resolved: boolean;
  mentions: string[];
};

export type AgreementClause = {
  id: string;
  heading: string;
  body: string;
  category: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  sourceAnchor: string;
  confidence: number;
};

export type AgreementVersion = {
  id: string;
  versionNumber: number;
  uploadedBy: string;
  createdAt: string;
  summary: string;
  content: string;
};

export type ApprovalStepView = {
  id: string;
  assignee: string;
  role: string;
  stageOrder: number;
  status: ApprovalStatus;
  dueAt?: string;
  completedAt?: string;
  note?: string;
};

export type SignatureView = {
  id: string;
  signer: string;
  role: string;
  orderIndex: number;
  status: SignatureStatus;
  requestedAt?: string;
  completedAt?: string;
};

export type ObligationView = {
  id: string;
  party: string;
  obligation: string;
  dueDate?: string;
  status: "open" | "in_progress" | "completed";
  sourceAnchor: string;
};

export type AIReviewFinding = {
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  summary: string;
  recommendation: string;
  sourceAnchor: string;
  confidence: number;
};

export type AIReviewView = {
  id: string;
  playbookName: string;
  summary: string;
  findings: AIReviewFinding[];
  confidence: number;
  createdAt: string;
};

export type TimelineItem = {
  id: string;
  title: string;
  detail: string;
  actor: string;
  createdAt: string;
  tone?: "default" | "warning" | "success";
};

export type AgreementView = {
  id: string;
  agreementNumber: string;
  title: string;
  agreementType: string;
  status: AgreementStatus;
  counterparty: string;
  department: string;
  owner: string;
  effectiveDate?: string;
  expirationDate?: string;
  renewalTerms?: string;
  summary: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  aiExtractionStatus: "Queued" | "Indexed" | "Review Ready";
  complianceStatus: "Healthy" | "Attention Needed" | "Escalated";
  tags: string[];
  reviewers: string[];
  approvers: string[];
  signers: string[];
  versions: AgreementVersion[];
  clauses: AgreementClause[];
  comments: CommentThread[];
  approvalSteps: ApprovalStepView[];
  signatures: SignatureView[];
  obligations: ObligationView[];
  aiReviews: AIReviewView[];
  timeline: TimelineItem[];
};

export type PlaybookRuleView = {
  id: string;
  category: string;
  riskCategory: string;
  required: boolean;
  approvalPath: string;
  preferredText: string;
  fallbackText: string;
  unacceptable: string;
};

export type PlaybookView = {
  id: string;
  name: string;
  description: string;
  rules: PlaybookRuleView[];
};

export type TemplateView = {
  id: string;
  name: string;
  agreementType: string;
  description: string;
  defaultMetadata: Record<string, string>;
  workflowDefaults: {
    reviewers: string[];
    approvers: string[];
    signers: string[];
  };
};

export type AuditLogView = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorEmail: string;
  createdAt: string;
  detail: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  change: string;
  tone?: "default" | "warning" | "success";
};

export type DashboardState = {
  metrics: DashboardMetric[];
  riskAlerts: string[];
  complianceIssues: string[];
  upcomingDeadlines: Array<{
    agreementId: string;
    title: string;
    dueAt: string;
    detail: string;
  }>;
  activityFeed: TimelineItem[];
  reviewBottlenecks: Array<{
    label: string;
    value: string;
  }>;
};

export type SearchResultView = {
  id: string;
  title: string;
  kind: "Agreement" | "Clause";
  status: string;
  matchSummary: string;
  sourceAnchor?: string;
};
