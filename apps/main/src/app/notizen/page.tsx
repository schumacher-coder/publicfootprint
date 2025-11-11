import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notizen - Public Footprint GmbH',
  description: 'Gedanken, Insights und Beobachtungen aus über 20 Jahren B2B-IT Kommunikation.',
}

export default function NotizenPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Notizen</h1>
            <p className="text-xl text-gray-600">
              Gedanken, Insights und Beobachtungen aus über 20 Jahren B2B-IT Kommunikation.
              Keine perfekten Artikel – nur authentische Einblicke in unsere Arbeit.
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

              {/* Entry 1 */}
              <article className="border-t-2 border-gray-300 pt-8">
                <time className="block font-mono text-sm text-gray-500 mb-4">
                  11.11.2025
                </time>
                <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                  <p>
                    Neue Website. Neuer Ansatz. Die Multi-Domain-Architektur ist mehr
                    als nur Technik – sie spiegelt wider, wie sich unser Business entwickelt hat.
                  </p>
                  <p>
                    Reference Stories werden zum Kern. Macht Sinn: KI kann keine
                    Interviews führen, keine Kundenbeziehungen aufbauen. Das ist human work.
                    Genau richtig.
                  </p>
                  <p className="text-magenta">
                    → Erste Domain für Reference Footprint in Planung
                  </p>
                </div>
              </article>

              {/* Entry 2 - Placeholder */}
              <article className="border-t-2 border-gray-300 pt-8">
                <time className="block font-mono text-sm text-gray-500 mb-4">
                  04.11.2025
                </time>
                <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                  <p>
                    B2B-IT Kommunikation verändert sich. Was vor 5 Jahren funktioniert hat,
                    reicht heute nicht mehr. Entscheider*innen wollen keine Hochglanz-Broschüren,
                    sondern authentische Einblicke.
                  </p>
                  <p>
                    Deshalb: Mehr Stories, weniger PR-Sprech. Mehr Substanz, weniger Buzzwords.
                  </p>
                </div>
              </article>

              {/* Entry 3 - Placeholder */}
              <article className="border-t-2 border-gray-300 pt-8">
                <time className="block font-mono text-sm text-gray-500 mb-4">
                  28.10.2025
                </time>
                <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                  <p>
                    LinkedIn wird zum wichtigsten Kanal für B2B-Kommunikation. Die Zeiten,
                    in denen Fachmedien die einzigen Gatekeeper waren, sind vorbei.
                  </p>
                  <p>
                    Aber: LinkedIn-Erfolg braucht Strategie und Konsistenz. Posting
                    ohne Plan bringt nichts. Authentizität schlägt Frequenz.
                  </p>
                </div>
              </article>

              {/* Info Box */}
              <div className="border-2 border-gray-200 bg-gray-50 p-8 rounded-lg mt-16">
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  Über diese Notizen
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Hier teile ich Gedanken aus dem Agentur-Alltag – unpoliert und direkt.
                  Mal sind es zwei Zeilen, mal drei Absätze. Kein Redaktionsplan, keine
                  SEO-Optimierung. Nur echte Insights aus über 20 Jahren in der B2B-IT Kommunikation.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Wenn Sie über neue Einträge informiert werden möchten, folgen Sie mir auf{' '}
                  <a
                    href="https://www.linkedin.com/in/thomaskrings/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-magenta hover:text-magenta-600 font-medium"
                  >
                    LinkedIn
                  </a>.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  )
}
