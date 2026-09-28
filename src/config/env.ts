import { z } from 'zod';

/**
 * Environment validation.
 *
 * Split deliberately into two exports. An earlier version merged both schemas
 * into one `env` object and spread the server half only when running on the
 * server — so `env.NODE_ENV` was typed as always present but was `undefined` in
 * the browser. That kind of type lie is worse than no validation: it
 * type-checks, then quietly takes the wrong branch in production.
 *
 * `env`        — NEXT_PUBLIC_* only. Safe to read anywhere.
 * `serverEnv()` — server-only values. Throws if called from the browser.
 */

const clientSchema = z.object({
    NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
    NEXT_PUBLIC_API_URL: z.url().default('http://localhost:3000/api'),
});

const serverSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    /* Add server-only secrets here. They must NOT be prefixed NEXT_PUBLIC_ —
       anything with that prefix is inlined into the client bundle. */
});

function parse<T extends z.ZodType>(schema: T, input: unknown, scope: string): z.infer<T> {
    const result = schema.safeParse(input);

    if (!result.success) {
        const issues = result.error.issues
            .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
            .join('\n');

        throw new Error(`Invalid ${scope} environment variables:\n${issues}`);
    }

    return result.data;
}

/**
 * Each variable is listed literally rather than looped over. Next.js inlines
 * `process.env.NEXT_PUBLIC_FOO` by textual substitution at build time, so a
 * dynamic `process.env[key]` lookup resolves to `undefined` in the browser.
 *
 * Validated at module scope, so a bad value fails the build rather than
 * surfacing three layers deep at runtime.
 */
export const env = parse(
    clientSchema,
    {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    'client',
);

let cachedServerEnv: z.infer<typeof serverSchema> | undefined;

/**
 * Server-only environment. Lazy, so the schema never runs during a client
 * render, and loud rather than silent if it is reached from the browser —
 * importing a secret into a Client Component should fail at the call site, not
 * hand back `undefined`.
 */
export function serverEnv(): z.infer<typeof serverSchema> {
    if (typeof window !== 'undefined') {
        throw new Error(
            'serverEnv() was called in the browser. Server variables are not available there.',
        );
    }

    cachedServerEnv ??= parse(serverSchema, { NODE_ENV: process.env.NODE_ENV }, 'server');
    return cachedServerEnv;
}

/* Safe on both sides: Next.js replaces these literally at build time. */
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
