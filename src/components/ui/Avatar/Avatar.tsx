'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

const avatarVariants = cva('relative flex shrink-0 overflow-hidden rounded-full select-none', {
    variants: {
        size: {
            sm: 'size-7 text-caption',
            default: 'size-9 text-small',
            lg: 'size-12 text-body',
            xl: 'size-16 text-h4',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

export interface AvatarProps
    extends ComponentProps<typeof AvatarPrimitive.Root>, VariantProps<typeof avatarVariants> {}

/**
 * Avatar image with a guaranteed fallback.
 *
 * Radix handles the load lifecycle: the fallback shows while the image is
 * loading and stays if it errors, so a broken URL degrades to initials rather
 * than a broken-image glyph.
 */
export function Avatar({ className, size, ...props }: AvatarProps) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            className={cn(avatarVariants({ size }), className)}
            {...props}
        />
    );
}

export function AvatarImage({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Image>) {
    return (
        <AvatarPrimitive.Image
            data-slot="avatar-image"
            className={cn('aspect-square size-full object-cover', className)}
            {...props}
        />
    );
}

export function AvatarFallback({
    className,
    delayMs = 300,
    ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            /* Brief delay so a fast-loading image doesn't flash initials first. */
            delayMs={delayMs}
            className={cn(
                'bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full font-medium',
                className,
            )}
            {...props}
        />
    );
}

export { avatarVariants };
