import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border px-2 py-0.5 text-caption font-medium whitespace-nowrap transition-colors [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground border-transparent',
                secondary: 'bg-secondary text-secondary-foreground border-transparent',
                outline: 'text-foreground border-border',
                /* Tinted rather than solid: badges are read at a glance and a
                   wall of saturated pills is noisy. */
                success: 'bg-success/12 text-success border-success/20',
                warning: 'bg-warning/15 text-warning border-warning/25',
                destructive: 'bg-destructive/12 text-destructive border-destructive/20',
                info: 'bg-info/12 text-info border-info/20',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
    asChild?: boolean;
}

/**
 * Status pill. Purely visual — colour alone isn't an accessible signal, so the
 * text inside must carry the meaning ("Failed", not a bare red dot).
 */
export function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
    const Comp = asChild ? Slot.Root : 'span';

    return (
        <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { badgeVariants };
