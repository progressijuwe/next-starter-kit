'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState, type ReactNode } from 'react';

import { isDevelopment } from '@/config/env';
import { getQueryClient } from '@/lib/query-client';

/* Loaded on demand and never during SSR, so the devtools bundle isn't shipped
   to users — `isDevelopment` is statically false in a production build, so the
   chunk is never requested. */
const ReactQueryDevtools = dynamic(
    () => import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools),
    { ssr: false },
);

export function QueryProvider({ children }: { children: ReactNode }) {
    /**
     * `useState` with an initialiser, not a module-level or inline `new
     * QueryClient()`. A module-level client would be shared across requests on
     * the server; an inline one would be thrown away on every re-render,
     * discarding the cache.
     */
    const [queryClient] = useState(getQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
