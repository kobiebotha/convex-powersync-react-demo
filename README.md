# PowerSync + Convex Demo App

A React todo-list demo that syncs data between Convex and local SQLite via PowerSync. **No separate Node.js backend required** — auth and mutations are handled directly by Convex HTTP actions.

## Architecture

```
Browser (React + PowerSync SDK)
  ├── Auth tokens ──► Convex HTTP action  GET  /auth/token
  ├── Mutations   ──► Convex HTTP action  POST /powersync/batch ──► applyBatch mutation
  └── Sync        ◄── PowerSync Service  ◄── Convex streaming export
```

## Prerequisites

- Self-hosted Convex backend running (see `convex-self-host/`)
- PowerSync service running with Convex module configured
- JWT keys generated and set as Convex env vars (see `convex-self-host/README.md`)

## Setup

```bash
# Install dependencies
pnpm install

# Copy env template and edit
cp .env.template .env.local

# Start dev server
pnpm dev
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_CONVEX_SITE_URL` | `http://127.0.0.1:3211` | Convex HTTP actions URL |
| `VITE_POWERSYNC_URL` | `http://localhost:8080` | PowerSync service URL |

## Authentication

Anonymous authentication: a random user ID is generated and stored in localStorage. The Convex `/auth/token` HTTP action returns a signed JWT for that user. PowerSync verifies the token via the `/auth/keys` JWKS endpoint.

## Mutations

Client writes go into the PowerSync upload queue, which calls `uploadData()` in the connector. This POSTs the CRUD batch directly to the Convex `/powersync/batch` HTTP action, which internally runs the `applyBatch` mutation to write to Convex tables.
