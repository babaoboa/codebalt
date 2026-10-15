# Setup research

Researched October 14, 2026. CLI flags were verified by running the current generators' --help output. Package versions were resolved from the npm registry's latest stable tags and pinned in manifests, then locked with Bun.

## Commands and primary sources

| Area            | Verified command / guidance                                                                                     | Source                                                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Turborepo       | bunx create-turbo@latest; --package-manager bun, --skip-install, and --no-git are supported by the current CLI. | [create-turbo reference](https://turborepo.dev/docs/reference/create-turbo) and live CLI help                                                                                              |
| Vite            | bun create vite apps/frontend --template react-ts --no-interactive --no-immediate                               | [Vite guide](https://vite.dev/guide/) and live CLI help                                                                                                                                    |
| React Router    | Install react-router; BrowserRouter, Routes, Route, NavLink, and Link are exported from it.                     | [Declarative installation](https://reactrouter.com/start/declarative/installation)                                                                                                         |
| Zustand         | bun add zustand; typed create<State>() store with narrow selectors.                                             | [Zustand docs](https://zustand.docs.pmnd.rs/) and [TypeScript guide](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript)                                                        |
| Oxlint          | bun add -d oxlint; configuration in .oxlintrc.json; explicit React and accessibility plugins.                   | [Quickstart](https://oxc.rs/docs/guide/usage/linter/quickstart), [configuration](https://oxc.rs/docs/guide/usage/linter/config), [plugins](https://oxc.rs/docs/guide/usage/linter/plugins) |
| Bun workspaces  | apps/* and packages/* workspaces; internal packages linked with workspace:*.                                    | [Bun workspaces](https://bun.sh/docs/pm/workspaces)                                                                                                                                        |
| Go structure    | Commands under cmd, private server code under internal, one independent module.                                 | [Organizing a Go module](https://go.dev/doc/modules/layout)                                                                                                                                |
| Go server       | Explicit timeouts, method-aware ServeMux routes, and Server.Shutdown.                                           | [net/http](https://pkg.go.dev/net/http)                                                                                                                                                    |
| Development API | Same-origin /api proxy to the Go server, configured server-side with loadEnv.                                   | [Vite server proxy](https://vite.dev/config/server-options#server-proxy), [environment handling](https://vite.dev/guide/env-and-mode)                                                      |

Repository instructions required reading the installed turbo package documentation. Read docs/README.md first, followed by configuring-tasks, using-environment-variables, creating-an-internal-package, internal-packages, and create-turbo. These matched installed Turbo 2.11.8.

## Decisions

- Declarative React Router fits this browser app with a separate Go API. Server rendering and an additional Node application server are unnecessary here.
- Zustand holds client state, with property-specific selectors. API request state stays local to the API card, with cancellation on unmount and runtime response validation.
- The UI package uses Turborepo's documented source-export strategy: Vite transpiles the package, CSS stays an explicit export, and React is a peer dependency.
- Builds depend on type checks. Dependency-aware checks invalidate when shared UI types change. Persistent development tasks are uncached; the frontend's companion task starts Go even when filtered.
- Go tasks use the native Go cache rather than Turbo's file-output cache, avoiding host/toolchain-dependent cache artifacts.
- The backend uses the standard library so a new workspace needs no router framework, database, code generator, or backend JavaScript dependencies.
- Production hosting must provide both SPA fallback and /api forwarding. Vite's development proxy is not a deployment configuration.
- The reset preserves the existing Git history and AGENTS.md. The generators ran without Git initialization, and the previous workspace files were moved into a sibling backup directory.

## Installed versions

| Package              | Version |
| -------------------- | ------- |
| turbo                | 2.11.8  |
| oxlint               | 1.88.0  |
| prettier             | 3.9.10  |
| typescript           | 7.0.2   |
| react                | 19.3.1  |
| react-dom            | 19.3.1  |
| react-router         | 8.4.0   |
| zustand              | 5.0.15  |
| @types/react         | 19.3.0  |
| @types/react-dom     | 19.3.0  |
| @types/node          | 26.6.5  |
| vite                 | 8.3.4   |
| @vitejs/plugin-react | 6.1.2   |

Go module language version: 1.27.0. Bun used for installation: 1.4.0. The retained bun.lock and exact package versions record the verified installation.

## Community research

Two DevRelay semantic searches were attempted: Bun/Turborepo/Vite workspace pitfalls and Zustand selector/re-render pitfalls. Both returned an MLH authentication requirement. No community claims or citations were inferred; implementation decisions rely on the primary sources above.
