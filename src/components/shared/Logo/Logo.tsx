import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export interface LogoProps {
    className?: string;
    /** Render the wordmark alongside the glyph. */
    showText?: boolean;
    /** Render as plain content instead of a link — for use inside a footer heading. */
    asLink?: boolean;
}

/**
 * Brand mark. Swap the `<svg>` for your client's artwork; everything else —
 * the link target, the accessible name, the focus treatment — stays.
 *
 * The glyph is `aria-hidden` because the adjacent text already names the site.
 * When `showText` is false the link carries an `aria-label` instead, so it is
 * never an unlabelled link.
 */
export function Logo({ className, showText = true, asLink = true }: LogoProps) {
    const content = (
        <>
            <svg
                viewBox="0 0 32 32"
                aria-hidden="true"
                className="size-7 shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect width="32" height="32" rx="8" className="fill-primary" />
                <path
                    d="M10 22V10l12 12V10"
                    className="stroke-primary-foreground"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {showText ? (
                <span className="text-body font-semibold tracking-tight">{siteConfig.name}</span>
            ) : null}
        </>
    );

    const classes = cn(
        'inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-ring focus-visible:ring-[3px]',
        className,
    );

    if (!asLink) {
        return <span className={classes}>{content}</span>;
    }

    return (
        <Link
            href={ROUTES.home}
            className={classes}
            aria-label={showText ? undefined : `${siteConfig.name} — home`}
        >
            {content}
        </Link>
    );
}
