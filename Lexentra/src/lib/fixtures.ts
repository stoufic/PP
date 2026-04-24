import {
  AgreementView,
  AppUser,
  AuditLogView,
  DashboardState,
  PlaybookView,
  SearchResultView,
  TemplateView
} from "@/lib/types";
import { initials } from "@/lib/utils";

const usersBase = [
  {
    id: "usr_admin",
    organizationId: "org_northbridge",
    workspaceId: "ws_enterprise_legal",
    departmentId: "dep_legal",
    name: "Maya Chen",
    email: "maya.chen@northbridge.example",
    role: "ADMIN" as const,
    title: "Deputy General Counsel",
    departmentName: "Legal"
  },
  {
    id: "usr_legal_manager",
    organizationId: "org_northbridge",
    workspaceId: "ws_enterprise_legal",
    departmentId: "dep_legal",
    name: "Elias Morgan",
    email: "elias.morgan@northbridge.example",
    role: "LEGAL_MANAGER" as const,
    title: "Legal Operations Director",
    departmentName: "Legal"
  },
  {
    id: "usr_reviewer",
    organizationId: "org_northbridge",
    workspaceId: "ws_enterprise_legal",
    departmentId: "dep_procurement",
    name: "Rina Patel",
    email: "rina.patel@northbridge.example",
    role: "REVIEWER" as const,
    title: "Senior Procurement Reviewer",
    departmentName: "Procurement"
  },
  {
    id: "usr_approver",
    organizationId: "org_northbridge",
    workspaceId: "ws_enterprise_legal",
    departmentId: "dep_finance",
    name: "Jonah Ellis",
    email: "jonah.ellis@northbridge.example",
    role: "APPROVER" as const,
    title: "VP Finance",
    departmentName: "Finance"
  },
  {
    id: "usr_signer",
    organizationId: "org_northbridge",
    workspaceId: "ws_enterprise_legal",
    departmentId: "dep_exec",
    name: "Sofia Laurent",
    email: "sofia.laurent@northbridge.example",
    role: "SIGNER" as const,
    title: "Chief Operating Officer",
    departmentName: "Executive"
  },
  {
    id: "usr_viewer",
    organizationId: "org_northbridge",
    workspaceId: "ws_enterprise_legal",
    departmentId: "dep_compliance",
    name: "Noah Rivera",
    email: "noah.rivera@northbridge.example",
    role: "VIEWER" as const,
    title: "Compliance Analyst",
    departmentName: "Compliance"
  }
];

export const demoUsers: AppUser[] = usersBase.map((user) => ({
  ...user,
  initials: initials(user.name)
}));

const msaV2 = `
1. Services. MedAxis Cloud will provide managed data integration, SOC 2 monitored hosting, and analytics pipeline support for Northbridge Health.

2. Fees and Payment Terms. Northbridge Health will pay monthly platform fees within forty-five (45) days of invoice receipt. Professional services fees are billed as incurred.

3. Security Incident Notification. Vendor shall notify Northbridge Health of any security incident without undue delay and in all cases within seventy-two (72) hours of confirmed discovery.

4. Data Use. Vendor may process protected data only to perform the services and may not use customer data to train generalized models without written authorization.

5. Term and Renewal. Initial term is three years and renews automatically for successive one-year periods unless either party provides ninety (90) days written notice before renewal.

6. Termination for Cause. Either party may terminate for material breach if the breach remains uncured for thirty (30) days after written notice.

7. Limitation of Liability. Vendor liability is capped at fees paid in the prior six months, excluding confidentiality breaches and gross negligence.
`;

const msaV3 = `
1. Services. MedAxis Cloud will provide managed data integration, audited hosting, implementation support, and analytics pipeline support for Northbridge Health.

2. Fees and Payment Terms. Northbridge Health will pay monthly platform fees within thirty (30) days of invoice receipt. Professional services fees require pre-approved statements of work.

3. Security Incident Notification. Vendor shall notify Northbridge Health of any security incident within twenty-four (24) hours of confirmed discovery and provide status updates every twelve (12) hours until containment.

4. Data Use. Vendor may process protected data only to perform the services and may not use customer data for model training, benchmarking, or derivative datasets.

5. Term and Renewal. Initial term is three years and renews automatically for successive one-year periods unless either party provides one hundred twenty (120) days written notice before renewal.

6. Termination for Cause. Either party may terminate for material breach if the breach remains uncured for fifteen (15) days after written notice. Northbridge Health may terminate immediately for repeated security failures.

7. Limitation of Liability. Vendor liability is capped at fees paid in the prior twelve months, excluding confidentiality breaches, gross negligence, willful misconduct, and regulatory penalties arising from vendor fault.
`;

const ndaV1 = `
1. Confidential Information. Each party shall protect the other's Confidential Information using commercially reasonable safeguards.

2. Permitted Use. Confidential Information may be used solely to evaluate the proposed business relationship.

3. Term. This NDA begins on the Effective Date and continues for two (2) years, while confidentiality obligations survive for five (5) years.

4. Injunctive Relief. Unauthorized disclosure may cause irreparable harm and entitle the disclosing party to injunctive relief.
`;

export const demoPlaybooks: PlaybookView[] = [
  {
    id: "playbook_vendor_risk",
    name: "Vendor Risk Playbook",
    description: "Standard review posture for infrastructure, SaaS, and procurement agreements with regulated data exposure.",
    rules: [
      {
        id: "rule_notice",
        category: "Security Incident Notification",
        riskCategory: "Security",
        required: true,
        approvalPath: "Legal Manager + Security",
        preferredText: "Notice within 24 hours of confirmed discovery with ongoing remediation updates.",
        fallbackText: "Notice within 48 hours with written incident summary.",
        unacceptable: "Notice later than 72 hours or only upon customer request."
      },
      {
        id: "rule_ai_use",
        category: "Model Training Restrictions",
        riskCategory: "Data Governance",
        required: true,
        approvalPath: "Deputy General Counsel",
        preferredText: "Customer data cannot be used for generalized model training, benchmarks, or derivative datasets.",
        fallbackText: "Any training use requires prior written opt-in and a segregated environment.",
        unacceptable: "Implicit vendor rights to train on production data."
      },
      {
        id: "rule_liability",
        category: "Liability Cap",
        riskCategory: "Financial",
        required: true,
        approvalPath: "Finance + Legal",
        preferredText: "Cap at 12 months of fees with carve-outs for confidentiality, data misuse, gross negligence, and regulatory penalties.",
        fallbackText: "Cap at 9 months of fees with confidentiality and data misuse carve-outs.",
        unacceptable: "Cap below 6 months of fees or no carve-outs."
      }
    ]
  },
  {
    id: "playbook_nda",
    name: "NDA Standard Playbook",
    description: "Preferred confidentiality protections, use limitations, and disclosure controls for mutual NDAs.",
    rules: [
      {
        id: "rule_confidentiality_term",
        category: "Confidentiality Survival",
        riskCategory: "Confidentiality",
        required: true,
        approvalPath: "Legal Manager",
        preferredText: "Confidentiality obligations survive at least five years, or indefinitely for trade secrets.",
        fallbackText: "Three-year survival for general confidentiality obligations.",
        unacceptable: "Survival shorter than two years."
      },
      {
        id: "rule_use_restriction",
        category: "Permitted Use",
        riskCategory: "Scope Control",
        required: true,
        approvalPath: "Legal Manager",
        preferredText: "Use solely for evaluating the contemplated relationship.",
        fallbackText: "Use solely for the limited business purpose stated in the agreement.",
        unacceptable: "Broad internal business use without limitation."
      }
    ]
  }
];

export const demoTemplates: TemplateView[] = [
  {
    id: "tpl_nda",
    name: "Mutual NDA",
    agreementType: "NDA",
    description: "Mutual confidentiality template with optional data handling rider.",
    defaultMetadata: {
      department: "Legal",
      retention: "7 years",
      riskOwner: "Legal Operations"
    },
    workflowDefaults: {
      reviewers: ["Rina Patel"],
      approvers: ["Elias Morgan"],
      signers: ["Sofia Laurent"]
    }
  },
  {
    id: "tpl_msa",
    name: "Master Services Agreement",
    agreementType: "MSA",
    description: "Enterprise vendor MSA with security, privacy, and audit addenda.",
    defaultMetadata: {
      department: "Procurement",
      retention: "10 years",
      riskOwner: "Vendor Governance"
    },
    workflowDefaults: {
      reviewers: ["Rina Patel", "Noah Rivera"],
      approvers: ["Jonah Ellis"],
      signers: ["Sofia Laurent"]
    }
  },
  {
    id: "tpl_sow",
    name: "Statement of Work",
    agreementType: "SOW",
    description: "Delivery-scoped SOW with milestones, acceptance criteria, and obligation tracking.",
    defaultMetadata: {
      department: "Operations",
      retention: "7 years",
      riskOwner: "Delivery Office"
    },
    workflowDefaults: {
      reviewers: ["Elias Morgan"],
      approvers: ["Jonah Ellis"],
      signers: ["Sofia Laurent"]
    }
  },
  {
    id: "tpl_procurement",
    name: "Procurement Agreement",
    agreementType: "Procurement Agreement",
    description: "Supplier-facing agreement for regulated procurement and renewal oversight.",
    defaultMetadata: {
      department: "Procurement",
      retention: "10 years",
      riskOwner: "Supply Chain"
    },
    workflowDefaults: {
      reviewers: ["Rina Patel"],
      approvers: ["Jonah Ellis"],
      signers: ["Sofia Laurent"]
    }
  }
];

export const demoAgreements: AgreementView[] = [
  {
    id: "agr_medaxis_msa",
    agreementNumber: "AGR-24031",
    title: "Managed Data Platform Master Services Agreement",
    agreementType: "MSA",
    status: "IN_REVIEW",
    counterparty: "MedAxis Cloud",
    department: "Procurement",
    owner: "Elias Morgan",
    effectiveDate: "2026-05-01",
    expirationDate: "2029-05-01",
    renewalTerms: "Auto-renews annually unless 120 days notice is given.",
    summary: "Enterprise services agreement covering data integration, hosting, and analytics operations for regulated clinical datasets.",
    riskLevel: "High",
    aiExtractionStatus: "Review Ready",
    complianceStatus: "Attention Needed",
    tags: ["regulated-data", "vendor-critical", "renewal-watch"],
    reviewers: ["Rina Patel", "Noah Rivera"],
    approvers: ["Jonah Ellis"],
    signers: ["Sofia Laurent"],
    versions: [
      {
        id: "ver_medaxis_2",
        versionNumber: 2,
        uploadedBy: "Elias Morgan",
        createdAt: "2026-04-18T10:20:00.000Z",
        summary: "Counterparty markup with 45-day payment terms, 72-hour incident notice, and 6-month liability cap.",
        content: msaV2
      },
      {
        id: "ver_medaxis_3",
        versionNumber: 3,
        uploadedBy: "Maya Chen",
        createdAt: "2026-04-22T15:45:00.000Z",
        summary: "Northbridge fallback language tightened incident notice, shortened cure period, and expanded liability carve-outs.",
        content: msaV3
      }
    ],
    clauses: [
      {
        id: "cl_security_notice",
        heading: "Security Incident Notification",
        body: "Vendor shall notify Northbridge Health within twenty-four hours of confirmed discovery and continue written updates until containment is complete.",
        category: "Security",
        riskLevel: "High",
        sourceAnchor: "Section 3",
        confidence: 0.94
      },
      {
        id: "cl_model_training",
        heading: "Data Use Restriction",
        body: "Vendor may not use customer data for model training, benchmarking, or derivative datasets.",
        category: "AI Governance",
        riskLevel: "Medium",
        sourceAnchor: "Section 4",
        confidence: 0.96
      },
      {
        id: "cl_renewal",
        heading: "Term and Renewal",
        body: "Initial term is three years with automatic one-year renewals unless 120 days written notice is provided.",
        category: "Renewal",
        riskLevel: "Medium",
        sourceAnchor: "Section 5",
        confidence: 0.92
      }
    ],
    comments: [
      {
        id: "com_1",
        author: "Rina Patel",
        authorRole: "Reviewer",
        body: "We should keep the 24-hour incident notice and avoid drifting back to 72 hours. This is a board-level vendor.",
        sectionAnchor: "Section 3",
        createdAt: "2026-04-22T16:02:00.000Z",
        resolved: false,
        mentions: ["Maya Chen"]
      },
      {
        id: "com_2",
        author: "Noah Rivera",
        authorRole: "Viewer",
        body: "Please add explicit language on audit log retention for any downstream subprocessor access.",
        sectionAnchor: "Section 4",
        createdAt: "2026-04-23T09:18:00.000Z",
        resolved: false,
        mentions: ["Elias Morgan"]
      }
    ],
    approvalSteps: [
      {
        id: "apr_step_1",
        assignee: "Rina Patel",
        role: "Reviewer",
        stageOrder: 1,
        status: "APPROVED",
        dueAt: "2026-04-22",
        completedAt: "2026-04-22",
        note: "Commercial terms aligned with procurement policy."
      },
      {
        id: "apr_step_2",
        assignee: "Jonah Ellis",
        role: "Approver",
        stageOrder: 2,
        status: "PENDING",
        dueAt: "2026-04-26"
      }
    ],
    signatures: [
      {
        id: "sig_1",
        signer: "Sofia Laurent",
        role: "Internal Signer",
        orderIndex: 1,
        status: "PENDING",
        requestedAt: "2026-04-26"
      }
    ],
    obligations: [
      {
        id: "obl_1",
        party: "MedAxis Cloud",
        obligation: "Provide incident notice within 24 hours and remediation updates every 12 hours until containment.",
        dueDate: "2026-05-01",
        status: "open",
        sourceAnchor: "Section 3"
      },
      {
        id: "obl_2",
        party: "Northbridge Health",
        obligation: "Pay monthly platform fees within 30 days of invoice receipt.",
        dueDate: "2026-06-01",
        status: "open",
        sourceAnchor: "Section 2"
      }
    ],
    aiReviews: [
      {
        id: "review_1",
        playbookName: "Vendor Risk Playbook",
        summary: "One residual red flag remains around liability cap language; security notification and data use terms now meet preferred policy.",
        confidence: 0.91,
        createdAt: "2026-04-23T14:10:00.000Z",
        findings: [
          {
            title: "Liability cap still below preferred standard",
            severity: "High",
            summary: "Version 3 improved the cap to 12 months but carve-out drafting should expressly include regulatory fines caused by vendor acts.",
            recommendation: "Retain the 12-month cap and add an explicit carve-out for regulator-imposed penalties attributable to vendor non-compliance.",
            sourceAnchor: "Section 7",
            confidence: 0.89
          },
          {
            title: "Auto-renewal notice period is compliant",
            severity: "Low",
            summary: "The 120-day non-renewal notice is aligned with the playbook and reduces surprise renewal risk.",
            recommendation: "Keep as drafted.",
            sourceAnchor: "Section 5",
            confidence: 0.96
          }
        ]
      }
    ],
    timeline: [
      {
        id: "tl_1",
        title: "AI review completed",
        detail: "Playbook review finished with 2 findings and 91% confidence.",
        actor: "Lexentra AI",
        createdAt: "2026-04-23T14:10:00.000Z",
        tone: "success"
      },
      {
        id: "tl_2",
        title: "Version 3 uploaded",
        detail: "Northbridge fallback terms were applied to security notice, data use, and liability.",
        actor: "Maya Chen",
        createdAt: "2026-04-22T15:45:00.000Z"
      },
      {
        id: "tl_3",
        title: "Review comment added",
        detail: "Procurement requested strict notice language be preserved.",
        actor: "Rina Patel",
        createdAt: "2026-04-22T16:02:00.000Z",
        tone: "warning"
      }
    ]
  },
  {
    id: "agr_celestine_nda",
    agreementNumber: "AGR-24029",
    title: "Mutual Confidentiality Agreement",
    agreementType: "NDA",
    status: "APPROVED",
    counterparty: "Celestine Analytics",
    department: "Legal",
    owner: "Maya Chen",
    effectiveDate: "2026-04-10",
    expirationDate: "2028-04-10",
    renewalTerms: "No renewal. Confidentiality survives five years.",
    summary: "Mutual NDA supporting diligence discussions around a regulated analytics partnership.",
    riskLevel: "Low",
    aiExtractionStatus: "Indexed",
    complianceStatus: "Healthy",
    tags: ["nda", "diligence"],
    reviewers: ["Elias Morgan"],
    approvers: ["Maya Chen"],
    signers: ["Sofia Laurent"],
    versions: [
      {
        id: "ver_nda_1",
        versionNumber: 1,
        uploadedBy: "Maya Chen",
        createdAt: "2026-04-10T11:00:00.000Z",
        summary: "Counterparty final clean version.",
        content: ndaV1
      }
    ],
    clauses: [
      {
        id: "cl_nda_conf",
        heading: "Confidential Information",
        body: "Each party shall protect Confidential Information using commercially reasonable safeguards.",
        category: "Confidentiality",
        riskLevel: "Low",
        sourceAnchor: "Section 1",
        confidence: 0.94
      }
    ],
    comments: [],
    approvalSteps: [
      {
        id: "apr_nda_1",
        assignee: "Elias Morgan",
        role: "Legal Manager",
        stageOrder: 1,
        status: "APPROVED",
        completedAt: "2026-04-11"
      }
    ],
    signatures: [
      {
        id: "sig_nda_1",
        signer: "Sofia Laurent",
        role: "Internal Signer",
        orderIndex: 1,
        status: "COMPLETED",
        requestedAt: "2026-04-11",
        completedAt: "2026-04-11"
      }
    ],
    obligations: [],
    aiReviews: [
      {
        id: "review_nda_1",
        playbookName: "NDA Standard Playbook",
        summary: "Draft aligned with confidentiality term and permitted-use policy.",
        confidence: 0.95,
        createdAt: "2026-04-10T13:45:00.000Z",
        findings: []
      }
    ],
    timeline: [
      {
        id: "tl_nda_1",
        title: "Agreement approved",
        detail: "Final NDA approved without residual exceptions.",
        actor: "Elias Morgan",
        createdAt: "2026-04-11T09:15:00.000Z",
        tone: "success"
      }
    ]
  },
  {
    id: "agr_supplier",
    agreementNumber: "AGR-24018",
    title: "Strategic Supplier Procurement Agreement",
    agreementType: "Procurement Agreement",
    status: "AWAITING_SIGNATURE",
    counterparty: "Asteron Devices",
    department: "Procurement",
    owner: "Rina Patel",
    effectiveDate: "2026-04-01",
    expirationDate: "2027-04-01",
    renewalTerms: "Renews for one-year periods unless 60 days notice is given.",
    summary: "Hardware supply agreement covering replacement parts, warranties, and service levels for distributed clinics.",
    riskLevel: "Medium",
    aiExtractionStatus: "Indexed",
    complianceStatus: "Healthy",
    tags: ["supplier", "hardware"],
    reviewers: ["Elias Morgan"],
    approvers: ["Jonah Ellis"],
    signers: ["Sofia Laurent"],
    versions: [],
    clauses: [],
    comments: [],
    approvalSteps: [
      {
        id: "apr_supplier_1",
        assignee: "Jonah Ellis",
        role: "Approver",
        stageOrder: 1,
        status: "APPROVED",
        completedAt: "2026-04-20"
      }
    ],
    signatures: [
      {
        id: "sig_supplier_1",
        signer: "Sofia Laurent",
        role: "Internal Signer",
        orderIndex: 1,
        status: "SENT",
        requestedAt: "2026-04-21"
      }
    ],
    obligations: [],
    aiReviews: [],
    timeline: []
  },
  {
    id: "agr_dpa",
    agreementNumber: "AGR-24007",
    title: "Data Processing Addendum",
    agreementType: "DPA",
    status: "NEEDS_CHANGES",
    counterparty: "Rivergate Labs",
    department: "Compliance",
    owner: "Noah Rivera",
    effectiveDate: "2026-03-12",
    expirationDate: "2028-03-12",
    renewalTerms: "Co-terminus with MSA.",
    summary: "Data processing addendum with unresolved subprocessor audit rights and deletion timeline exceptions.",
    riskLevel: "Critical",
    aiExtractionStatus: "Review Ready",
    complianceStatus: "Escalated",
    tags: ["privacy", "subprocessors"],
    reviewers: ["Maya Chen"],
    approvers: ["Jonah Ellis"],
    signers: ["Sofia Laurent"],
    versions: [],
    clauses: [],
    comments: [],
    approvalSteps: [
      {
        id: "apr_dpa_1",
        assignee: "Maya Chen",
        role: "Admin",
        stageOrder: 1,
        status: "CHANGES_REQUESTED",
        completedAt: "2026-04-19",
        note: "Deletion rights too weak for regulated records."
      }
    ],
    signatures: [],
    obligations: [],
    aiReviews: [],
    timeline: []
  },
  {
    id: "agr_employment",
    agreementNumber: "AGR-24012",
    title: "Executive Employment Agreement",
    agreementType: "Employment Agreement",
    status: "EXECUTED",
    counterparty: "Avery Shaw",
    department: "Executive",
    owner: "Maya Chen",
    effectiveDate: "2026-02-01",
    expirationDate: "2029-02-01",
    renewalTerms: "Renews annually after initial term.",
    summary: "Executed employment agreement with compensation, confidentiality, and change-in-control provisions.",
    riskLevel: "Low",
    aiExtractionStatus: "Indexed",
    complianceStatus: "Healthy",
    tags: ["employment"],
    reviewers: ["Elias Morgan"],
    approvers: ["Jonah Ellis"],
    signers: ["Sofia Laurent"],
    versions: [],
    clauses: [],
    comments: [],
    approvalSteps: [],
    signatures: [],
    obligations: [],
    aiReviews: [],
    timeline: []
  }
];

export const demoAuditLogs: AuditLogView[] = [
  {
    id: "log_1",
    action: "AI_REVIEW_RUN",
    entityType: "Agreement",
    entityId: "AGR-24031",
    actorEmail: "maya.chen@northbridge.example",
    createdAt: "2026-04-23T14:10:00.000Z",
    detail: "Vendor Risk Playbook review executed against version 3."
  },
  {
    id: "log_2",
    action: "AGREEMENT_VERSION_UPLOADED",
    entityType: "AgreementVersion",
    entityId: "ver_medaxis_3",
    actorEmail: "maya.chen@northbridge.example",
    createdAt: "2026-04-22T15:45:00.000Z",
    detail: "Version 3 uploaded with revised liability and security language."
  },
  {
    id: "log_3",
    action: "APPROVAL_COMPLETED",
    entityType: "ApprovalStep",
    entityId: "apr_supplier_1",
    actorEmail: "jonah.ellis@northbridge.example",
    createdAt: "2026-04-20T11:03:00.000Z",
    detail: "Finance approval completed for procurement agreement."
  },
  {
    id: "log_4",
    action: "LOGIN",
    entityType: "Session",
    entityId: "demo-session",
    actorEmail: "maya.chen@northbridge.example",
    createdAt: "2026-04-24T08:10:00.000Z",
    detail: "Successful admin login from managed device."
  }
];

export const demoDashboard: DashboardState = {
  metrics: [
    { label: "Agreements in progress", value: "18", change: "+3 this week" },
    { label: "Awaiting review", value: "6", change: "2 bottlenecks", tone: "warning" },
    { label: "Awaiting signature", value: "4", change: "1 due today" },
    { label: "Average cycle time", value: "11.8 days", change: "-1.9 days", tone: "success" }
  ],
  riskAlerts: [
    "Rivergate Labs DPA lacks strong deletion and subprocessor audit language.",
    "MedAxis Cloud liability cap still requires explicit regulatory penalty carve-out."
  ],
  complianceIssues: [
    "2 agreements reference auto-renewal without 90+ day notice.",
    "1 vendor contract still permits broad benchmarking language."
  ],
  upcomingDeadlines: [
    {
      agreementId: "agr_medaxis_msa",
      title: "Managed Data Platform MSA",
      dueAt: "2026-04-26",
      detail: "Finance approval due"
    },
    {
      agreementId: "agr_supplier",
      title: "Strategic Supplier Procurement Agreement",
      dueAt: "2026-04-25",
      detail: "Internal signature pending"
    }
  ],
  activityFeed: demoAgreements[0].timeline.concat(demoAuditLogs.slice(1).map((log) => ({
    id: log.id,
    title: log.action.replace(/_/g, " "),
    detail: log.detail,
    actor: log.actorEmail,
    createdAt: log.createdAt
  }))),
  reviewBottlenecks: [
    { label: "Procurement review backlog", value: "3 agreements" },
    { label: "Finance approvals pending", value: "2 agreements" },
    { label: "Signature turnaround", value: "1.3 days avg" }
  ]
};

export const demoSearchResults: SearchResultView[] = [
  {
    id: "agr_medaxis_msa",
    title: "Managed Data Platform Master Services Agreement",
    kind: "Agreement",
    status: "In Review",
    matchSummary: "Matched payment terms, renewal language, and data-use restrictions."
  },
  {
    id: "cl_model_training",
    title: "Data Use Restriction",
    kind: "Clause",
    status: "Medium risk",
    sourceAnchor: "Section 4",
    matchSummary: "Matched query around model training restrictions and derivative datasets."
  }
];

export const demoOrganization = {
  id: "org_northbridge",
  name: "Northbridge Health",
  slug: "northbridge-health",
  workspaceId: "ws_enterprise_legal",
  workspaceName: "Enterprise Legal"
};

export const demoCredentials = {
  email: "maya.chen@northbridge.example",
  password: "Demo@12345"
};
