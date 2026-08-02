import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
    return (
        <Section spacing="2xl">
            <Container size="sm" className="flex flex-col items-center gap-4 text-center">
                <Text size="small" muted weight="medium">
                    404
                </Text>
                <Heading as="h1" size="h1" align="center">
                    This page doesn&apos;t exist
                </Heading>
                <Text muted align="center" balance>
                    The link may be broken, or the page may have been moved.
                </Text>
                <Button asChild size="lg" className="mt-2">
                    <Link href={ROUTES.home}>Back to home</Link>
                </Button>
            </Container>
        </Section>
    );
}
