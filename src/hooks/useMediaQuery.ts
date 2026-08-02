'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query.
 *
 * Built on `useSyncExternalStore` rather than `useState` + `useEffect` because
 * that's what makes it tear-free and SSR-correct: the server snapshot is always
 * `false`, and React reconciles to the real value during hydration without the
 * extra render an effect would cost.
 *
 * Prefer a Tailwind responsive variant when you only need to change styling.
 * Reach for this when the *behaviour* differs — e.g. rendering a drawer instead
 * of a dialog.
 */
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const list = window.matchMedia(query);
            list.addEventListener('change', onChange);
            return () => list.removeEventListener('change', onChange);
        },
        [query],
    );

    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        /* The server has no viewport. Assume the mobile-first case. */
        () => false,
    );
}

/** Matches Tailwind's `md` breakpoint. */
export const useIsDesktop = () => useMediaQuery('(min-width: 48rem)');

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
