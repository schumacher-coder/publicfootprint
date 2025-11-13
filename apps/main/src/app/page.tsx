import Link from 'next/link'
import { getHomepageContent, getServices, type ContentBlock } from '@/lib/content'
import { parseMarkdown } from '@/lib/markdown'

function renderContentBlock(block: ContentBlock, index: number, isLast: boolean = false) {
  if (block.type === 'text') {
    return (
      <p key={index} className={isLast ? "text-xl font-medium text-gray-900 pt-4" : ""}>
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

export default function Home() {
  const content = getHomepageContent()
  const services = getServices()

  return (
    <>
      {/* Hero Section */}
      <section
        className="section-padding bg-gradient-to-b from-gray-50 to-white relative"
        style={content.hero.backgroundImage ? {
          backgroundImage: `url(${content.hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        {content.hero.backgroundImage && (
          <div className="absolute inset-0 bg-white/35"></div>
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
            <div className="mt-12 flex gap-4 justify-center flex-wrap">
              <Link href="/services" className="btn-primary">
                Unsere Services
              </Link>
              <Link href="/kontakt" className="btn-secondary">
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Public Footprint Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">{content.aboutSection.title}</h2>
            <div className="space-y-6">
              {content.aboutSection.content.map((block, index) =>
                renderContentBlock(block, index)
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-12 text-center">{content.servicesSection.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <a
                  key={service.slug}
                  href={service.domain}
                  className="group bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-magenta transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.excerpt}
                  </p>
                </a>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/services" className="btn-primary">
                Alle Services entdecken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-magenta-600 to-magenta-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-white mb-6">
            {content.ctaSection.title}
          </h2>
          <p className="text-xl text-magenta-50 mb-8 max-w-2xl mx-auto">
            {content.ctaSection.description}
          </p>
          <Link
            href="/kontakt"
            className="inline-block px-8 py-3 bg-white text-magenta font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            {content.ctaSection.buttonText}
          </Link>
        </div>
      </section>
    </>
  )
}
