import { z } from 'zod';

/**
 * Environment validation.
 *
 * Parsed at import time so a missing or malformed variable fails the build
 * rather than surfacing as `undefined` three layers deep at runtime.
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

/**
 * Every variable is listed literally rather than looped over. Next.js inlines
 * `process.env.NEXT_PUBLIC_FOO` by textual substitution at build time, so a
 * dynamic `process.env[key]` lookup resolves to `undefined` in the browser.
 */
const clientEnv = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

const serverEnv = {
    NODE_ENV: process.env.NODE_ENV,
};

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

/* On the client, `serverEnv` values are absent by design; only validate them
   where they actually exist. */
const isServer = typeof window === 'undefined';

export const env = {
    ...parse(clientSchema, clientEnv, 'client'),
    ...(isServer ? parse(serverSchema, serverEnv, 'server') : ({} as z.infer<typeof serverSchema>)),
};

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
