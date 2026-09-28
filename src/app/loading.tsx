import { Spinner } from '@/components/ui/Spinner';

/**
 * Route-level Suspense fallback. Next.js wraps the segment in a boundary and
 * shows this while the server work for a navigation is still in flight.
 *
 * Sized to roughly the height of a page body so the layout doesn't jump when
 * the real content arrives.
 */
export default function Loading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner size="lg" label="Loading page" />
        </div>
    );
}
