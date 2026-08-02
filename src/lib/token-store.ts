const STORAGE_KEY = 'auth.token';

/**
 * Access-token storage for the API layer.
 *
 * SECURITY: `localStorage` is readable by any script on the page, so an XSS
 * bug becomes token theft. It is used here because it works without a backend,
 * which is what a starter needs. For anything handling real credentials, move
 * to an httpOnly, SameSite cookie set by the server and delete this module —
 * `services/api.ts` only touches it through the three functions below, so that
 * swap is contained.
 *
 * The in-memory copy is the source of truth: it keeps reads off the main-thread
 * storage API on every request, and it is what makes this SSR-safe.
 */
let accessToken: string | null = null;
let hydrated = false;

const canUseStorage = () => typeof window !== 'undefined';

export function getToken(): string | null {
    if (!canUseStorage()) return null;

    /* Read through to storage once per page load so a refresh keeps the session. */
    if (!hydrated) {
        hydrated = true;
        try {
            accessToken = window.localStorage.getItem(STORAGE_KEY);
        } catch {
            /* Private mode, disabled storage, or a blocked origin. Stay in memory. */
        }
    }

    return accessToken;
}

export function setToken(token: string | null): void {
    accessToken = token;
    hydrated = true;

    if (!canUseStorage()) return;

    try {
        if (token) {
            window.localStorage.setItem(STORAGE_KEY, token);
        } else {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        /* Non-fatal: the in-memory token still works for this session. */
    }
}

export function clearToken(): void {
    setToken(null);
}
