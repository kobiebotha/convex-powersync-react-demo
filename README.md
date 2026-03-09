# PowerSync + Convex Demo App

A React todo-list demo that syncs data between Convex and local SQLite via PowerSync. **No separate Node.js backend required** — auth is handled by Convex Auth and mutations are called directly via the Convex client.

## Architecture

```
Browser (React + PowerSync SDK)
  ├── Auth tokens ──► Convex Auth (JWT issued by Convex)
  ├── Mutations   ──► Convex client mutations (lists:create, todos:update, etc.)
  └── Sync        ◄── PowerSync Service  ◄── Convex streaming export
```

## Prerequisites

- Self-hosted Convex backend running (see `convex-self-host/`)
- PowerSync service running with Convex module configured
- PowerSync JWKS configured to use Convex Auth's `/.well-known/jwks.json` endpoint

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
| `VITE_CONVEX_URL` | `http://127.0.0.1:3210` | Convex backend URL |
| `VITE_POWERSYNC_URL` | `http://localhost:8080` | PowerSync service URL |

## Authentication

Convex Auth handles user authentication (email/password). The Convex Auth session JWT is reused directly for PowerSync authentication. PowerSync verifies the token via Convex Auth's built-in JWKS endpoint at `/.well-known/jwks.json`.

## Mutations

Client writes go into the PowerSync upload queue, which calls `uploadData()` in the connector. This calls Convex mutations directly via the `ConvexReactClient` (e.g. `lists:create`, `todos:update`, `todos:remove`).
