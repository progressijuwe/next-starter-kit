# Folder structure

```
src/
├── app/            Routes, layouts, and route-level files only
├── assets/         Imported static assets (SVGs, illustrations)
├── components/
│   ├── ui/         Generic primitives — Button, Input, Modal
│   ├── shared/     Composition helpers — Container, Section, Heading
│   ├── layout/     Site chrome — Header, Footer, ThemeToggle
│   ├── sections/   Page bands — Hero, Showcase
│   └── forms/      Complete forms wired to a schema
├── config/         Site metadata and validated environment
├── constants/      Routes, query keys, other frozen values
├── features/       Self-contained feature modules
├── hooks/          Generic reusable hooks
├── lib/            Framework-agnostic building blocks
├── providers/      React context providers
├── services/       API layer — axios instance and endpoints
├── styles/         Design tokens, base styles, utilities
├── types/          Shared TypeScript types
├── utils/          Pure helper functions
└── validators/     Zod schemas
```

## What goes where

The distinctions that actually come up in practice:

**`lib/` vs `utils/`** — `utils/` holds pure functions with no dependencies:
give them an input, get an output (`slugify`, `formatDate`). `lib/` holds the
project's building blocks, which may hold state or wrap a library (`cn`,
`ApiError`, `getQueryClient`, `token-store`).

**`config/` vs `constants/`** — `config/` is configuration that could plausibly
differ per deployment (site name, environment variables). `constants/` is values
that are the same everywhere and exist to stop string literals spreading
(`ROUTES`, `queryKeys`).

**`components/ui/` vs `shared/`** — `ui/` components render something visible
and interactive. `shared/` components mostly arrange other things (`Container`,
`Section`) or apply the type scale (`Heading`, `Text`). If it takes `children`
and mainly positions them, it's `shared/`.

**`components/` vs `features/`** — anything in `components/` should be usable by
any project built on this starter. The moment it knows about your domain
("invoice", "patient", "listing"), it belongs in a feature.

**`types/` vs colocated types** — `types/` is for shapes used across module
boundaries. A type used by exactly one component belongs next to it, as
`Component.types.ts`.

## Feature modules

Once something outgrows a single component, give it a folder under `features/`:

```
features/billing/
├── components/
├── hooks/
├── services/
├── types.ts
└── index.ts
```

Import across features only through the feature's `index.ts`, never into its
internals. That barrier is what keeps a feature deletable — the point of the
structure is that `rm -rf features/billing` leaves nothing dangling.

## Route files

`app/` holds routing concerns and nothing else. A page composes sections; it
doesn't define them. If `page.tsx` grows past roughly a screen of JSX, the
markup belongs in `components/sections/`.
