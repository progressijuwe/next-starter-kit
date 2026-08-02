# Roadmap

## Done

- Next.js 16 App Router on Turbopack, React 19, TypeScript strict
- Token-driven design system: semantic type scale, named spacing, radius from a
  single knob, soft shadow set, light/dark palettes in `oklch`
- Theming via next-themes with no flash of the wrong theme
- 11 UI primitives — Button, Card, Badge, Input, Textarea, Spinner, Avatar,
  Alert, Modal, Tabs, Accordion — on Radix where focus or keyboard nav is involved
- 6 shared components — Container, Section, Heading, Text, Divider, Logo
- API layer: axios instance, interceptors, `ApiError` normalisation, typed
  helpers that unwrap the response envelope
- TanStack Query with per-request server clients and hierarchical cache keys
- React Hook Form + Zod, including replaying server-side field errors
- Zod-validated environment variables, failing at build rather than runtime
- ESLint + Prettier + Husky + lint-staged
- `error.tsx` and `not-found.tsx`, skip link, reduced-motion support

## Not done — pick up as needed

### Testing

The spec's stated next step, and the biggest gap. Nothing is wired up.

```bash
npm i -D vitest @vitejs/plugin-react jsdom \
         @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm i -D @playwright/test
```

Worth covering first, because they're the parts most likely to break silently:

- `cn()` merge precedence
- `ApiError` normalisation across 4xx / 5xx / network failure
- Input and Textarea `aria-describedby` wiring
- Button `asChild` prop merging
- End-to-end: theme persists across reload; modal traps and restores focus

### Auth

`services/auth.ts` defines the endpoint shapes but there's no session provider,
route protection, or refresh-token flow. Before shipping real credentials,
replace `lib/token-store.ts` with httpOnly cookies — the module is three
functions wide precisely so that swap stays contained.

### Other candidates

- **Toasts** — no notification system yet; Radix Toast is already available
- **Data table** — sorting, pagination, and selection over `PaginatedResponse`
- **Dashboard shell** — the `--sidebar-*` tokens exist but nothing consumes them
- **More primitives** — Select, Checkbox, Radio, Switch, Tooltip, Dropdown; all
  are in the `radix-ui` package already, or `npx shadcn@latest add <name>`
- **CI** — see [git-workflow.md](./git-workflow.md) for a starting pipeline
- **`next/image` usage** — currently unused; add `remotePatterns` to
  `next.config.ts` before loading remote images
- **SEO** — `sitemap.ts`, `robots.ts`, and a real `/og.png`
- **Analytics and error reporting** — `error.tsx` currently only `console.error`s
- **Internationalisation** — `utils/format.ts` takes an explicit locale
  throughout, so it's ready for it

## Before using this for a client

1. Update `src/config/site.ts` — name, description, URL, links
2. Replace the mark in `src/components/shared/Logo/Logo.tsx`
3. Set the brand colours in `src/styles/tokens.css` (both blocks)
4. Delete `src/components/sections/Showcase/` and reset `src/app/page.tsx`
5. Copy `.env.example` to `.env.local`
6. Add a real `/og.png` at 1200×630
7. Point `NEXT_PUBLIC_API_URL` at the actual backend
