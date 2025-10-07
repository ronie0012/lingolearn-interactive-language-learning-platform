`
# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

Project overview
- Framework: Next.js (App Router) with TypeScript
- Styling: Tailwind CSS 4 + PostCSS
- Auth: better-auth with Drizzle adapter
- Database: Turso (libSQL) via Drizzle ORM
- Build: Turbopack in dev, standard Next build for prod
- Aliases: TypeScript path alias @/* -> ./src/*

Common commands
- Install dependencies (prefer npm due to package-lock.json):
```bash path=null start=null
npm ci
```

- Start development server (Turbopack):
```bash path=null start=null
npm run dev
```
Serves http://localhost:3000. Hot reload is enabled.

- Lint the project:
```bash path=null start=null
npm run lint
```

- Build for production:
```bash path=null start=null
npm run build
```

- Start production server (after build):
```bash path=null start=null
npm run start
```

Database and migrations (Drizzle + Turso)
- Configuration: drizzle.config.ts points to src/db/schema.ts, outputs SQL migrations to ./drizzle, dialect=turso.
- Required environment variables (used by Drizzle/Turso and Next):
  - TURSO_CONNECTION_URL
  - TURSO_AUTH_TOKEN
  - NEXT_PUBLIC_SITE_URL

- Generate migrations from the schema (writes SQL to ./drizzle):
```bash path=null start=null
npx drizzle-kit generate
```
- Apply migrations to your Turso/libSQL database using your standard workflow for drizzle-kit and your environment. Inspect generated SQL under drizzle/ before applying.

High-level architecture
- App routing (src/app)
  - Next.js App Router structure with route groups for: api, chatbot, community, courses, dashboard, learn, login, profile, signup.
  - layout.tsx and global styling (globals.css) define shared UI chrome.
  - global-error.tsx pairs with src/components/ErrorReporter.tsx to surface and forward errors (particularly when embedded in an iframe) via postMessage.

- Middleware-based route protection
  - middleware.ts enforces authenticated access to these routes: /dashboard, /profile, /courses, /chatbot.
  - It retrieves the session via auth.api.getSession and redirects unauthenticated users to /sign-in.

- Authentication
  - Server: src/lib/auth.ts configures better-auth with a drizzle adapter bound to the project’s Drizzle db instance and schema. Email+password is enabled with minimum length validation and trusted origins include localhost and NEXT_PUBLIC_SITE_URL.
  - Client: src/lib/auth-client.ts wraps better-auth/react. A Bearer token is persisted in localStorage (bearer_token). The exported useSession hook wraps getSession to provide { data, isPending, error, refetch } in client components.
  - Navigation (src/components/Navigation.tsx) reads session state, shows user menu, and invokes authClient.signOut, clearing bearer_token and refreshing routing state.

- Data layer
  - Connection: src/db/index.ts constructs a libsql client from TURSO_CONNECTION_URL + TURSO_AUTH_TOKEN and exports a Drizzle instance bound to the schema.
  - Schema: src/db/schema.ts defines both auth tables (user, session, account, verification) and domain tables (user_progress, quiz_results, learned_vocabulary) for the language learning features.
  - Migrations: SQL files live in drizzle/ (auto-generated via drizzle-kit). Additional seed data lives under src/db/seeds/ (user, user_progress, quiz_results, learned_vocabulary) for local/test data population; seeding is not wired to an npm script.

- UI and styling
  - Components under src/components with a shadcn/radix-style UI set in src/components/ui.
  - Tailwind v4 setup via @tailwindcss/postcss and postcss.config.mjs; global styles in src/app/globals.css.

- Build and config
  - next.config.ts: allows remote images over http(s) and sets a custom Turbopack loader (src/visual-edits/component-tagger-loader.js) for JSX/TSX to support visual edit instrumentation. outputFileTracingRoot is configured for monorepo-style setups.
  - eslint.config.mjs: Next.js flat config with import rules enabled; several common rules are disabled to favor rapid iteration.
  - tsconfig.json: strict mode, bundler moduleResolution, path alias @/* to ./src/*.

Notes from README
- You can also use yarn, pnpm, or bun for dev (the template mentions these), but this repo includes package-lock.json, so npm is preferred.
- Development server runs at http://localhost:3000 and hot reloads when editing src/app/page.tsx.

Testing
- No test runner or npm test script is configured in package.json. If you add one (e.g., Vitest or Jest), document single-test run commands here.
