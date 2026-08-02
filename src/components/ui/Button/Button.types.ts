import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

import type { buttonVariants } from './buttonVariants';

export interface ButtonProps
    extends Omit<ComponentProps<'button'>, 'color'>, VariantProps<typeof buttonVariants> {
    /**
     * Render the child element instead of a `<button>`, merging this
     * component's props onto it. The canonical use is wrapping a `next/link`
     * so it looks like a button but still navigates like a link.
     *
     * Requires exactly one React element as `children`.
     */
    asChild?: boolean;

    /** Icon before the label. Hidden from assistive tech — it's decorative. */
    leftIcon?: ReactNode;

    /** Icon after the label. Hidden from assistive tech — it's decorative. */
    rightIcon?: ReactNode;

    /**
     * Swaps `leftIcon` for a spinner and disables the button, so an in-flight
     * request can't be submitted twice.
     */
    isLoading?: boolean;

    /** Announced while `isLoading`. Set to `null` to stay silent. */
    loadingLabel?: string | null;
}
