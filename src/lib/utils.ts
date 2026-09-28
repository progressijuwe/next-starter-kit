import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * `tailwind-merge` resolves conflicting classes by grouping them, but it only
 * knows Tailwind's built-in scales. Our semantic type tokens (`text-h1`,
 * `text-body`, …) look like colours to it — `text-{word}` is far more often a
 * colour than a size — so it filed them under `text-color` and treated
 * `text-small text-muted-foreground` as a conflict, silently dropping the size.
 *
 * Registering them under `font-size` fixes both directions: sizes now override
 * sizes (including built-ins like `text-4xl`), and a size no longer collides
 * with a colour.
 *
 * Any new `--text-*` token added to styles/tokens.css must be listed here too.
 */
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            'font-size': [
                { text: ['display', 'h1', 'h2', 'h3', 'h4', 'body', 'small', 'caption'] },
            ],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
