import { MetadataRoute } from 'next'
import { getServices } from '@/lib/content'

/**
 * Dynamic sitemap.xml generation
 * Automatically includes all pages for SEO and LLM indexing
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://publicfootprint.de'
  const services = getServices()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/ueber-uns`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/notizen`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    },
    {
      url: `${baseUrl}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    }
  ]

  // Dynamic service pages (external, but list them for reference)
  const servicePages = services.map(service => ({
    url: service.domain,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9
  }))

  return [...staticPages]
}
