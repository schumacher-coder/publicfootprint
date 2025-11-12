import type { Metadata } from 'next'
import { getNotizenContent, getPublishedNotizen } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Notizen - Public Footprint GmbH',
  description: 'Gedanken, Insights und Beobachtungen aus über 20 Jahren B2B-IT Kommunikation.',
}

export default function NotizenPage() {
  const content = getNotizenContent()
  const publishedEntries = getPublishedNotizen()

  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">{content.hero.title}</h1>
            <p className="text-xl text-gray-600">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Journal Entries */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">

            {/* Entry Container - Notizbuch-Ästhetik */}
            <div className="space-y-12">

              {publishedEntries.map((entry) => (
                <article key={entry.id} className="border-t-2 border-gray-300 pt-8">
                  <time className="block font-mono text-sm text-gray-500 mb-4">
                    {entry.date}
                  </time>
                  <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                    {entry.content.map((paragraph, index) => {
                      const isHighlighted = paragraph.startsWith('→')
                      return (
                        <p key={index} className={isHighlighted ? 'text-magenta' : ''}>
                          {paragraph}
                        </p>
                      )
                    })}
                  </div>
                </article>
              ))}

              {publishedEntries.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Noch keine Notizen vorhanden.
                </div>
              )}

              {/* Info Box */}
              <div className="border-2 border-gray-200 bg-gray-50 p-8 rounded-lg mt-16">
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  {content.infoBox.title}
                </h3>
                {content.infoBox.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mt-4">
                    {paragraph}
                    {index === content.infoBox.paragraphs.length - 1 && (
                      <>
                        {' '}
                        <a
                          href={content.infoBox.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-magenta hover:text-magenta-600 font-medium"
                        >
                          LinkedIn
                        </a>.
                      </>
                    )}
                  </p>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  )
}
