export function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

/** URL-safe slug. Strips accents so "Café Niño" becomes "cafe-nino". */
export function slugify(value: string): string {
    return (
        value
            /* NFKD splits "é" into "e" + a combining accent, which the
               Diacritic property then removes. */
            .normalize('NFKD')
            .replace(/\p{Diacritic}/gu, '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/[\s-]+/g, '-')
            .replace(/^-+|-+$/g, '')
    );
}

/** Up to two initials for avatar fallbacks. */
export function getInitials(name: string, max = 2): string {
    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, max)
        .map((part) => part[0]!.toUpperCase())
        .join('');
}

/** Truncate on a word boundary so the result doesn't end mid-word. */
export function truncate(value: string, maxLength: number, suffix = '…'): string {
    if (value.length <= maxLength) return value;

    const clipped = value.slice(0, maxLength - suffix.length);
    const lastSpace = clipped.lastIndexOf(' ');

    return (lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trimEnd() + suffix;
}
