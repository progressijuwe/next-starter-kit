'use client';

import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { Dialog as DialogPrimitive, VisuallyHidden } from 'radix-ui';

import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { mainNav } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * Navigation for viewports below `md`, where the desktop nav is hidden.
 *
 * Built on Radix Dialog rather than a plain toggled `<div>` so the panel gets
 * real dialog semantics: focus is trapped inside it, Escape closes, focus
 * returns to the hamburger, and the rest of the page is hidden from screen
 * readers while it is open.
 *
 * Each link is wrapped in `Dialog.Close`, which is what dismisses the panel on
 * navigation — a client-side route change does not unmount the dialog by
 * itself, so without this the panel would stay open over the new page.
 */
export function MobileNav() {
    return (
        <DialogPrimitive.Root>
            <DialogPrimitive.Trigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                    <MenuIcon />
                </Button>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={cn(
                        'fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                    )}
                />

                <DialogPrimitive.Content
                    className={cn(
                        'bg-card text-card-foreground fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col gap-6 border-l p-6 shadow-xl',
                        'data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
                        'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
                    )}
                >
                    {/* Radix requires a title; the panel's purpose is obvious
                        visually, so it is hidden rather than duplicated. */}
                    <VisuallyHidden.Root>
                        <DialogPrimitive.Title>Site navigation</DialogPrimitive.Title>
                    </VisuallyHidden.Root>

                    <div className="flex items-center justify-between">
                        <DialogPrimitive.Close asChild>
                            <Logo />
                        </DialogPrimitive.Close>
                        <DialogPrimitive.Close asChild>
                            <Button variant="ghost" size="icon" aria-label="Close menu">
                                <XIcon />
                            </Button>
                        </DialogPrimitive.Close>
                    </div>

                    <nav aria-label="Main">
                        <ul className="flex flex-col gap-1">
                            {mainNav.map((item) => (
                                <li key={item.href}>
                                    <DialogPrimitive.Close asChild>
                                        {item.external ? (
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                className="text-foreground hover:bg-muted focus-visible:ring-ring block rounded-md px-3 py-2 font-medium transition-colors outline-none focus-visible:ring-[3px]"
                                            >
                                                {item.title}
                                                <span className="sr-only">
                                                    {' '}
                                                    (opens in a new tab)
                                                </span>
                                            </a>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="text-foreground hover:bg-muted focus-visible:ring-ring block rounded-md px-3 py-2 font-medium transition-colors outline-none focus-visible:ring-[3px]"
                                            >
                                                {item.title}
                                            </Link>
                                        )}
                                    </DialogPrimitive.Close>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
