import { cva, type VariantProps } from 'class-variance-authority';
import type { ElementType } from 'react';

import { cn } from '@/lib/utils';
import type { PolymorphicProps } from '@/types';

const textVariants = cva('', {
    variants: {
        size: {
            body: 'text-body',
            small: 'text-small',
            caption: 'text-caption',
        },
        weight: {
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
        },
        align: {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
        },
        muted: {
            true: 'text-muted-foreground',
            false: '',
        },
        /* Caps the measure for readable prose. Off by default — inside a
           narrow column it would fight the parent's width. */
        balance: {
            true: 'text-pretty',
            false: '',
        },
    },
    defaultVariants: {
        size: 'body',
        weight: 'normal',
        align: 'left',
        muted: false,
        balance: false,
    },
});

export type TextProps<T extends ElementType = 'p'> = PolymorphicProps<
    T,
    VariantProps<typeof textVariants>
>;

/**
 * Body copy. The counterpart to Heading: same split between the element (`as`)
 * and the visual scale (`size`), so a `<span>` can carry body styling without
 * becoming a paragraph in the accessibility tree.
 */
export function Text<T extends ElementType = 'p'>({
    as,
    size,
    weight,
    align,
    muted,
    balance,
    className,
    children,
    ...props
}: TextProps<T>) {
    const Component = (as ?? 'p') as ElementType;

    return (
        <Component
            className={cn(textVariants({ size, weight, align, muted, balance }), className)}
            {...props}
        >
            {children}
        </Component>
    );
}

export { textVariants };
