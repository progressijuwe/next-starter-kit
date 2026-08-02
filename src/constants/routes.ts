/**
 * Every in-app path in one place. Import these instead of writing string
 * literals so a route rename is a single edit and a typo is a type error.
 */
export const ROUTES = {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    settings: '/settings',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
