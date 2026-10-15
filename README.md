# Codebalt

A fresh Bun + Turborepo workspace with a Vite React frontend and Go API.

## Start

Prerequisites: Bun **1.4.0+**, Node.js **24.20.0+**, and Go **1.27.0+**. The lockfile was generated with Bun 1.4.0; use that version for reproducible installs.

```sh
bun install --frozen-lockfile
bun run dev
```

- Frontend: http://localhost:5173
- API health: http://127.0.0.1:8080/api/health
- Playground: http://localhost:5173/playground

No environment files are required. Both services start together. The frontend's counter demonstrates Zustand state shared between routes. The API card makes a real request to the Go server.

## Workspace

```text
apps/
  frontend/                   Vite, React, React Router, Zustand, TypeScript
  api/
    cmd/server/               Go server entrypoint
    internal/httpapi/          HTTP routes
    go.mod                    Independent Go module (standard library only)
packages/
  ui/                         Shared Button, Card, and CSS
  typescript-config/          Shared strict TypeScript configurations
```

The UI package exports source TypeScript. Vite compiles it and supports hot updates directly; no separate library build or watcher is needed. React is a peer dependency of the UI package, and Vite deduplicates React imports.

The Go workspace has a small package.json so Turborepo can orchestrate native Go commands. Go retains its own module and build cache.

## Commands

| Command              | Purpose                                       |
| -------------------- | --------------------------------------------- |
| bun run dev          | Start frontend and API                        |
| bun run dev:frontend | Start frontend with its companion API         |
| bun run dev:api      | Start only the API                            |
| bun run build        | Type-check the frontend and build both apps   |
| bun run check-types  | Check frontend and UI TypeScript              |
| bun run lint         | Oxlint for TypeScript/React and go vet for Go |
| bun run lint:fix     | Apply available Oxlint fixes                  |
| bun run check        | Run lint, type checks, and builds             |
| bun run format       | Format JS/TS/JSON/CSS/docs and Go             |
| bun run format:check | Verify formatting                             |

Frontend and UI changes reload automatically. The API uses go run; restart the development command after Go changes.

## Configuration

Optional examples live next to each app. Copy an example to .env.local in that app if needed.

- apps/api: API_ADDR defaults to 127.0.0.1:8080. Set 0.0.0.0:8080 explicitly for container access. Bun loads the app's environment file when running its scripts; direct Go commands require exported environment variables.
- apps/frontend: API_PROXY_TARGET defaults to http://127.0.0.1:8080. Update it if you change the API address.
- The frontend requests /api/health through Vite's development proxy. Backend addresses are not bundled into client code.

The API has bounded HTTP timeouts and handles SIGINT/SIGTERM with graceful shutdown. It returns JSON health data, rejects unsupported methods, and returns 404 for unknown routes.

Oxlint enables TypeScript, React hooks, and accessibility checks; warnings fail lint. Type checking remains a separate compiler step.

## Build and deployment

```sh
bun run build
# API binary:
bun run --filter @repo/api start
# Inspect the frontend production bundle locally:
bun run --filter @repo/frontend preview
```

Build outputs are apps/frontend/dist and apps/api/dist/server. Serve the frontend with a static web server that falls back to index.html for client routes such as /playground. Configure that server or your reverse proxy to forward /api/* to Go. Vite's development proxy is development-only; preview does not configure a production API proxy.

Turborepo caches frontend builds and checks. Native Go tasks bypass Turbo caching so binaries and checks cannot be reused across incompatible Go toolchains or platforms; Go's own cache still applies. Environment files participate in frontend build hashes, and API_ADDR/API_PROXY_TARGET pass through Turbo's strict development environment.

## How this was scaffolded

Verified against the current CLI help and official documentation:

```sh
bunx create-turbo@latest codebalt --package-manager bun --skip-install --no-git
cd codebalt
bun create vite apps/frontend --template react-ts --no-interactive --no-immediate
cd apps/frontend
bun add react-router zustand
cd ../..
bun add -d oxlint
cd apps/api
go mod init codebalt.local/api
```

create-turbo generates default Next.js apps and ESLint packages. Those were replaced with the Vite frontend, Go API, shared UI, and Oxlint configuration in this workspace. The current React Vite template itself also defaults to Oxlint. --no-git prevents the generator from initializing a repository or making a scaffold commit.

See [the setup research](docs/setup-research.md) for source links, exact versions, and decisions. No Git commits were made during this reset.
