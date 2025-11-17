import { headers } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { getHomepageContent, getServices, getAppContent, type ContentBlock, type AppContent } from '@/lib/content'
import { parseMarkdown } from '@/lib/markdown'

function renderContentBlock(block: ContentBlock, index: number, isLast: boolean = false) {
  if (block.type === 'text') {
    return (
      <p key={index} className={isLast ? "text-xl font-medium text-gray-900 pt-4" : "text-lg text-gray-700 leading-relaxed"}>
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
          <p className="text-sm text-gray-600 text-center mt-2 italic">
            {block.caption}
          </p>
        )}
      </div>
    )
  }
  return null
}

// Landing Page Component for service domains
function LandingPageView({ content }: { content: AppContent }) {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-8">{content.hero.title}</h1>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              {content.hero.subtitle}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {content.sections.map((section, index) => (
        <section
          key={section.id}
          className={`section-padding ${
            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
          }`}
        >
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
              <div className="space-y-4">
                {section.content.map((block, idx) =>
                  renderContentBlock(block, idx, false)
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{content.cta.title}</h2>
          <a
            href={content.cta.buttonLink}
            className="inline-block px-8 py-3 bg-magenta-600 text-white font-medium rounded-md hover:bg-magenta-700 transition-colors duration-200"
          >
            {content.cta.buttonText}
          </a>
        </div>
      </section>
    </>
  )
}

// Homepage Component for main domain
function HomePageView() {
  const content = getHomepageContent()
  const services = getServices()

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {content.hero.backgroundImage && (
          <>
            <Image
              src={content.hero.backgroundImage}
              alt="Background"
              fill
              className="object-cover"
              sizes="100vw"
              priority
              quality={85}
            />
            <div className="absolute inset-0 bg-white/20 z-[1]"></div>
          </>
        )}
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-8">
              {content.hero.title}
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              {content.hero.content.map((block, index) =>
                renderContentBlock(block, index, index === content.hero.content.length - 1)
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-6 text-center">{content.servicesSection.title}</h2>
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
                >
                  <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-magenta transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {service.excerpt}
                  </p>
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

export default async function Home() {
  // Get current hostname
  const headersList = await headers()
  const hostname = headersList.get('host') || ''

  // Check if this is a landing page domain
  const services = getServices()
  const service = services.find(s => {
    const domain = s.domain.replace('https://', '').replace('http://', '')
    return hostname === domain || hostname === `www.${domain}`
  })

  // If it's a service domain, show landing page
  if (service) {
    const landingContent = getAppContent(service.slug)
    if (landingContent) {
      return <LandingPageView content={landingContent} />
    }
  }

  // Otherwise show homepage
  return <HomePageView />
}
