/**
 * Wire formats for the API layer. These describe what the backend sends;
 * adjust them to match your actual contract rather than reshaping responses
 * in components.
 */

/** Standard envelope. `services/api.ts` unwraps this so callers get `T`. */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
}

export interface PaginationMeta {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

/** Query params accepted by list endpoints. */
export interface ListParams {
    page?: number;
    perPage?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}

/**
 * Error body as returned by the server. `fieldErrors` maps directly onto React
 * Hook Form's `setError`, so server-side validation can be replayed in the UI.
 */
export interface ApiErrorBody {
    message?: string;
    code?: string;
    errors?: Record<string, string[]>;
}
