'use client';

import { useSyncExternalStore } from 'react';

/* Nothing to subscribe to — "mounted" never changes after hydration — but the
   hook requires a subscribe function, so this returns a no-op unsubscribe.
   Defined at module scope so its identity is stable across renders. */
const subscribe = () => () => {};

/**
 * `false` during SSR and the initial hydration render, `true` afterwards.
 *
 * Use it to defer anything that depends on browser-only state — the resolved
 * theme, `localStorage`, `matchMedia` — until after hydration, where rendering
 * the wrong value first would be a mismatch.
 *
 * Implemented with `useSyncExternalStore` rather than the more familiar
 * `useState(false)` + `useEffect(() => setMounted(true))`. React treats the
 * server/client snapshot difference as a hydration concern rather than a state
 * update, so there's no cascading re-render — which is also what the
 * `react-hooks/set-state-in-effect` rule is protecting against.
 *
 * This trades a frame of empty UI for correctness, so render a same-sized
 * placeholder rather than `null` wherever layout shift would show.
 */
export function useMounted(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
}
