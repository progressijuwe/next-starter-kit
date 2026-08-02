import type { ApiErrorBody } from '@/types';

/**
 * The single error type the app deals with.
 *
 * Every failure crossing the API layer is normalised into this by the response
 * interceptor in `services/api.ts`, so nothing downstream needs to know about
 * axios, or guess whether it's holding an `Error`, a string, or a response body.
 * Deliberately transport-agnostic: swapping axios for `fetch` changes only the
 * interceptor.
 */
export class ApiError extends Error {
    /** HTTP status, or 0 when the request never reached the server. */
    readonly status: number;
    /** Machine-readable code from the backend, when it supplies one. */
    readonly code?: string;
    /** Per-field validation messages, ready to hand to `setError`. */
    readonly fieldErrors?: Record<string, string[]>;
    /** The raw body, kept for logging and debugging. */
    readonly body?: ApiErrorBody;

    constructor(
        message: string,
        options: {
            status?: number;
            code?: string;
            fieldErrors?: Record<string, string[]>;
            body?: ApiErrorBody;
            cause?: unknown;
        } = {},
    ) {
        super(message, { cause: options.cause });
        this.name = 'ApiError';
        this.status = options.status ?? 0;
        this.code = options.code;
        this.fieldErrors = options.fieldErrors;
        this.body = options.body;
    }

    /** Request never completed — offline, DNS failure, timeout, CORS. */
    get isNetworkError(): boolean {
        return this.status === 0;
    }

    /** Caller's fault: don't retry, show the message. */
    get isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }

    /** Server's fault: retrying is reasonable. */
    get isServerError(): boolean {
        return this.status >= 500;
    }

    get isUnauthorized(): boolean {
        return this.status === 401;
    }

    get isForbidden(): boolean {
        return this.status === 403;
    }

    get isNotFound(): boolean {
        return this.status === 404;
    }

    /** 422/400 with per-field detail — replayable into a form. */
    get isValidationError(): boolean {
        return Boolean(this.fieldErrors && Object.keys(this.fieldErrors).length > 0);
    }
}

/**
 * Message safe to render in the UI. Falls back to something human rather than
 * leaking a stack trace or an empty string.
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Something went wrong. Please try again.';
}
