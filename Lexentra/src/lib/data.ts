import { prisma } from "@/lib/prisma";
import {
  demoAgreements,
  demoAuditLogs,
  demoDashboard,
  demoOrganization,
  demoPlaybooks,
  demoSearchResults,
  demoTemplates,
  demoUsers
} from "@/lib/fixtures";
import { AgreementView, SearchResultView, SessionUser } from "@/lib/types";
import { sentenceCase } from "@/lib/utils";

function allowDemoFallback() {
  return process.env.ENABLE_DEMO_FALLBACK === "true";
}

export async function getOrganizationContext() {
  return demoOrganization;
}

export async function getDashboardState() {
  return demoDashboard;
}

export async function getTemplates() {
  return demoTemplates;
}

export async function getPlaybooks() {
  return demoPlaybooks;
}

export async function getAuditLogs() {
  return demoAuditLogs;
}

export async function getUsers() {
  return demoUsers;
}

export async function getAgreements() {
  try {
    const records = await prisma.agreement.findMany({
      include: {
        counterparty: true,
        owner: true,
        department: true
      },
      orderBy: { updatedAt: "desc" }
    });

    if (records.length > 0) {
      const mapped = records.map((agreement) => ({
        id: agreement.id,
        agreementNumber: agreement.id.slice(0, 10).toUpperCase(),
        title: agreement.title,
        agreementType: agreement.agreementType,
        status: agreement.status,
        counterparty: agreement.counterparty?.name || "Counterparty",
        department: agreement.department?.name || "Department",
        owner: agreement.owner?.name || "Owner",
        effectiveDate: agreement.effectiveDate?.toISOString(),
        expirationDate: agreement.expirationDate?.toISOString(),
        renewalTerms: agreement.renewalTerms || "Not specified.",
        summary: agreement.summary || `${agreement.agreementType} agreement managed in Lexentra.`,
        riskLevel: (agreement.riskLevel as AgreementView["riskLevel"]) || "Medium",
        aiExtractionStatus: "Indexed" as const,
        complianceStatus: "Healthy" as const,
        tags: agreement.tags,
        reviewers: [],
        approvers: [],
        signers: [],
        versions: [],
        clauses: [],
        comments: [],
        approvalSteps: [],
        signatures: [],
        obligations: [],
        aiReviews: [],
        timeline: []
      })) satisfies AgreementView[];

      return [
        ...demoAgreements,
        ...mapped.filter(
          (agreement) =>
            !demoAgreements.some((demoAgreement) => demoAgreement.id === agreement.id)
        )
      ];
    }
  } catch {
    // Fall back to seeded demo data below.
  }

  return demoAgreements;
}

export async function getAgreementById(id: string) {
  const demoAgreement = demoAgreements.find((agreement) => agreement.id === id);

  if (demoAgreement) {
    return demoAgreement;
  }

  const agreements = await getAgreements();
  return agreements.find((agreement) => agreement.id === id) || null;
}

export async function getPendingApprovals() {
  return demoAgreements.flatMap((agreement) =>
    agreement.approvalSteps
      .filter((step) => step.status === "PENDING")
      .map((step) => ({
        agreementId: agreement.id,
        agreementTitle: agreement.title,
        counterparty: agreement.counterparty,
        step
      }))
  );
}

export async function getPendingSignatures() {
  return demoAgreements.flatMap((agreement) =>
    agreement.signatures
      .filter((signature) => signature.status === "PENDING" || signature.status === "SENT")
      .map((signature) => ({
        agreementId: agreement.id,
        agreementTitle: agreement.title,
        counterparty: agreement.counterparty,
        signature
      }))
  );
}

export async function getSearchResults(query: string): Promise<SearchResultView[]> {
  if (!query) {
    return demoSearchResults;
  }

  const lower = query.toLowerCase();
  const matches = demoAgreements.flatMap((agreement) => {
    const agreementMatches = agreement.title.toLowerCase().includes(lower)
      ? [
          {
            id: agreement.id,
            title: agreement.title,
            kind: "Agreement" as const,
            status: sentenceCase(agreement.status),
            matchSummary: agreement.summary
          }
        ]
      : [];

    const clauseMatches = agreement.clauses
      .filter(
        (clause) =>
          clause.heading.toLowerCase().includes(lower) ||
          clause.body.toLowerCase().includes(lower)
      )
      .map((clause) => ({
        id: clause.id,
        title: clause.heading,
        kind: "Clause" as const,
        status: `${clause.riskLevel} risk`,
        sourceAnchor: clause.sourceAnchor,
        matchSummary: clause.body
      }));

    return [...agreementMatches, ...clauseMatches];
  });

  return matches.length > 0 ? matches : demoSearchResults;
}

export async function getCurrentWorkspaceUsers(user: SessionUser | null) {
  if (!user && !allowDemoFallback()) {
    return [];
  }

  return demoUsers;
}
