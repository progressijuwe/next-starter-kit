'use client';

import { useEffect } from 'react';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { isDevelopment } from '@/config/env';

/**
 * Route-level error boundary. Must be a Client Component — React needs to
 * catch the error during render on the client.
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        /* Replace with your error reporter (Sentry, etc.). `digest` is the
           server-side identifier Next.js logs, which is how you correlate this
           with the stack trace the user never sees. */
        console.error(error);
    }, [error]);

    return (
        <Section spacing="2xl">
            <Container size="sm" className="flex flex-col items-center gap-4 text-center">
                <Heading as="h1" size="h1" align="center">
                    Something went wrong
                </Heading>
                <Text muted align="center" balance>
                    An unexpected error occurred. Trying again may be enough.
                </Text>

                {/* The raw message can leak internals, so it's dev-only. In
                    production the digest is all the user needs to quote. */}
                {isDevelopment ? (
                    <pre className="bg-muted text-caption max-w-full overflow-x-auto rounded-lg p-4 text-left">
                        {error.message}
                    </pre>
                ) : error.digest ? (
                    <Text size="caption" muted>
                        Reference: {error.digest}
                    </Text>
                ) : null}

                <Button onClick={reset} size="lg" className="mt-2">
                    Try again
                </Button>
            </Container>
        </Section>
    );
}
