# NTC-OJT Application

This repository contains the NTC OJT application: a Next.js frontend and a NestJS backend for managing OJT applications, scheduling, and administration.

## Contents

- [Frontend (Next.js)](frontend)
- [Backend (NestJS)](backend)
- [Docs](docs)

## Overview

The system provides a public-facing portal for applicants to submit and track applications, and a private/admin interface for staff to review, manage, and schedule applicants. The frontend is built with Next.js and TypeScript; the backend is built with NestJS and TypeScript.

## Quick start

Prerequisites

- Node.js (LTS)
- Git

Setup (root)

```bash
git clone <repo-url>
cd NTC-OJT

# Frontend
cd frontend
npm install
npm run dev

# In a separate terminal: Backend
cd ../backend
npm install
npm run start:dev
```

Frontend runs at `http://localhost:3000` and backend typically at `http://localhost:3001` (see `PORT` env var in backend).

## Frontend

Public pages include:

- Home / Landing — hero, features, CTAs
- Submit Application — multi-step form with file uploads, validation, and privacy consent
- Track Application — lookup by Application ID + email
- Login — for staff/admins

Private (authenticated) pages include:

- Dashboard — analytics, quick actions
- Applications — listing, filters, export (.xlsx), view/edit/delete
- Calendar — schedule interviews/orientations
- OJT Data — verified interns
- Accounts — manage admin/employee accounts

Tech notes

- Built with Next.js + TypeScript
- Uses client-side routing, contexts, and hooks in `frontend/src`

See full frontend docs: [docs/frontend/FRONTENDPublic.md](docs/frontend/FRONTENDPublic.md) and [docs/frontend/FRONTENDPrivate.md](docs/frontend/FRONTENDPrivate.md).

## Backend

The backend is a NestJS application providing REST endpoints for the frontend and integrations for storage, mailer, and database.

Tech stack

- Node.js (LTS), NestJS, TypeScript
- Jest for tests (unit + e2e)
- Postgres (DATABASE_URL) and Supabase for storage

Repository layout (key folders)

- `src/controllers/` — HTTP controllers
- `src/modules/` — NestJS feature modules
- `src/services/` — business logic and external integrations
- `src/data/` — DTOs, guards, decorators, types

Getting started (backend)

```bash
cd backend
npm install
npm run start:dev
```

Environment variables (examples)

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgres://user:pass@localhost:5432/ntc_db
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=your-supabase-key
JWT_SECRET=supersecret
JWT_EXPIRES_IN=3600s
EMAIL_SERVICE_API_KEY=mailer-key
```

API overview

Controllers in `src/controllers/` include:

- `accounts.controller.ts` — account management
- `applications.controller.ts` — application submission & management
- `appointments.controller.ts` — appointment scheduling
- `auth.controller.ts` — authentication (login/refresh)
- `courses.controller.ts` — course listings
- `dashboard.controller.ts` — aggregated dashboard data
- `logs.controller.ts` — application logs
- `mailer.controller.ts` — mailer endpoints
- `ojt.controller.ts` — OJT-specific endpoints
- `schools.controller.ts` — school APIs

See detailed backend docs: [docs/backend/BACKEND.md](docs/backend/BACKEND.md).

## Testing

Run frontend tests and linters in their folders (if configured). Backend tests with Jest:

```bash
cd backend
npm run test
npm run test:e2e
npm run lint
```

## Deployment

General steps (backend):

1. Set production environment variables in your hosting platform.
2. Build: `npm run build` (run in `backend` to compile NestJS)
3. Start: `npm run start:prod` or `node dist/main.js`

Frontend can be deployed to Vercel or other static hosts. Use `npm run build` in `frontend` and follow your host's deployment instructions.

## Contributing

- Follow existing linting/formatting rules (ESLint + Prettier where configured).
- Add unit tests for new logic and update e2e tests if API changes.
- Update docs in `docs/` when you add or change major modules.

## Useful links

- Frontend docs: [docs/frontend/FRONTENDPublic.md](docs/frontend/FRONTENDPublic.md)
- Backend docs: [docs/backend/BACKEND.md](docs/backend/BACKEND.md)

---

Last updated: 2026-05-28
