import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/** Props every styleable component accepts. */
export interface BaseProps {
    className?: string;
    children?: ReactNode;
}

/**
 * Props for a polymorphic component: `as` swaps the rendered element and the
 * accepted DOM props follow it, so `<Text as="a" href="…" />` type-checks while
 * `<Text as="p" href="…" />` does not.
 *
 * `Omit` prevents the caller's own props from colliding with the element's.
 */
export type PolymorphicProps<T extends ElementType, Own = object> = Own &
    Omit<ComponentPropsWithoutRef<T>, keyof Own | 'as'> & {
        as?: T;
    };

export interface NavItem {
    title: string;
    href: string;
    /** Renders the link with a target="_blank" affordance. */
    external?: boolean;
    disabled?: boolean;
}

/** Makes the listed keys required while leaving the rest untouched. */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Widens a literal union to allow arbitrary strings without losing autocomplete. */
export type LooseAutocomplete<T extends string> = T | (string & {});

export type Nullable<T> = T | null;
