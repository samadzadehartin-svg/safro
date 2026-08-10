# Vercel deployment

This package includes `build:vercel` scripts intentionally:

- Frontend root: `npm run build:vercel` -> `next build`
- Backend `server/`: `npm run build:vercel` -> `nest build`

So an existing Vercel Build Command set to `npm run build:vercel` will no longer fail with “Missing script”.

# Deploy Safro on Vercel

This repository contains two deployable apps.

## 1) Backend — NestJS

Create a Vercel Project from this repository and set **Root Directory** to:

```text
server
```

Use Node.js `22.x`. Vercel supports NestJS as a backend framework with Vercel Functions.

After deployment, test:

```text
https://YOUR-API.vercel.app/api/health
```

Set backend environment variable `CORS_ORIGIN` to the frontend URL after the frontend is deployed.

## 2) Frontend — Next.js

Create a second Vercel Project from the same repository with **Root Directory** left as the repository root.

Set environment variable:

```text
API_INTERNAL_URL=https://YOUR-API.vercel.app
```

Then deploy/redeploy the frontend.

## Important about data persistence

The current development store is JSON-file based. On Vercel, writes use `/tmp` so the API can run, but those writes are not durable across function instances/deployments. For production CRUD/orders, replace the JSON store with PostgreSQL/Supabase/Neon or another durable database.
