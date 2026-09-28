/* Lucide v1 dropped brand icons (GitHub, X, …) for trademark reasons, so this
   is a generic source-code glyph. Drop in your own SVG if you want the mark. */
import { CodeXmlIcon } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { mainNav, siteConfig } from '@/config/site';

import { MobileNav } from '../MobileNav';
import { ThemeToggle } from '../ThemeToggle';

const navLinkClasses =
    'text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px]';

/**
 * Site header. A Server Component — only ThemeToggle and MobileNav cross into
 * the client, so the nav markup ships as HTML.
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
                                    {item.external ? (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className={navLinkClasses}
                                        >
                                            {item.title}
                                            <span className="sr-only"> (opens in a new tab)</span>
                                        </a>
                                    ) : (
                                        <Link href={item.href} className={navLinkClasses}>
                                            {item.title}
                                        </Link>
                                    )}
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
                                aria-label="Source code on GitHub (opens in a new tab)"
                            >
                                <CodeXmlIcon />
                            </a>
                        </Button>
                        <ThemeToggle />
                        {/* Below `md` the nav above is hidden, so this is the
                            only route to it. */}
                        <div className="md:hidden">
                            <MobileNav />
                        </div>
                    </div>
                </div>
            </Container>
        </header>
    );
}
