# Architecture

## Stack

| Layer       | Choice                               |
| ----------- | ------------------------------------ |
| Framework   | Next.js 16 (App Router, Turbopack)   |
| UI          | React 19, Radix UI, Lucide           |
| Styling     | Tailwind CSS v4, CVA, CSS variables  |
| Forms       | React Hook Form + Zod                |
| Server data | TanStack Query + Axios               |
| Theming     | next-themes                          |
| Tooling     | ESLint, Prettier, Husky, lint-staged |

## Rendering model

Server Components are the default. A page renders on the server and ships HTML;
only the interactive leaves ship JavaScript. The home page proves the pattern —
`page.tsx`, `Hero` and `Showcase` are all Server Components, and only `Modal`,
`Tabs`, `Accordion`, `ThemeToggle` and `ContactForm` cross the boundary.

`Providers` is itself a Server Component that renders two client providers.
Because `children` is passed _through_ rather than imported by them, everything
below stays server-rendered.

## The API layer

```
components / hooks
        │  typed calls
        ▼
   services/*.ts        endpoint functions grouped by resource
        │
        ▼
   services/api.ts      axios instance + interceptors
        │
        ▼
   lib/api-error.ts     every failure normalised to ApiError
```

Two decisions carry most of the weight:

**Errors are normalised once.** The response interceptor converts anything that
goes wrong — a 500, a timeout, a DNS failure — into an `ApiError` with a
`status`, an optional `code`, and optional `fieldErrors`. Nothing downstream
touches an axios type or has to guess what it caught. Swapping axios for `fetch`
means rewriting one interceptor.

**Responses are unwrapped once.** If the backend returns `{ data: … }`, the
envelope is stripped in `api.ts`, so `api.get<User>()` resolves to a `User`.
Endpoints that need the envelope (paginated lists need `meta`) use `apiClient`
directly — see `usersService.list`.

Auth tokens are read through `lib/token-store.ts`. It uses `localStorage`, which
is XSS-exposed; the module is deliberately three functions wide so it can be
replaced with httpOnly cookies without touching anything else. See the note in
that file before shipping real credentials.

## Server state vs client state

TanStack Query owns anything that came from the server. Don't copy query results
into `useState` — that creates a second source of truth that goes stale.

Cache keys come from `constants/query-keys.ts` as a hierarchy, so invalidation
can be as broad or as narrow as needed:

```ts
queryClient.invalidateQueries({ queryKey: queryKeys.users.all }); // everything
queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() }); // just lists
queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) }); // one record
```

`getQueryClient()` returns a fresh client per request on the server (so one
user's cache can't leak into another's) and a singleton in the browser.

Retries are off for 4xx — a validation error won't fix itself — and off entirely
for mutations, which are rarely idempotent.

## Environment

`config/env.ts` validates `process.env` with Zod at import time, so a missing
variable fails the build rather than surfacing as `undefined` in production.

Each variable is listed literally. Next.js inlines `process.env.NEXT_PUBLIC_FOO`
by textual substitution at build time, so a dynamic `process.env[key]` lookup
resolves to `undefined` in the browser.

## Styling pipeline

```
globals.css          imports only
  ├── tokens.css     :root + .dark palettes, @theme mappings
  ├── animations.css keyframes and animate-* utilities
  ├── base.css       element defaults
  └── utilities.css  custom @utility helpers
```

Order is load-bearing: later files `@apply` tokens defined by earlier ones. See
[design-system.md](./design-system.md).
