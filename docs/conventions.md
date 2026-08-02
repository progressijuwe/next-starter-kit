# Conventions

## Naming

| Thing              | Style                  | Example                   |
| ------------------ | ---------------------- | ------------------------- |
| Components         | PascalCase             | `Button`, `ThemeToggle`   |
| Component folders  | PascalCase             | `components/ui/Button/`   |
| Hooks              | camelCase, `use` first | `useMediaQuery`           |
| Utilities          | camelCase              | `formatDate`, `slugify`   |
| CVA variant files  | camelCase + `Variants` | `buttonVariants.ts`       |
| Types / interfaces | PascalCase             | `ButtonProps`, `ApiError` |
| Constants          | SCREAMING_SNAKE        | `ROUTES`, `SITE_CONFIG`   |
| Route folders      | kebab-case             | `app/reset-password/`     |

## Component file layout

Small components are two files:

```
Button/
├── Button.tsx
└── index.ts
```

Split further only when a file earns it:

```
Button/
├── Button.tsx           markup and behaviour
├── Button.types.ts      the props interface
├── buttonVariants.ts    the CVA definition
└── index.ts             public surface
```

Splitting the variants out is what lets other code borrow the styling
(`className={buttonVariants({ variant: 'outline' })}`) without importing the
component. Don't create these files pre-emptively — an empty `.types.ts` is
noise.

`index.ts` re-exports and nothing else. Never put implementation in it.

## Imports

Always use the `@/` alias. Relative imports are fine within a component folder
(`./buttonVariants`) and for a sibling primitive (`../Spinner`), but never
reach across the tree with `../../../`.

Order, which Prettier will not do for you:

1. External packages
2. `@/` internal modules
3. Relative imports
4. Type-only imports may sit with their group

## Server and Client Components

Everything is a Server Component unless it says otherwise. Add `'use client'`
only when the file needs state, effects, refs, browser APIs, or event handlers.

The rule that matters: `'use client'` marks a _boundary_, not a file. Every
module a client component imports gets pulled into the client bundle too. So
push the directive as far down the tree as it will go — `Header` stays a Server
Component and only `ThemeToggle` inside it is a client component.

Passing `children` through a client component keeps those children on the
server. `Providers` relies on this.

## Styling

Use tokens, never raw colours. `bg-primary`, not `bg-blue-600`; `text-h2`, not
`text-4xl font-semibold`. If a token is missing, add it to
`src/styles/tokens.css` in both the light and dark blocks.

Merge classes with `cn()` so callers can override:

```tsx
className={cn('rounded-lg border p-4', className)}
```

Order matters — `className` last, or `tailwind-merge` can't let the caller win.

## Forms

React Hook Form for state, Zod for validation, always. Infer the type from the
schema (`z.infer`) rather than declaring it separately, so the two can't drift.
`ContactForm` is the reference implementation.

## Accessibility

Non-negotiable for anything interactive:

- Reachable and operable by keyboard
- A visible focus style (never `outline: none` without a replacement)
- An accessible name — visible text, or `aria-label` for icon-only controls
- State exposed via ARIA (`aria-expanded`, `aria-invalid`, `aria-busy`)
- Colour is never the only signal

Prefer a Radix primitive over hand-rolling anything with focus management.

## Commits

Conventional Commits, enforced by nothing — so it's on you:

```
feat: add pricing table
fix: stop modal restoring focus to a detached node
chore: bump next to 16.2
docs: document the API layer
refactor: extract buttonVariants
```
