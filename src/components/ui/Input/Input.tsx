'use client';

import { useId, type ComponentProps, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends Omit<ComponentProps<'input'>, 'id'> {
    /** Rendered as a `<label>` bound to the input. */
    label?: ReactNode;
    /** Helper text below the field. Announced alongside the label. */
    description?: ReactNode;
    /** Validation message. Its presence sets the invalid state. */
    error?: ReactNode;
    /** Decorative icon inside the field's leading edge. */
    leftIcon?: ReactNode;
    id?: string;
}

/**
 * Text input with its accessible wiring done for you.
 *
 * The label, description and error are connected via `aria-describedby` and
 * `aria-invalid`, so a screen reader announces the field name, its hint, and
 * why it failed. Wiring this by hand at every call site is where it usually
 * gets dropped.
 *
 * The error is a live region: it's announced when validation fails on a field
 * the user has already moved past.
 */
export function Input({
    className,
    label,
    description,
    error,
    leftIcon,
    id: idProp,
    'aria-describedby': describedByProp,
    ...props
}: InputProps) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;

    /* The error replaces the description in the markup below, so the id list
       has to match what is actually rendered — pointing `aria-describedby` at
       an element that doesn't exist leaves screen readers with nothing to
       announce. */
    const showDescription = Boolean(description) && !error;

    const describedBy =
        [describedByProp, showDescription ? descriptionId : null, error ? errorId : null]
            .filter(Boolean)
            .join(' ') || undefined;

    return (
        <div className="flex w-full flex-col gap-1.5">
            {label ? (
                <label htmlFor={id} className="text-small text-foreground font-medium">
                    {label}
                </label>
            ) : null}

            <div className="relative">
                {leftIcon ? (
                    <span
                        aria-hidden="true"
                        className="text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center [&_svg]:size-4"
                    >
                        {leftIcon}
                    </span>
                ) : null}

                <input
                    id={id}
                    data-slot="input"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    className={cn(
                        'border-input bg-background text-foreground placeholder:text-muted-foreground flex h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors',
                        'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                        leftIcon && 'pl-9',
                        className,
                    )}
                    {...props}
                />
            </div>

            {showDescription ? (
                <p id={descriptionId} className="text-caption text-muted-foreground">
                    {description}
                </p>
            ) : null}

            {error ? (
                <p id={errorId} role="alert" className="text-caption text-destructive font-medium">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
