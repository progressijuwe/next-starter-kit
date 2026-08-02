# Design system

Everything visual resolves to a token in `src/styles/tokens.css`. Components
never hardcode a colour, size, or shadow.

## How theming works

Colours are declared twice as plain custom properties — once under `:root`, once
under `.dark` — then mapped into Tailwind's namespace with `@theme inline`:

```css
:root {
    --primary: oklch(0.205 0 0);
}
.dark {
    --primary: oklch(0.922 0 0);
}

@theme inline {
    --color-primary: var(--primary);
}
```

`inline` is the important part. It makes `bg-primary` emit
`background-color: var(--primary)` rather than a resolved colour, so one class
follows whichever theme is active. Without it you'd need a `dark:` variant on
every colour utility.

`next-themes` toggles the `.dark` class on `<html>`, matched by the
`@custom-variant dark` rule in `globals.css`. The two must agree — changing the
provider's `attribute` without changing that rule silently breaks dark mode.

Theme is applied by a blocking inline script before first paint, which is why
there's no flash. That script is also why `<html>` carries
`suppressHydrationWarning`.

## Adding a colour

Add it to **both** blocks in `tokens.css`, then map it:

```css
:root {
    --brand: oklch(0.55 0.2 260);
    --brand-foreground: oklch(0.99 0 0);
}
.dark {
    --brand: oklch(0.7 0.18 260);
    --brand-foreground: oklch(0.15 0 0);
}

@theme inline {
    --color-brand: var(--brand);
    --color-brand-foreground: var(--brand-foreground);
}
```

You now have `bg-brand`, `text-brand`, `border-brand`, and so on. Every colour
ships with a `-foreground` pair — that's what guarantees readable text on it.

Colours are in `oklch` because it's perceptually uniform: `/20` opacity and
lightness tweaks behave predictably, which they don't in hex or `hsl`.

## Typography

The scale is semantic, not measurement-based. `text-h2` states intent;
`text-3xl` states a number that means nothing six months later.

| Token          | Size     | Use              |
| -------------- | -------- | ---------------- |
| `text-display` | 3.5rem   | Hero headline    |
| `text-h1`      | 2.75rem  | Page title       |
| `text-h2`      | 2.25rem  | Section heading  |
| `text-h3`      | 1.75rem  | Subsection       |
| `text-h4`      | 1.375rem | Card title       |
| `text-body`    | 1rem     | Running prose    |
| `text-small`   | 0.875rem | Secondary detail |
| `text-caption` | 0.75rem  | Labels, metadata |

Each carries its own line-height, letter-spacing and weight, so `text-h2` alone
is the whole treatment.

Reach for `Heading` and `Text` rather than the raw utilities — they keep the
semantic element separate from the visual size:

```tsx
<Heading as="h2" size="h4">
    Looks small, still an h2
</Heading>
```

## Spacing, radius, shadows

Page rhythm is a `Section` variant — `<Section spacing="2xl">` — not a spacing
token. Everything else uses Tailwind's numeric scale (`p-4`, `gap-6`).

> **Don't add t-shirt-named `--spacing-*` tokens.** The sizing utilities
> (`max-w-*`, `w-*`, `min-w-*`, `basis-*`) resolve against both the spacing
> scale and the container scale, and spacing wins. Defining `--spacing-lg`
> silently turns `max-w-lg` from 32rem into 2.5rem — a mysteriously narrow
> column rather than a visible error. The rhythm scale lives in
> `sectionVariants` for exactly this reason.

Radius derives from one knob. Change `--radius` and the whole app restyles:

```css
:root {
    --radius: 0.625rem;
} /* rounded-sm … rounded-4xl all follow */
```

Shadows (`shadow-sm` … `shadow-xl`) are deliberately soft — large blur, low
alpha — so elevation reads without a hard edge.

## Motion

`--ease-out-quart` and `--ease-spring` are available as `ease-*` utilities.
Enter/exit animations for Radix components come from `tw-animate-css`
(`animate-in`, `fade-in-0`, `zoom-in-95`) and `shadcn/tailwind.css`
(`animate-accordion-down`).

`base.css` honours `prefers-reduced-motion` globally, collapsing every animation
and transition to effectively zero. Don't defeat it with `!important`.

## Verifying changes

`/` renders every token and component on one page. Change a token, load it, and
toggle the theme in the header — if anything hardcodes a colour, it shows up
there immediately.
