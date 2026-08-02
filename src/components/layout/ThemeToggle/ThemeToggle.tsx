'use client';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/Button';
import { useMounted } from '@/hooks';

const ORDER = ['light', 'dark', 'system'] as const;

const META = {
    light: { Icon: SunIcon, label: 'Light' },
    dark: { Icon: MoonIcon, label: 'Dark' },
    system: { Icon: MonitorIcon, label: 'System' },
} as const;

/**
 * Cycles light → dark → system.
 *
 * The theme isn't known until after hydration — it lives in `localStorage` —
 * so before `mounted` we render a same-sized disabled placeholder rather than
 * `null`. Returning `null` would pop the header layout when it appears, and
 * rendering a guessed icon would flash the wrong one.
 */
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const mounted = useMounted();

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                disabled
                aria-hidden="true"
                /* Placeholder only — kept out of the tab order and the a11y tree. */
                tabIndex={-1}
            >
                <SunIcon />
            </Button>
        );
    }

    const current = (ORDER as readonly string[]).includes(theme ?? '')
        ? (theme as (typeof ORDER)[number])
        : 'system';

    const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]!;
    const { Icon, label } = META[current];

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(next)}
            /* Names the current state and the result of activating, so the
               control is meaningful without sight of the icon. */
            aria-label={`Theme: ${label}. Switch to ${META[next].label.toLowerCase()}.`}
            title={`Theme: ${label}`}
        >
            <Icon />
        </Button>
    );
}
