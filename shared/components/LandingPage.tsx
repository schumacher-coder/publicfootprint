import React from 'react'
import Link from 'next/link'

interface Section {
  id: string
  title: string
  content: string
}

interface AppContent {
  domain: string
  hero: {
    title: string
    subtitle: string
    description: string
  }
  sections: Section[]
  cta: {
    title: string
    buttonText: string
    buttonLink: string
  }
}

interface LandingPageProps {
  content: AppContent
}

export function LandingPage({ content }: LandingPageProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">{content.hero.title}</h1>
            <p className="text-2xl text-gray-700 mb-4 font-light">
              {content.hero.subtitle}
            </p>
            <p className="text-xl text-gray-600">
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
              <h2 className="mb-6">{section.title}</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>{section.content}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-magenta-600 to-magenta-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-white mb-6">{content.cta.title}</h2>
          <a
            href={content.cta.buttonLink}
            className="inline-block px-8 py-3 bg-white text-magenta font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            {content.cta.buttonText}
          </a>
        </div>
      </section>
    </>
  )
}
