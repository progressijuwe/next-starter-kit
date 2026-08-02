import { QueryClient, isServer } from '@tanstack/react-query';

import { ApiError } from './api-error';

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                /* Non-zero so the client doesn't immediately refetch everything
                   the server just rendered. */
                staleTime: 60 * 1000,
                gcTime: 5 * 60 * 1000,
                refetchOnWindowFocus: false,
                retry: (failureCount, error) => {
                    /* A 4xx won't fix itself — retrying just delays the error. */
                    if (error instanceof ApiError && error.isClientError) return false;
                    return failureCount < 2;
                },
            },
            mutations: {
                /* Mutations are rarely idempotent; a retry can double-submit. */
                retry: false,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined;

/**
 * On the server, always hand back a fresh client so one request's cache can
 * never leak into another user's. In the browser, reuse a single client so
 * React's Suspense retries don't discard the cache mid-render.
 */
export function getQueryClient(): QueryClient {
    if (isServer) return makeQueryClient();

    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
}
