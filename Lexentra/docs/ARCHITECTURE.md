# Lexentra Architecture

## Purpose

Lexentra is a multi-tenant agreement infrastructure platform for organizations that need disciplined contract review, approval controls, local AI analysis, and audit-grade visibility.

## Application shape

- Frontend and API: Next.js App Router with route handlers
- Styling: Tailwind CSS with a custom enterprise design system
- Database: PostgreSQL via Prisma
- Auth: secure email/password with hashed passwords and signed cookie sessions
- Storage: local filesystem abstraction under `uploads/`, replaceable with S3 later
- AI layer: self-hosted local inference through an Ollama-compatible endpoint
- Retrieval: locally stored chunks and embeddings, ranked inside the app today and ready for pgvector migration later
- Jobs: database-backed queue with a polling worker for parsing and indexing

## Tenant model

- `Organization` is the top-level isolation boundary.
- `Workspace` scopes operational content within an organization.
- Agreements, templates, playbooks, audit logs, and notifications all carry organization-level ownership.
- Every API path is designed to derive organization context from the authenticated user session.

## Agreement lifecycle

1. A user creates or uploads an agreement.
2. Source files are stored locally and text is extracted.
3. The document is sectioned, chunked, and queued for indexing.
4. The worker generates embeddings through the local AI endpoint when available.
5. Reviewers compare clauses against playbooks and generate structured findings.
6. Approval steps and signature requests move the agreement forward.
7. Audit logs capture all meaningful actions.

## Local AI stack

- `src/lib/ai/ollama.ts` wraps local generation and embedding calls.
- `src/lib/ai/review.ts` builds structured prompts for review and Q&A.
- `src/lib/documents/parser.ts` handles extraction, sectioning, chunking, and rule-based fact capture.
- `src/lib/vector/search.ts` provides local ranking and cosine similarity utilities.
- If the local model is unavailable, AI routes return explicit errors instead of fake responses.

## Extensibility

- Replace local file storage with S3 by swapping `src/lib/storage/local.ts`.
- Replace the local embedding persistence strategy with pgvector or a dedicated vector store later.
- Replace simulated signature progression with DocuSign or Dropbox Sign integrations by extending `SignatureRequest`.
- Expand the worker to handle OCR, richer clause normalization, and additional ingestion pipelines.
