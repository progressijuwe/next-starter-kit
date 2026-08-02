import { Container } from '@/components/shared/Container';
import { Logo } from '@/components/shared/Logo';
import { Text } from '@/components/shared/Text';
import { siteConfig } from '@/config/site';

export function Footer() {
    return (
        <footer className="mt-auto border-t">
            <Container>
                <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
                    <Logo />

                    <Text size="small" muted>
                        {/* Rendered on the server at build time. If this page is
                            statically generated, the year freezes at build — use
                            a client component if that matters to you. */}
                        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </Text>
                </div>
            </Container>
        </footer>
    );
}
