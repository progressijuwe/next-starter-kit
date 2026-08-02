'use client';

import { useCallback, useMemo, useState } from 'react';

export interface Disclosure {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    /** Matches the `onOpenChange` signature Radix components expect. */
    setOpen: (open: boolean) => void;
}

/**
 * Open/closed state for modals, drawers, popovers and menus.
 *
 * Every callback is stable, so passing them to memoised children doesn't defeat
 * the memo.
 */
export function useDisclosure(initial = false): Disclosure {
    const [isOpen, setOpen] = useState(initial);

    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen((value) => !value), []);

    return useMemo(() => ({ isOpen, open, close, toggle, setOpen }), [isOpen, open, close, toggle]);
}
