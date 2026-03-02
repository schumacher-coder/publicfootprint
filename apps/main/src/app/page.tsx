import Link from 'next/link'
import type { Metadata } from 'next'
import { getHomepageContent, getServices, type ContentBlock } from '@/lib/content'
import { parseMarkdown } from '@/lib/markdown'
import HeroCarousel from '@/components/HeroCarousel'

// Revalidate every 60 seconds - ISR (Incremental Static Regeneration)
export const revalidate = 60

// Page-specific metadata
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://publicfootprint.de'
  }
}

function renderContentBlock(block: ContentBlock, index: number, isLast: boolean = false, isHero: boolean = false) {
  if (block.type === 'text') {
    const textClass = isHero
      ? (isLast ? "text-xl font-medium pt-4" : "")
      : (isLast ? "text-xl font-medium text-gray-900 pt-4" : "")
    return (
      <p key={index} className={textClass}>
        {parseMarkdown(block.content)}
      </p>
    )
  } else if (block.type === 'image') {
    return (
      <div key={index} className="my-8">
        <img
          src={block.src}
          alt={block.alt || ''}
          className="rounded-lg shadow-lg max-w-full mx-auto"
        />
        {block.caption && (
          <p className={`text-sm text-center mt-2 italic ${isHero ? 'text-white/80' : 'text-gray-600'}`}>
            {block.caption}
          </p>
        )}
      </div>
    )
  }
  return null
}

export default function Home() {
  const content = getHomepageContent()
  const services = getServices()

  // Support both single image and carousel
  const heroImages = content.hero.backgroundImages
    ? content.hero.backgroundImages
    : content.hero.backgroundImage
    ? [content.hero.backgroundImage]
    : []

  return (
    <>
      {/* Hero Section with Carousel */}
      <HeroCarousel images={heroImages}>
        <div className="container-custom py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            {/* Logo */}
            {content.hero.logo && (
              <div className="mb-6 md:mb-10">
                <img
                  src={content.hero.logo}
                  alt="Public Footprint Logo"
                  className="h-24 md:h-32 lg:h-40 mx-auto drop-shadow-2xl brightness-0 invert"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="mb-6 md:mb-8 text-magenta drop-shadow-lg text-4xl md:text-6xl lg:text-[80px] font-bold leading-tight">
              {content.hero.title}
            </h1>
          </div>
        </div>
      </HeroCarousel>

      {/* Main Content Section */}
      <section className="section-padding bg-white" aria-labelledby="main-content-heading">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 id="main-content-heading" className="mb-8 text-center">{content.mainContent.title}</h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              {content.mainContent.content.map((block, index) =>
                renderContentBlock(block, index, index === content.mainContent.content.length - 1, false)
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="section-padding bg-white" aria-labelledby="services-heading">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 id="services-heading" className="mb-6 text-center">{content.servicesSection.title}</h2>
            <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
              {content.servicesSection.description}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <a
                  key={service.slug}
                  href={service.domain}
                  className="group bg-gray-50 p-8 rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-200 border border-gray-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${service.title} - öffnet in neuem Tab`}
                >
                  <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-magenta transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {service.excerpt}
                  </p>
                  <span className="sr-only">Öffnet in neuem Tab</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <Link href="/kontakt" className="btn-primary">
            Kontakt aufnehmen
          </Link>
        </div>
      </section>
    </>
  )
}
