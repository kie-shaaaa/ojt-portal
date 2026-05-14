# Contributing to NTC OJT PORTAL

Thank you for your interest in contributing to OJT-Portal! We welcome improvements, bug reports, and new feature ideas.

## Project Overview

NTC OJT Portal is a platform designed to accomodate incoming OJT interns and manage interns at NTC. It allows OJT applications, account managements (RBAC), and Tracking of Applications

### Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) (TypeScript), [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
- **Frontend**: [React](https://react.dev/) (Vite), [Tailwind CSS](https://tailwindcss.com/), [NEXTJS](https://nextjs.org/)

## Project Structure

NTC OJT Portal is split into two main parts:

- `Backend/`: A NestJS application handling the API, database, and third-party services.
- `Frontend/`: A Vite + React application for the web interface.

## How to Contribute

- Discuss big changes or feature ideas by opening an issue first.
- For bug reports, please include:
  - Steps to reproduce the issue.
  - Expected vs. actual behavior.
  - Screenshots or logs if applicable.
- When you're ready to contribute code, open a Pull Request (PR) with a clear title and description.

## Development Setup

### Prerequisites

- **Node.js**: v18+ (v20+ recommended).
- **npm**: v9+ (Installed with Node.js).
- **PostgreSQL**: Local instance or access to a Supabase project.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file (copied from `.ENV` template if available). Key variables include:
   - `DATABASE_URL`: PostgreSQL connection string (Supabase).
   - `JWT_SECRET` : JWT Secret token
   - `PORT` : Port for the backend running
4. Start the development server:
   ```bash
   npm run backend
   ```
5. (Optional) Seed the database:
   ```bash
   npx ts-node scripts/seed-user.ts
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file:
   - `VITE_API_URL`: `http://localhost:3000`
4. Start the development server:
   ```bash
   npm run dev
   ```

## Branching & PR Guidelines

- Create a feature branch from `main`: `feature/short-description` or `fix/short-description`.
- Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification if possible.
- Ensure your changes follow the existing code style and pass linting.

## Code Quality

- **Backend**:
  - Format code: `npm run format`
  - Lint code: `npm run lint`
  - Run tests: `npm run test`
- **Frontend**:
  - Lint code: `npm run lint`

## Code of Conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md). Respectful, inclusive behavior is expected.

---

## Pull Request Checklist

Before opening a PR, please make sure your changes meet the checklist below:

- [ ] I have tested my changes locally.
- [ ] My code follows the project's code style.
- [ ] I have updated documentation if necessary.
- [ ] All new and existing tests pass.

Suggested PR description template:

```markdown
### Description

- What changed and why.

### How to test

- Steps to verify the changes.

### Screenshots (if applicable)

- Add any relevant screenshots for frontend changes.
```