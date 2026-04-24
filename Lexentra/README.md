# Lexentra

Lexentra is a full-stack agreement operations platform for high-stakes enterprise contracts. It combines agreement lifecycle management, policy-driven review, local AI analysis, approval routing, signature readiness, reporting, and audit logging in one serious workspace.

## What is included

- Next.js + TypeScript frontend and API routes
- Tailwind-based enterprise UI
- Prisma schema for multi-tenant agreement infrastructure
- Seeded demo organization, users, agreements, templates, playbooks, and audit logs
- Local AI integration through an Ollama-compatible endpoint
- Local file storage abstraction and document parsing pipeline
- Database-backed job queue with worker process for indexing
- Docker and Docker Compose setup for local deployment

## Core product surfaces

- Landing page
- Login and organization creation
- Dashboard
- Agreements list and agreement details
- Agreement creation
- Template library
- Playbook management
- Review center
- Version comparison
- Approval queue
- Signature queue
- Search
- Reports and analytics
- Admin settings
- User management
- Audit log

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Recommended:

- Set `SESSION_SECRET` to a long random value.
- Keep `ENABLE_DEMO_FALLBACK=true` for quick UI access during early setup.
- Point `LOCAL_LLM_BASE_URL` at your self-hosted inference endpoint.

### 3. Start PostgreSQL

Use your local PostgreSQL instance or Docker Compose.

### 4. Prepare the database

```bash
npm run setup
```

This generates the Prisma client, pushes the schema, and seeds a realistic enterprise workspace.

### 5. Start the app

Terminal 1:

```bash
npm run dev:web
```

Terminal 2:

```bash
npm run dev:worker
```

### 6. Demo login

```text
maya.chen@northbridge.example / Demo@12345
```

## Local AI setup

Lexentra does not depend on paid hosted LLM APIs.

You should run a local model server compatible with the Ollama API surface. Configure:

- `LOCAL_LLM_BASE_URL`
- `LOCAL_LLM_CHAT_MODEL`
- `LOCAL_LLM_EMBED_MODEL`

AI routes that are wired today:

- `POST /api/ai/review`
- `POST /api/ai/ask`

Document indexing uses the worker and will generate embeddings when the local model is available.

## Docker workflow

```bash
docker compose up --build
```

Services:

- `postgres`
- `ollama`
- `app`
- `worker`

After the Ollama container is running, load your preferred local instruct model and embedding model inside that environment before relying on AI endpoints.

## Notes on functionality

- The UI is seeded with realistic enterprise demo data so the platform reads well immediately.
- New agreement creation, authentication, uploads, document records, and job processing are database-backed.
- AI routes are real and only return results when a local model service is available.
- Demo fallback mode is convenient for local previewing but should be disabled in production.

## Recommended next steps

1. Install dependencies and run `npm run setup`.
2. Start your local model service and set the model environment variables.
3. Launch the web app and worker.
4. Swap the local storage adapter and signature module for production integrations as needed.

## Architecture

See `docs/ARCHITECTURE.md` for the system overview.
