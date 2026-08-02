import { Separator as SeparatorPrimitive } from 'radix-ui';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface DividerProps extends Omit<
    ComponentProps<typeof SeparatorPrimitive.Root>,
    'children'
> {
    /** Optional text set into the rule, e.g. "or". */
    label?: ReactNode;
}

/**
 * Horizontal or vertical rule.
 *
 * Radix marks it `decorative` by default, which keeps it out of the
 * accessibility tree — correct for a purely visual line. Pass
 * `decorative={false}` when the rule genuinely separates two sections of
 * content, so it's announced as a separator.
 */
export function Divider({
    className,
    orientation = 'horizontal',
    label,
    decorative = true,
    ...props
}: DividerProps) {
    if (label && orientation === 'horizontal') {
        return (
            <div className="flex w-full items-center gap-3" role="presentation">
                <SeparatorPrimitive.Root
                    data-slot="divider"
                    orientation="horizontal"
                    decorative={decorative}
                    className={cn('bg-border h-px flex-1', className)}
                    {...props}
                />
                <span className="text-caption text-muted-foreground shrink-0">{label}</span>
                <SeparatorPrimitive.Root
                    orientation="horizontal"
                    decorative
                    className={cn('bg-border h-px flex-1', className)}
                />
            </div>
        );
    }

    return (
        <SeparatorPrimitive.Root
            data-slot="divider"
            orientation={orientation}
            decorative={decorative}
            className={cn(
                'bg-border shrink-0',
                orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
                className,
            )}
            {...props}
        />
    );
}
