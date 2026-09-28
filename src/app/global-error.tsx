'use client';

/**
 * Last-resort boundary for errors thrown by the root layout itself, which
 * `error.tsx` sits inside of and therefore cannot catch.
 *
 * Two constraints from the framework shape this file:
 *
 *  1. It replaces the root layout when active, so it must render its own
 *     `<html>` and `<body>`.
 *  2. It does not get the app's global stylesheet, so Tailwind classes and the
 *     theme tokens are unavailable here. Everything is inline styles, and the
 *     colours follow the OS scheme rather than the in-app theme toggle.
 *
 * Keep it dependency-free — whatever broke the root layout may well be an
 * import this file would otherwise share.
 */
export default function GlobalError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    fontFamily:
                        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                    background: 'Canvas',
                    color: 'CanvasText',
                }}
            >
                <main style={{ maxWidth: '32rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', lineHeight: 1.3, margin: '0 0 0.75rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ margin: '0 0 1.5rem', opacity: 0.75, lineHeight: 1.6 }}>
                        The application failed to load. Trying again may be enough.
                    </p>

                    {/* The digest is the only safe identifier to show: it maps to
                        the full stack trace in your server logs. */}
                    {error.digest ? (
                        <p style={{ margin: '0 0 1.5rem', fontSize: '0.75rem', opacity: 0.6 }}>
                            Reference: {error.digest}
                        </p>
                    ) : null}

                    <button
                        type="button"
                        onClick={() => unstable_retry()}
                        style={{
                            font: 'inherit',
                            fontWeight: 500,
                            padding: '0.5rem 1.25rem',
                            borderRadius: '0.5rem',
                            border: '1px solid currentColor',
                            background: 'transparent',
                            color: 'inherit',
                            cursor: 'pointer',
                        }}
                    >
                        Try again
                    </button>
                </main>
            </body>
        </html>
    );
}
