'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

/**
 * Wraps `next-themes` with this project's settings.
 *
 * `attribute="class"` is what pairs with the `@custom-variant dark` rule in
 * `globals.css` — changing one without the other silently breaks dark mode.
 *
 * next-themes injects a blocking inline script that sets the class before
 * first paint, which is why there's no flash of the wrong theme. That script is
 * also why the root `<html>` needs `suppressHydrationWarning`.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            /* Suppresses the cross-fade of every transition while the palette
               swaps, which otherwise reads as a smear. */
            disableTransitionOnChange
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}
