/**
 * Formatting helpers.
 *
 * NOTE: `Intl` formats using the *runtime's* locale, which differs between your
 * server and your user's browser. Passing an explicit `locale` keeps server and
 * client output identical and avoids hydration mismatches. See
 * `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`
 * if you need genuinely user-local formatting.
 */

const DEFAULT_LOCALE = 'en-US';

export function formatDate(
    value: Date | string | number,
    options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
    locale = DEFAULT_LOCALE,
): string {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(date);
}

export function formatCurrency(amount: number, currency = 'USD', locale = DEFAULT_LOCALE): string {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function formatNumber(
    value: number,
    options?: Intl.NumberFormatOptions,
    locale = DEFAULT_LOCALE,
): string {
    return new Intl.NumberFormat(locale, options).format(value);
}

/** "1.2K", "3.4M" — for stat tiles and counters. */
export function formatCompact(value: number, locale = DEFAULT_LOCALE): string {
    return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(
        value,
    );
}

/** "3 days ago", "in 2 hours". */
export function formatRelativeTime(value: Date | string | number, locale = DEFAULT_LOCALE): string {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const seconds = Math.round((date.getTime() - Date.now()) / 1000);
    const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
        [60, 'second'],
        [60, 'minute'],
        [24, 'hour'],
        [7, 'day'],
        [4.34524, 'week'],
        [12, 'month'],
        [Number.POSITIVE_INFINITY, 'year'],
    ];

    let duration = seconds;

    for (const [amount, unit] of divisions) {
        if (Math.abs(duration) < amount) {
            return formatter.format(Math.round(duration), unit);
        }
        duration /= amount;
    }

    return formatter.format(Math.round(duration), 'year');
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;

    return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}
