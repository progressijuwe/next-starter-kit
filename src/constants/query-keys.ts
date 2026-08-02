import type { ListParams } from '@/types';

/**
 * TanStack Query cache keys, as hierarchical factories.
 *
 * The nesting is what makes invalidation precise: `queryKeys.users.all`
 * invalidates every user query, `queryKeys.users.lists()` only the lists, and
 * `queryKeys.users.detail(id)` a single record. Hand-written arrays drift and
 * silently stop matching, which shows up as a cache that won't refresh.
 */
export const queryKeys = {
    users: {
        all: ['users'] as const,
        lists: () => [...queryKeys.users.all, 'list'] as const,
        list: (params?: ListParams) => [...queryKeys.users.lists(), params ?? {}] as const,
        details: () => [...queryKeys.users.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.users.details(), id] as const,
    },
    auth: {
        all: ['auth'] as const,
        session: () => [...queryKeys.auth.all, 'session'] as const,
    },
} as const;
