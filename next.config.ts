import type { NextConfig } from 'next';

/**
 * Headers applied to every response.
 *
 * Deliberately excludes Content-Security-Policy. A useful CSP for an app like
 * this needs a per-request nonce (next-themes and Next's own bootstrap both
 * inject inline scripts), which means generating it in `proxy.ts` rather than
 * here — a static `unsafe-inline` policy would pass a scanner while protecting
 * nothing. See the "Content Security Policy" guide in the Next.js docs when you
 * are ready to add one.
 */
const securityHeaders = [
    /* Stop the browser guessing a response's type, which is how a user upload
       gets reinterpreted as script. */
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    /* Send the full URL same-origin, only the origin cross-origin, nothing
       when downgrading to HTTP. Keeps paths out of third-party referrer logs. */
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    /* Clickjacking. Superseded by CSP frame-ancestors, kept for older browsers. */
    { key: 'X-Frame-Options', value: 'DENY' },
    /* Opt out of powerful features by default; re-enable per feature as needed. */
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    /* Ignored over plain HTTP, so it is safe in local development. */
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
];

const nextConfig: NextConfig = {
    /* Drop `x-powered-by: Next.js`. Minor, but it advertises the framework to
       anyone scanning for version-specific issues. */
    poweredByHeader: false,

    async headers() {
        return [{ source: '/:path*', headers: securityHeaders }];
    },
};

export default nextConfig;
