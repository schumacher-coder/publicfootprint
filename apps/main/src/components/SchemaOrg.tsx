import { getHomepageContent, getServices } from '@/lib/content'

/**
 * Schema.org JSON-LD for SEO and LLM indexing
 * Provides structured data about Public Footprint GmbH
 */
export default function SchemaOrg() {
  const homepage = getHomepageContent()
  const services = getServices()

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Public Footprint GmbH',
    legalName: 'Public Footprint GmbH',
    description: 'B2B-IT Kommunikation: Wir helfen Unternehmen, ihre einzigartigen Geschichten zu erzählen. Über 20 Jahre Erfahrung in PR, Storytelling und Digital Marketing.',
    url: 'https://publicfootprint.de',
    logo: 'https://publicfootprint.de/images/logos/public-footprint-logo.png',
    foundingDate: '2002',
    founders: [
      {
        '@type': 'Person',
        name: 'Thomas Schumacher',
        jobTitle: 'Geschäftsführer'
      }
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DE',
      addressLocality: 'Berlin'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['de', 'en']
    },
    sameAs: [
      'https://www.linkedin.com/company/public-footprint'
    ],
    offers: services.map(service => ({
      '@type': 'Service',
      name: service.title,
      description: service.excerpt,
      provider: {
        '@type': 'Organization',
        name: 'Public Footprint GmbH'
      }
    }))
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Public Footprint GmbH',
    url: 'https://publicfootprint.de',
    description: homepage.mainContent.content
      .filter(block => block.type === 'text')
      .map(block => block.type === 'text' ? block.content : '')
      .join(' ')
      .substring(0, 300),
    inLanguage: 'de'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
