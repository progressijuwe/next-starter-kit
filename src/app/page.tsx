import { Hero } from '@/components/sections/Hero';
import { Showcase } from '@/components/sections/Showcase';

/**
 * A Server Component by default — no `'use client'` here, so this page's markup
 * is rendered on the server and only the interactive leaves ship JavaScript.
 */
export default function HomePage() {
    return (
        <>
            <Hero />
            <Showcase />
        </>
    );
}
