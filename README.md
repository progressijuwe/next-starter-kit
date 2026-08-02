# Next Starter Kit

A production-ready Next.js 16 starter for business sites, SaaS apps, dashboards
and marketing sites. Clone it and start building — the tooling, architecture and
design system are already decided.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page is a living
style guide showing every token and component; toggle the theme in the header to
check both palettes.

## Scripts

| Script                 | Does                       |
| ---------------------- | -------------------------- |
| `npm run dev`          | Dev server (Turbopack)     |
| `npm run build`        | Production build           |
| `npm start`            | Serve the production build |
| `npm run lint`         | ESLint                     |
| `npm run lint:fix`     | ESLint with `--fix`        |
| `npm run typecheck`    | `tsc --noEmit`             |
| `npm run format`       | Prettier write             |
| `npm run format:check` | Prettier check (for CI)    |

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Radix UI · CVA ·
Lucide · React Hook Form · Zod · TanStack Query · Axios · next-themes ·
ESLint · Prettier · Husky · lint-staged

## What's in the box

- **Design system** — semantic type scale, named spacing, one-knob radius, and
  light/dark palettes in `oklch`. No component hardcodes a colour.
- **11 UI primitives** — Button, Card, Badge, Input, Textarea, Spinner, Avatar,
  Alert, Modal, Tabs, Accordion. Radix underneath wherever focus or keyboard
  navigation is involved.
- **Typed API layer** — axios instance with interceptors that normalise every
  failure into a single `ApiError`, so nothing downstream touches an axios type.
- **Forms** — React Hook Form + Zod, including replaying server-side field
  errors onto the matching inputs.
- **Server-first rendering** — Server Components by default; only interactive
  leaves ship JavaScript.
- **Validated environment** — a missing variable fails the build, not production.

## Documentation

| Doc                                             | Covers                                |
| ----------------------------------------------- | ------------------------------------- |
| [architecture.md](docs/architecture.md)         | Rendering model, API layer, data flow |
| [folder-structure.md](docs/folder-structure.md) | Where things go, and why              |
| [components.md](docs/components.md)             | Every component's API                 |
| [design-system.md](docs/design-system.md)       | Tokens, theming, adding a colour      |
| [conventions.md](docs/conventions.md)           | Naming, imports, client/server rules  |
| [git-workflow.md](docs/git-workflow.md)         | Branching, commits, hooks             |
| [roadmap.md](docs/roadmap.md)                   | What's missing and what's next        |

## Using it for a real project

1. Update `src/config/site.ts` — name, description, URL, links
2. Replace the mark in `src/components/shared/Logo/Logo.tsx`
3. Set brand colours in `src/styles/tokens.css` (both the `:root` and `.dark` blocks)
4. Delete `src/components/sections/Showcase/` and reset `src/app/page.tsx`
5. Point `NEXT_PUBLIC_API_URL` at your backend
6. Add a real `/og.png` at 1200×630

Before shipping anything with real credentials, read the security note in
`src/lib/token-store.ts`.
