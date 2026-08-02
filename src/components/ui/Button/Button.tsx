import { Slot } from 'radix-ui';
import { Children, cloneElement, type ReactElement, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Spinner } from '../Spinner';
import { buttonVariants } from './buttonVariants';
import type { ButtonProps } from './Button.types';

export function Button({
    className,
    variant,
    size,
    fullWidth,
    asChild = false,
    leftIcon,
    rightIcon,
    isLoading = false,
    loadingLabel = 'Loading',
    disabled,
    type,
    children,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    /**
     * The `data-icon` wrappers aren't decoration — `buttonVariants` keys its
     * asymmetric padding off them (`has-data-[icon=inline-start]:pl-2`), so an
     * icon sits closer to the edge than a text label would.
     */
    const decorate = (inner: ReactNode) => (
        <>
            {isLoading ? (
                <span data-icon="inline-start" className="inline-flex">
                    <Spinner size="sm" label={loadingLabel} />
                </span>
            ) : leftIcon ? (
                <span data-icon="inline-start" aria-hidden="true" className="inline-flex">
                    {leftIcon}
                </span>
            ) : null}
            {inner}
            {rightIcon ? (
                <span data-icon="inline-end" aria-hidden="true" className="inline-flex">
                    {rightIcon}
                </span>
            ) : null}
        </>
    );

    const sharedProps = {
        'data-slot': 'button',
        'data-variant': variant,
        'data-size': size,
        'aria-busy': isLoading || undefined,
        className: cn(buttonVariants({ variant, size, fullWidth, className })),
    };

    if (asChild) {
        /**
         * Slot merges props onto the child rather than rendering a wrapper, so
         * the icons have to be cloned *into* the child — returning a fragment
         * here would hand Slot more than one child and throw.
         */
        const child = Children.only(children) as ReactElement<{ children?: ReactNode }>;

        return (
            <Slot.Root
                {...sharedProps}
                /* The child may be an anchor, which has no `disabled`. Fall back
                   to the ARIA equivalent plus a class that kills interaction. */
                aria-disabled={isDisabled || undefined}
                data-disabled={isDisabled || undefined}
                className={cn(
                    sharedProps.className,
                    isDisabled && 'pointer-events-none opacity-50',
                )}
                {...props}
            >
                {cloneElement(child, undefined, decorate(child.props.children))}
            </Slot.Root>
        );
    }

    return (
        <button
            {...sharedProps}
            /**
             * Defaults to "button", not the HTML default of "submit". A button
             * inside a form submitting by accident is a far more common bug
             * than a missing type — the forms here pass `type="submit"`
             * explicitly.
             */
            type={type ?? 'button'}
            disabled={isDisabled}
            {...props}
        >
            {decorate(children)}
        </button>
    );
}

export { buttonVariants };
