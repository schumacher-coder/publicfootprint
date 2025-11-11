import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum - Public Footprint GmbH',
  description: 'Impressum und rechtliche Angaben der Public Footprint GmbH.',
}

export default function ImpressumPage() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-12">Impressum</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
              <p>
                Public Footprint GmbH<br />
                Mendelssohnstraße 9<br />
                51375 Leverkusen
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">Vertreten durch</h2>
              <p>
                Geschäftsführer: Thomas Krings
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">Kontakt</h2>
              <p>
                Telefon: <a href="tel:+492148309779" className="text-magenta hover:text-magenta-600">+49 214 830977-90</a><br />
                E-Mail: <a href="mailto:info@public-footprint.de" className="text-magenta hover:text-magenta-600">info@public-footprint.de</a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">Registereintrag</h2>
              <p>
                Eintragung im Handelsregister<br />
                Registergericht: [Bitte ergänzen]<br />
                Registernummer: [Bitte ergänzen]
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">Umsatzsteuer-ID</h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                [Bitte ergänzen]
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p>
                Thomas Krings<br />
                Mendelssohnstraße 9<br />
                51375 Leverkusen
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">EU-Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-magenta hover:text-magenta-600"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
