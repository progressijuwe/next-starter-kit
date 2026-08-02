import { cn } from '@/lib/utils';

import { headingVariants } from './headingVariants';
import type { HeadingElement, HeadingProps } from './Heading.types';

/**
 * Heading with semantics and appearance decoupled.
 *
 * `as` sets the element — which is what screen readers and search engines use
 * to build the page outline — and `size` sets the look. Choose `as` by where
 * the heading sits in the hierarchy (never skip a level), then `size` by how
 * loudly it should read.
 *
 * @example
 * <Heading as="h1" size="display">Welcome</Heading>
 * <Heading as="h2" size="h4">A subsection that shouldn't shout</Heading>
 */
export function Heading<T extends HeadingElement = 'h2'>({
    as,
    size,
    align,
    muted,
    className,
    children,
    ...props
}: HeadingProps<T>) {
    const Component = (as ?? 'h2') as HeadingElement;

    return (
        <Component className={cn(headingVariants({ size, align, muted }), className)} {...props}>
            {children}
        </Component>
    );
}
