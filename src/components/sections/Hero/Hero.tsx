import { ArrowRightIcon, BookOpenIcon } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';

export function Hero() {
    return (
        <Section spacing="2xl">
            <Container size="md" className="flex flex-col items-center gap-6 text-center">
                <Badge variant="secondary">Next.js 16 · React 19 · Tailwind v4</Badge>

                {/* The page's only h1. Everything below steps down from here. */}
                <Heading as="h1" size="display" align="center">
                    {siteConfig.name}
                </Heading>

                <Text size="body" muted align="center" balance className="max-w-2xl">
                    {siteConfig.description}
                </Text>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" rightIcon={<ArrowRightIcon />}>
                        <Link href="#components">Browse components</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" leftIcon={<BookOpenIcon />}>
                        <a href={siteConfig.links.github} target="_blank" rel="noreferrer noopener">
                            Read the docs
                        </a>
                    </Button>
                </div>
            </Container>
        </Section>
    );
}
