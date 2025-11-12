import Link from 'next/link'
import type { Metadata } from 'next'
import { getAboutContent } from '@/lib/content'
import { parseMarkdown } from '@/lib/markdown'

export const metadata: Metadata = {
  title: 'About - Public Footprint GmbH',
  description: 'Über Public Footprint und Thomas Krings: Seit 2006 Ihr Partner für strategische B2B-IT Kommunikation.',
}

export default function AboutPage() {
  const content = getAboutContent()

  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">{content.hero.title}</h1>
            <p className="text-xl text-gray-600">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              {content.companyStory.paragraphs.map((paragraph, index) => (
                <p key={index}>{parseMarkdown(paragraph)}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Themenversteher */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Der „Themenversteher"-Ansatz</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-magenta rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Komplexität verstehen</h3>
                <p className="text-gray-600">
                  Wir erfassen technische Zusammenhänge schnell und präzise.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-magenta rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Geschichten entwickeln</h3>
                <p className="text-gray-600">
                  Aus Technik werden verständliche, überzeugende Narratives.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-magenta rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Wirkung erzielen</h3>
                <p className="text-gray-600">
                  Nachhaltige Kommunikation statt kurzfristiger Aktionismus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thomas Bio */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8">{content.thomasBio.title}</h2>
            <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm border-l-4 border-magenta">
              {content.thomasBio.image && (
                <div className="mb-8 flex justify-center">
                  <img
                    src={content.thomasBio.image}
                    alt="Thomas Krings"
                    className="rounded-lg shadow-lg max-w-md w-full object-cover"
                  />
                </div>
              )}
              <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                {content.thomasBio.paragraphs.map((paragraph, index) => (
                  <p key={index}>{parseMarkdown(paragraph)}</p>
                ))}
                <div className="pt-4 border-t-2 border-gray-200 mt-6">
                  <p className="text-xl font-medium text-gray-900 italic">
                    {content.thomasBio.mantra.intro}
                  </p>
                  <p className="text-2xl text-magenta font-light italic">
                    {content.thomasBio.mantra.quote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12 text-center">Über 20 Jahre Erfahrung</h2>
            <div className="space-y-8">
              {content.timeline.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="text-2xl font-light text-magenta">{item.year}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <h2 className="mb-6">Bereit für Zusammenarbeit?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Lassen Sie uns über Ihre Kommunikationsziele sprechen.
            Wir entwickeln gemeinsam eine Strategie, die zu Ihnen passt.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/kontakt" className="btn-primary">
              Kontakt aufnehmen
            </Link>
            <Link href="/services" className="btn-secondary">
              Services entdecken
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
