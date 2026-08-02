import type { NavItem } from '@/types';

import { env } from './env';

/**
 * Single source of truth for the site's identity. Metadata, the header, the
 * footer and OG tags all read from here — change the name once, not in nine
 * places.
 */
export const siteConfig = {
    name: 'Next Starter Kit',
    /* Used verbatim as the default meta description; keep under ~155 chars. */
    description:
        'A production-ready Next.js starter with typed APIs, a token-driven design system, and accessible components.',
    url: env.NEXT_PUBLIC_APP_URL,
    ogImage: '/og.png',
    locale: 'en_US',
    creator: '@yourhandle',
    links: {
        github: 'https://github.com/your-org/next-starter-kit',
        twitter: 'https://twitter.com/yourhandle',
    },
} as const;

export const mainNav: readonly NavItem[] = [
    { title: 'Features', href: '/#features' },
    { title: 'Components', href: '/#components' },
    { title: 'Docs', href: '/#docs' },
] as const;

export type SiteConfig = typeof siteConfig;
