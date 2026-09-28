import axios, {
    type AxiosError,
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/config/env';
import { ApiError } from '@/lib/api-error';
import { clearToken, getToken } from '@/lib/token-store';
import type { ApiErrorBody, ApiResponse } from '@/types';

/**
 * The one configured axios instance. Import `api` (below) in feature code;
 * reach for `apiClient` only when you need something the helpers don't cover,
 * such as upload progress or a custom `signal`.
 */
export const apiClient = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    timeout: 30_000,
    headers: { 'Content-Type': 'application/json' },
    /* Flip to `true` when the backend authenticates with httpOnly cookies —
       it also requires a non-wildcard CORS origin server-side. */
    withCredentials: false,
});

/**
 * Attach the bearer token, unless a caller has already set its own header.
 *
 * IMPORTANT: `getToken()` reads browser storage, so it always returns `null`
 * during SSR and in Server Components. Requests made on the server are
 * therefore unauthenticated — silently, with a 401 rather than an error you
 * can grep for.
 *
 * When you need an authenticated request on the server, read the credential
 * from the incoming request (`cookies()` / `headers()`) and pass it per call.
 * The check below leaves an explicit Authorization header alone:
 *
 *   const token = (await cookies()).get('session')?.value;
 *   await api.get<User>('/me', { headers: { Authorization: `Bearer ${token}` } });
 *
 * Moving to httpOnly cookies plus `withCredentials: true` removes this split
 * entirely, which is the better end state. See lib/token-store.ts.
 */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/**
 * Normalise every failure into `ApiError`. This is the only place that knows
 * about axios error shapes — components, hooks and services downstream just
 * catch `ApiError`.
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorBody>) => {
        /* Cancellation is intentional (unmount, new keystroke). Let it through
           untouched so TanStack Query can tell it apart from a real failure. */
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        const { response } = error;

        if (!response) {
            return Promise.reject(
                new ApiError(
                    error.code === 'ECONNABORTED'
                        ? 'The request timed out. Please try again.'
                        : 'Unable to reach the server. Check your connection.',
                    { status: 0, code: error.code, cause: error },
                ),
            );
        }

        const body = response.data;

        /* Token is gone or rejected. Drop it so the next request doesn't retry
           with a credential we already know is bad. Redirecting is left to the
           UI — this module must stay usable during SSR. */
        if (response.status === 401) {
            clearToken();
        }

        return Promise.reject(
            new ApiError(body?.message || fallbackMessage(response.status), {
                status: response.status,
                code: body?.code,
                fieldErrors: body?.errors,
                body,
                cause: error,
            }),
        );
    },
);

function fallbackMessage(status: number): string {
    if (status === 401) return 'Your session has expired. Please sign in again.';
    if (status === 403) return "You don't have permission to do that.";
    if (status === 404) return 'We couldn’t find what you were looking for.';
    if (status === 429) return 'Too many requests. Please slow down and try again.';
    if (status >= 500) return 'The server ran into a problem. Please try again shortly.';
    return 'Something went wrong. Please try again.';
}

/**
 * Keys an envelope is allowed to contain. Used to tell a real envelope apart
 * from a resource that merely happens to have a `data` field.
 */
const ENVELOPE_KEYS = new Set(['data', 'message', 'success', 'meta', 'errors', 'status']);

/**
 * Unwrap the `{ data: ... }` envelope when the backend uses one, and pass the
 * payload straight through when it doesn't.
 *
 * Checking only for a `data` key was too eager: a resource with its own `data`
 * field (a chart record, a webhook payload, a CMS block) got silently replaced
 * by its inner value. Requiring every key to be an envelope key makes that
 * false positive nearly impossible, because a real resource carries its own
 * fields — `id`, `name` — alongside.
 *
 * The one case still ambiguous is a response that is exactly `{ data: ... }`
 * and nothing else. If that is a real resource for you, call `apiClient`
 * directly and skip the unwrapper, as `usersService.list` does.
 */
function unwrap<T>(payload: ApiResponse<T> | T): T {
    if (
        payload !== null &&
        typeof payload === 'object' &&
        !Array.isArray(payload) &&
        'data' in payload &&
        Object.keys(payload).every((key) => ENVELOPE_KEYS.has(key))
    ) {
        return (payload as ApiResponse<T>).data;
    }

    return payload as T;
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.request<ApiResponse<T> | T>(config);
    return unwrap<T>(response.data);
}

/**
 * Typed request helpers. `T` is the shape you expect *after* unwrapping, so
 * `api.get<User[]>('/users')` resolves to `User[]` whether or not the server
 * wraps its responses.
 */
export const api = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, url, method: 'GET' }),

    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, url, data, method: 'POST' }),

    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, url, data, method: 'PUT' }),

    patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, url, data, method: 'PATCH' }),

    delete: <T = void>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, url, method: 'DELETE' }),
};
