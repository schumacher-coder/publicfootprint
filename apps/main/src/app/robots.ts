import { MetadataRoute } from 'next'

/**
 * robots.txt - SEO and LLM crawler configuration
 *
 * Privacy-friendly approach:
 * - Allows LLM crawlers (GPTBot, Claude-Web, Google-Extended)
 * - Allows traditional search engines (Google, Bing)
 * - No user tracking, only public content indexing
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/']
      },
      // OpenAI ChatGPT
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/api/']
      },
      // Anthropic Claude
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/admin/', '/api/']
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/admin/', '/api/']
      },
      // Google Gemini/Bard
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin/', '/api/']
      },
      // Traditional search engines
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/']
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/']
      }
    ],
    sitemap: 'https://publicfootprint.de/sitemap.xml'
  }
}
