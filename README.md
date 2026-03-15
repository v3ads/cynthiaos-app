# cynthiaos-app

CynthiaOS App — the staff-facing property management operating system. A Next.js 14 application (App Router) that consumes the `cynthiaos-api` backend-for-frontend. Mobile-first layout.

> **Status:** Scaffold only (TASK-011). Module implementations are not yet built.

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
```

Home page: `http://localhost:3000`  
Health check: `GET http://localhost:3000/api/health`

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Run Next.js dev server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run typecheck` | Type-check without building |
| `npm run lint` | Lint with Next.js ESLint config |

## Docker

```bash
docker build -t cynthiaos-app .
docker run -p 3000:3000 --env-file .env cynthiaos-app
```

## Railway Deployment

- **Start command:** `node server.js` (Next.js standalone)
- **Build command:** `npm ci && npm run build`
- **Port:** Set `PORT` environment variable in Railway dashboard

## Environment Variables

See `.env.example` for all required variables.
