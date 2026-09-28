import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/**
 * Static route list. Once you have dynamic routes, fetch their slugs here and
 * map them in — this runs at build time (or on request, if the route is
 * dynamic), so it can hit your database or CMS.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: siteConfig.url,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
    ];
}
