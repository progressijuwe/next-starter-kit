# Components

Every primitive lives in `src/components/ui/`. Render `/` to see them all.

## Button

```tsx
<Button variant="outline" size="lg" leftIcon={<MailIcon />}>Email us</Button>
<Button isLoading loadingLabel="Saving your changes">Save</Button>
<Button fullWidth variant="destructive">Delete</Button>
<Button size="icon" aria-label="Delete item"><TrashIcon /></Button>
```

| Prop                     | Values                                                        |
| ------------------------ | ------------------------------------------------------------- |
| `variant`                | `default` `outline` `secondary` `ghost` `destructive` `link`  |
| `size`                   | `xs` `sm` `default` `lg` `icon` `icon-xs` `icon-sm` `icon-lg` |
| `fullWidth`              | `boolean`                                                     |
| `leftIcon` / `rightIcon` | `ReactNode` — decorative, hidden from screen readers          |
| `isLoading`              | swaps in a spinner and disables the button                    |
| `loadingLabel`           | what's announced while loading; `null` to stay silent         |
| `asChild`                | render the child element instead of a `<button>`              |

Two behaviours worth knowing:

**`type` defaults to `"button"`,** not the HTML default of `"submit"`. A stray
button submitting a form is a more common bug than a missing type. Forms pass
`type="submit"` explicitly.

**`isLoading` disables the button,** which prevents double submits but also
drops focus, since disabled elements aren't focusable. That trade is deliberate.

`asChild` merges the button's props onto its child, so icons are cloned _into_
that child. It needs exactly one element:

```tsx
<Button asChild rightIcon={<ArrowRightIcon />}>
    <Link href="/pricing">See pricing</Link>
</Button>
```

## Input / Textarea

Label, description and error wiring is handled for you — `aria-describedby`,
`aria-invalid`, and a generated id bound to the label.

```tsx
<Input label="Email" type="email" description="We'll never share it." />
<Input label="Password" type="password" error={errors.password?.message} />
<Input label="Search" leftIcon={<SearchIcon />} />
```

The error replaces the description when present, and the `aria-describedby` list
follows what's actually rendered — a reference to a missing element would leave
screen readers announcing nothing.

## Alert

```tsx
<Alert variant="warning">
    <AlertTitle>Card expiring</AlertTitle>
    <AlertDescription>Your card expires this month.</AlertDescription>
</Alert>
```

Variants: `default` `info` `success` `warning` `destructive`.

The ARIA role follows the variant — `alert` for warning and destructive, which
interrupts a screen reader immediately, `status` for the rest, which waits for a
pause. Marking an informational banner as urgent talks over whatever the user
was reading.

Pass `icon={null}` to drop the icon, or `icon={<X />}` to override it.

## Badge

Variants: `default` `secondary` `outline` `success` `warning` `destructive`
`info`. Colour is not an accessible signal on its own, so the text has to carry
the meaning — "Failed", not a bare red dot.

## Card

Composable parts; use only what you need.

```tsx
<Card>
    <CardHeader>
        <CardTitle>Starter</CardTitle>
        <CardDescription>For small teams.</CardDescription>
    </CardHeader>
    <CardContent>…</CardContent>
    <CardFooter>
        <Button>Choose</Button>
    </CardFooter>
</Card>
```

`CardTitle` renders an `<h3>`. If that's the wrong level for its position, pass
your own heading instead — a correct outline beats a convenient default.

## Modal

```tsx
<Modal>
    <ModalTrigger asChild>
        <Button>Delete</Button>
    </ModalTrigger>
    <ModalContent>
        <ModalHeader>
            <ModalTitle>Delete project</ModalTitle>
            <ModalDescription>This can't be undone.</ModalDescription>
        </ModalHeader>
        <ModalFooter>
            <ModalClose asChild>
                <Button variant="ghost">Cancel</Button>
            </ModalClose>
            <Button variant="destructive">Delete</Button>
        </ModalFooter>
    </ModalContent>
</Modal>
```

`ModalTitle` is **required**. Radix warns without one and an untitled dialog is
announced as an anonymous group. If the design has no visible heading, wrap it in
Radix's `VisuallyHidden`.

Radix handles focus trapping, focus restoration on close, Escape, outside-click
dismissal, and `aria-hidden` on the rest of the page.

## Tabs / Accordion

```tsx
<Tabs defaultValue="overview">
    <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">…</TabsContent>
</Tabs>

<Accordion type="single" collapsible>
    <AccordionItem value="a">
        <AccordionTrigger>Question</AccordionTrigger>
        <AccordionContent>Answer</AccordionContent>
    </AccordionItem>
</Accordion>
```

Accordion `type="single"` opens one panel at a time; add `collapsible` to allow
closing it. `type="multiple"` allows any number.

## Avatar / Spinner

```tsx
<Avatar size="lg">
    <AvatarImage src={user.avatarUrl} alt={user.name} />
    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
</Avatar>
```

The fallback shows while loading and stays if the image errors, so a broken URL
degrades to initials.

`Spinner` sits in a `role="status"` live region. Pass `label={null}` when
something nearby already describes the pending state — two announcements are
worse than one.

## Shared components

`Container` handles horizontal gutter and max-width (`sm` `md` `lg` `prose`
`full`). `Section` handles vertical rhythm (`spacing`, `surface`). Keeping the
two axes separate is what lets a full-bleed background sit behind aligned
content:

```tsx
<Section spacing="2xl" surface="muted">
    <Container>…</Container>
</Section>
```

`Heading` and `Text` split the semantic element (`as`) from the visual size
(`size`). `Divider` wraps Radix Separator and takes an optional `label`. `Logo`
reads from `siteConfig`.

## Adding a component

Match the existing shape rather than inventing a new one:

1. `src/components/ui/Thing/Thing.tsx` with a `data-slot="thing"` attribute
2. CVA variants in `thingVariants.ts` once there's more than one axis
3. `cn(variants(), className)` last, so callers can override
4. `index.ts` re-exporting the component, its variants, and its props type
5. Build on a Radix primitive if it involves focus, popovers, or keyboard nav

You can also pull a shadcn component in with `npx shadcn@latest add <name>` —
it lands as `components/ui/<name>.tsx` in kebab-case, so move it into a
PascalCase folder to match the rest.
