**NTC-APPLICATION BACKEND**

## 1. Introduction

This document describes the backend for the NTC OJT application: its architecture, developer setup, runtime operations, environment variables, testing, and deployment notes. The backend is implemented with NestJS and TypeScript and follows a modular structure split into controllers, modules, and services.

## 2. Tech stack

- Runtime: Node.js (LTS)
- Framework: NestJS (TypeScript)
- Language: TypeScript
- Testing: Jest (unit + e2e)
- Storage: Supabase / Postgres (project contains a Supabase storage service)
- Packaging & tooling: npm / pnpm / yarn, TypeScript, ESLint

## 3. Repository layout (key folders)

- `src/` — application source code
  - `controllers/` — HTTP controllers (API endpoints)
  - `modules/` — NestJS feature modules
  - `services/` — business logic and integrations
  - `data/` — DTOs, types, guards, strategies, and decorators
  - `interceptors/` — global and route-level interceptors
  - `main.ts` — application bootstrap
- `test/` — end-to-end tests
- `docs/` — documentation (this file)

## 4. Getting started (developer setup)

Prerequisites

- Node.js (LTS) installed
- Git
- Access to project environment variables (see section below)

Install

1. Clone the repository and change to the `backend` folder:

```bash
git clone <repo-url>
cd NTC-OJT/backend
```

2. Install dependencies (choose your package manager):

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Build (optional) and run in development:

```bash
npm run start:dev
```

4. Run tests:

```bash
npm run test
npm run test:e2e
```

## 5. Environment variables

The project uses environment variables to configure database connections, authentication, and third-party services. Typical variables (names may vary by deployment) include:

- `NODE_ENV` — `development` | `production`
- `PORT` — HTTP server port
- `DATABASE_URL` — Postgres connection string
- `SUPABASE_URL` — Supabase project URL (if used)
- `SUPABASE_KEY` — Supabase service key
- `JWT_SECRET` — secret used for signing JWTs
- `JWT_EXPIRES_IN` — token lifetime
- `EMAIL_SERVICE_API_KEY` — mailer provider key

Store secrets securely (e.g., CI secrets, cloud environment variables) and do not commit `.env` files to source control.

## 6. Architecture overview

The application follows NestJS best practices:

- Feature modules encapsulate related controllers, providers, and services.
- Controllers handle HTTP requests and delegate to services for business logic.
- Services implement core application logic and external integrations (database, storage, mailer).
- Guards, interceptors, and decorators provide cross-cutting concerns (authentication, request context, roles).

Key patterns used:

- Dependency injection via NestJS providers
- DTOs and validation pipes for input validation
- Guards for route authorization (role-based access using a `roles.decorator`)

## 7. Database & storage

The backend includes a database module (Postgres is expected) and a `supabase-storage.service` for storing files. Follow existing module configuration in `src/modules/database.module.ts` and `src/services/supabase-storage.service.ts` for connecting to your database and storage provider.

If you use Supabase locally, provide `SUPABASE_URL` and `SUPABASE_KEY` in your environment before running the app.

## 8. Authentication & authorization

Authentication is implemented with JWTs. Routes that require authentication use guards — check `src/data/guards` and `src/controllers/auth.controller.ts`. Role-based access control is implemented via decorators (see `src/data/decorators/roles.decorator.ts`).

## 9. API overview

Controllers are located in `src/controllers/`. The repository includes controllers for common domains:

- `accounts.controller.ts` — account management
- `applications.controller.ts` — application submission & management
- `appointments.controller.ts` — appointments scheduling
- `auth.controller.ts` — authentication endpoints (login, refresh)
- `courses.controller.ts` — course listings
- `dashboard.controller.ts` — aggregated dashboard data
- `logs.controller.ts` — application logs and audit trails
- `mailer.controller.ts` — mailer hooks and testing endpoints
- `ojt.controller.ts` — OJT-specific endpoints
- `schools.controller.ts` — school-related APIs

For each controller, consult the source for available routes and payload shapes. Prefer using the project DTOs defined under `src/data/dto/` for request/response formats.

## 10. Testing

Unit tests and e2e tests use Jest. Key scripts (see `package.json`) typically include:

- `npm run test` — runs unit tests
- `npm run test:e2e` — runs end-to-end tests
- `npm run lint` — run ESLint

E2E tests require a running instance of the backend and configured environment variables for the test database. Consider using a separate test database or a database container for CI.

## 11. Deployment

Common deployment steps:

1. Ensure production environment variables are set (database, JWT secret, third-party keys).
2. Build the project: `npm run build`.
3. Start the compiled app: `npm run start:prod` or run `node dist/main.js`.

Containers and cloud platforms should supply secrets via their environment/secret management.

## 12. Troubleshooting

- Port in use: verify `PORT` and stop other services.
- Database connection errors: confirm `DATABASE_URL` and network access.
- Missing env keys: check startup logs for explicit messages and validate your `.env` or cloud environment settings.

## 13. Contributing

- Follow repository linting and formatting rules (ESLint + Prettier where configured).
- Add unit tests for new business logic and update e2e tests for API changes.
- Update this document when adding or changing major modules or external integrations.

## 14. References

- See source files under `src/modules/`, `src/controllers/`, and `src/services/` for implementation details.
- Use `test/` for examples of expected runtime behavior in e2e tests.

---

Last updated: 2026-05-28
