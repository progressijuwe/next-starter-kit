import type { ReactNode } from 'react';

import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

/**
 * Every app-wide provider, composed once and mounted in the root layout.
 *
 * This component itself is a Server Component — only the individual providers
 * carry `'use client'`. That keeps the client boundary as deep in the tree as
 * possible, so `children` passed through from the layout stay server-rendered.
 */
export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
    );
}

export { QueryProvider } from './QueryProvider';
export { ThemeProvider } from './ThemeProvider';
