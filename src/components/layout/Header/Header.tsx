/* Lucide v1 dropped brand icons (GitHub, X, …) for trademark reasons, so this
   is a generic source-code glyph. Drop in your own SVG if you want the mark. */
import { CodeXmlIcon } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { mainNav, siteConfig } from '@/config/site';

import { ThemeToggle } from '../ThemeToggle';

/**
 * Site header. A Server Component — only ThemeToggle crosses into the client,
 * so the nav markup ships as HTML with no JavaScript cost.
 */
export function Header() {
    return (
        <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
            <Container>
                <div className="flex h-14 items-center justify-between gap-4">
                    <Logo />

                    <nav aria-label="Main" className="hidden md:block">
                        <ul className="flex items-center gap-1">
                            {mainNav.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px]"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild>
                            <a
                                href={siteConfig.links.github}
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label="GitHub repository (opens in a new tab)"
                            >
                                <CodeXmlIcon />
                            </a>
                        </Button>
                        <ThemeToggle />
                    </div>
                </div>
            </Container>
        </header>
    );
}
