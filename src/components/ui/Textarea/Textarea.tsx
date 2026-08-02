'use client';

import { useId, type ComponentProps, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'id'> {
    label?: ReactNode;
    description?: ReactNode;
    error?: ReactNode;
    id?: string;
}

/** Multi-line input. Shares Input's labelling and error semantics. */
export function Textarea({
    className,
    label,
    description,
    error,
    id: idProp,
    'aria-describedby': describedByProp,
    rows = 4,
    ...props
}: TextareaProps) {
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

            <textarea
                id={id}
                rows={rows}
                data-slot="textarea"
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={cn(
                    'border-input bg-background text-foreground placeholder:text-muted-foreground flex w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors',
                    'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                    /* Vertical only — horizontal resize breaks page layout. */
                    'resize-y',
                    className,
                )}
                {...props}
            />

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
