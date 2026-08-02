'use client';

import { useEffect, useState } from 'react';

/**
 * Trails `value` by `delay` ms. Feed it into a query key to keep a
 * search-as-you-type input from firing a request per keystroke.
 *
 * The cleanup cancels the pending timer on every change, so only the last value
 * in a burst is ever committed.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debounced;
}
