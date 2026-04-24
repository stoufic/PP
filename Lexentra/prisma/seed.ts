import { hash } from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import {
  demoAgreements,
  demoAuditLogs,
  demoCredentials,
  demoOrganization,
  demoPlaybooks,
  demoTemplates,
  demoUsers
} from "../src/lib/fixtures";

async function resetDatabase() {
  await prisma.approvalDecision.deleteMany();
  await prisma.signatureRequest.deleteMany();
  await prisma.approvalStep.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.obligation.deleteMany();
  await prisma.aIReviewResult.deleteMany();
  await prisma.clause.deleteMany();
  await prisma.documentChunk.deleteMany();
  await prisma.document.deleteMany();
  await prisma.agreementVersion.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.job.deleteMany();
  await prisma.agreement.deleteMany();
  await prisma.template.deleteMany();
  await prisma.playbookRule.deleteMany();
  await prisma.playbook.deleteMany();
  await prisma.counterparty.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.organization.deleteMany();
}

async function main() {
  await resetDatabase();

  const organization = await prisma.organization.create({
    data: {
      id: demoOrganization.id,
      name: demoOrganization.name,
      slug: demoOrganization.slug
    }
  });

  const workspace = await prisma.workspace.create({
    data: {
      id: demoOrganization.workspaceId,
      organizationId: organization.id,
      name: demoOrganization.workspaceName
    }
  });

  const departmentNames = Array.from(
    new Set([
      ...demoUsers.map((user) => user.departmentName),
      ...demoAgreements.map((agreement) => agreement.department),
      "Operations"
    ])
  );

  const departmentByName = new Map<string, string>();
  for (const name of departmentNames) {
    const department = await prisma.department.create({
      data: {
        id: `dep_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
        organizationId: organization.id,
        name
      }
    });
    departmentByName.set(name, department.id);
  }

  const passwordHash = await hash(demoCredentials.password, 12);
  const userByName = new Map<string, string>();

  for (const user of demoUsers) {
    await prisma.user.create({
      data: {
        id: user.id,
        organizationId: organization.id,
        departmentId: departmentByName.get(user.departmentName),
        email: user.email,
        name: user.name,
        role: user.role,
        title: user.title,
        passwordHash
      }
    });
    userByName.set(user.name, user.id);
  }

  const counterparties = Array.from(
    new Set(demoAgreements.map((agreement) => agreement.counterparty))
  );
  const counterpartyByName = new Map<string, string>();

  for (const name of counterparties) {
    const counterparty = await prisma.counterparty.create({
      data: {
        id: `cp_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
        organizationId: organization.id,
        name
      }
    });
    counterpartyByName.set(name, counterparty.id);
  }

  for (const template of demoTemplates) {
    await prisma.template.create({
      data: {
        id: template.id,
        organizationId: organization.id,
        workspaceId: workspace.id,
        name: template.name,
        agreementType: template.agreementType,
        description: template.description,
        defaultMetadata: template.defaultMetadata,
        clauseBlocks: {
          title: template.name,
          category: template.agreementType
        },
        workflowDefaults: template.workflowDefaults
      }
    });
  }

  for (const playbook of demoPlaybooks) {
    await prisma.playbook.create({
      data: {
        id: playbook.id,
        organizationId: organization.id,
        workspaceId: workspace.id,
        name: playbook.name,
        description: playbook.description,
        rules: {
          create: playbook.rules.map((rule) => ({
            id: rule.id,
            category: rule.category,
            preferredText: rule.preferredText,
            fallbackText: rule.fallbackText,
            unacceptable: rule.unacceptable,
            approvalPath: rule.approvalPath,
            riskCategory: rule.riskCategory,
            required: rule.required
          }))
        }
      }
    });
  }

  for (const agreement of demoAgreements) {
    const latestVersion = agreement.versions[agreement.versions.length - 1];
    await prisma.agreement.create({
      data: {
        id: agreement.id,
        organizationId: organization.id,
        workspaceId: workspace.id,
        departmentId: departmentByName.get(agreement.department),
        counterpartyId: counterpartyByName.get(agreement.counterparty),
        ownerId: userByName.get(agreement.owner)!,
        title: agreement.title,
        agreementType: agreement.agreementType,
        status: agreement.status,
        summary: agreement.summary,
        riskLevel: agreement.riskLevel,
        effectiveDate: agreement.effectiveDate ? new Date(agreement.effectiveDate) : undefined,
        expirationDate: agreement.expirationDate ? new Date(agreement.expirationDate) : undefined,
        renewalTerms: agreement.renewalTerms,
        tags: agreement.tags,
        metadata: {
          agreementNumber: agreement.agreementNumber,
          aiExtractionStatus: agreement.aiExtractionStatus,
          complianceStatus: agreement.complianceStatus
        },
        versions: {
          create: agreement.versions.map((version) => ({
            id: version.id,
            versionNumber: version.versionNumber,
            title: `${agreement.title} v${version.versionNumber}`,
            uploadedById: userByName.get(version.uploadedBy)!,
            content: version.content,
            summary: version.summary,
            createdAt: new Date(version.createdAt)
          }))
        },
        clauses: {
          create: agreement.clauses.map((clause) => ({
            id: clause.id,
            organizationId: organization.id,
            versionId: latestVersion?.id,
            heading: clause.heading,
            body: clause.body,
            category: clause.category,
            riskLevel: clause.riskLevel,
            sourceAnchor: clause.sourceAnchor,
            confidence: clause.confidence
          }))
        },
        comments: {
          create: agreement.comments.map((comment) => ({
            id: comment.id,
            organizationId: organization.id,
            authorId: userByName.get(comment.author)!,
            sectionAnchor: comment.sectionAnchor,
            body: comment.body,
            mentions: comment.mentions,
            resolved: comment.resolved,
            createdAt: new Date(comment.createdAt)
          }))
        },
        approvalSteps: {
          create: agreement.approvalSteps.map((step) => ({
            id: step.id,
            organizationId: organization.id,
            assigneeId: userByName.get(step.assignee)!,
            stageOrder: step.stageOrder,
            status: step.status,
            dueAt: step.dueAt ? new Date(step.dueAt) : undefined,
            completedAt: step.completedAt ? new Date(step.completedAt) : undefined,
            decisions:
              step.status === "PENDING"
                ? undefined
                : {
                    create: {
                      organizationId: organization.id,
                      userId: userByName.get(step.assignee)!,
                      status: step.status,
                      note: step.note
                    }
                  }
          }))
        },
        signatures: {
          create: agreement.signatures.map((signature) => ({
            id: signature.id,
            organizationId: organization.id,
            signerId: userByName.get(signature.signer)!,
            orderIndex: signature.orderIndex,
            status: signature.status,
            requestedAt: signature.requestedAt ? new Date(signature.requestedAt) : undefined,
            completedAt: signature.completedAt ? new Date(signature.completedAt) : undefined
          }))
        },
        obligations: {
          create: agreement.obligations.map((obligation) => ({
            id: obligation.id,
            organizationId: organization.id,
            party: obligation.party,
            obligation: obligation.obligation,
            dueDate: obligation.dueDate ? new Date(obligation.dueDate) : undefined,
            sourceAnchor: obligation.sourceAnchor,
            status: obligation.status
          }))
        },
        aiReviews: {
          create: agreement.aiReviews.map((review) => ({
            id: review.id,
            organizationId: organization.id,
            playbookId: demoPlaybooks.find((item) => item.name === review.playbookName)?.id,
            status: "completed",
            summary: review.summary,
            findings: review.findings,
            confidence: review.confidence,
            createdAt: new Date(review.createdAt)
          }))
        },
        auditLogs: {
          create: agreement.timeline.map((item) => ({
            organizationId: organization.id,
            actorEmail:
              demoUsers.find((user) => user.name === item.actor)?.email || "system@lexentra.local",
            action: item.title.toUpperCase().replace(/[^A-Z0-9]+/g, "_"),
            entityType: "Agreement",
            entityId: agreement.id,
            metadata: {
              detail: item.detail
            },
            createdAt: new Date(item.createdAt)
          }))
        }
      }
    });
  }

  for (const log of demoAuditLogs) {
    const linkedAgreement = demoAgreements.find((agreement) =>
      log.detail.toLowerCase().includes(agreement.counterparty.toLowerCase()) ||
      log.entityId === agreement.agreementNumber
    );

    await prisma.auditLog.create({
      data: {
        id: log.id,
        organizationId: organization.id,
        agreementId: linkedAgreement?.id,
        actorEmail: log.actorEmail,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        metadata: {
          detail: log.detail
        },
        createdAt: new Date(log.createdAt)
      }
    });
  }

  for (const user of demoUsers) {
    await prisma.notification.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        title: "Workspace seeded",
        body: "Lexentra demo workspace data is ready for review."
      }
    });
  }

  console.log("Seed complete.");
  console.log(`Demo login: ${demoCredentials.email} / ${demoCredentials.password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
