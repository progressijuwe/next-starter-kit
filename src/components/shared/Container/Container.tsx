import { cn } from '@/lib/utils';
import { ElementType, ReactNode } from 'react';

type ContainerProps<T extends ElementType = 'div'> = {
    as?: T;
    children: ReactNode;
    className?: string;
};

export function Container<T extends ElementType = 'div'>({
    as,
    children,
    className,
}: ContainerProps<T>) {
    const Component = as ?? 'div';

    return (
        <Component className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
            {children}
        </Component>
    );
}
