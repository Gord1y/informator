import type { MetadataRoute } from 'next'

import { PAGES } from '@/config/pages'

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(page => ({
    url: `${process.env.NEXT_PUBLIC_APP_URL}${page.href}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }))
}
