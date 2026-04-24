import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const signupSchema = z.object({
  organizationName: z.string().min(2),
  workspaceName: z.string().min(2),
  departmentName: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(10)
});

export const createAgreementSchema = z.object({
  title: z.string().min(5),
  agreementType: z.string().min(2),
  counterparty: z.string().min(2),
  department: z.string().min(2),
  status: z.enum([
    "DRAFT",
    "IN_REVIEW",
    "NEEDS_CHANGES",
    "APPROVED",
    "AWAITING_SIGNATURE",
    "EXECUTED",
    "EXPIRED",
    "ARCHIVED"
  ]),
  effectiveDate: z.string().optional(),
  expirationDate: z.string().optional(),
  renewalTerms: z.string().optional(),
  tags: z.array(z.string()).default([])
});

export const aiReviewSchema = z.object({
  agreementId: z.string().min(2),
  playbookId: z.string().min(2)
});

export const askAgreementSchema = z.object({
  agreementId: z.string().min(2),
  question: z.string().min(5)
});
