import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import type { PolymorphicProps } from '@/types';

import type { headingVariants } from './headingVariants';

/** The elements a Heading is allowed to render as. */
export type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

export type HeadingProps<T extends HeadingElement = 'h2'> = PolymorphicProps<
    T,
    VariantProps<typeof headingVariants> & { children: ReactNode }
>;
