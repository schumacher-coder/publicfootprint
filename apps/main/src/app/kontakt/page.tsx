import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt - Public Footprint GmbH',
  description: 'Kontaktieren Sie uns für Ihre B2B-IT Kommunikationsprojekte. Per Telefon oder E-Mail.',
}

export default function KontaktPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Kontakt</h1>
            <p className="text-xl text-gray-600">
              Lassen Sie uns über Ihr Projekt sprechen. Wir freuen uns auf Ihre Anfrage!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-16">

              {/* Direct Contact */}
              <div className="bg-white rounded-lg p-8 shadow-sm border-l-4 border-magenta">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Direkt erreichen</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Telefon</h3>
                    <a
                      href="tel:+492148309779"
                      className="text-xl text-magenta hover:text-magenta-600 transition-colors"
                    >
                      +49 214 830977-90
                    </a>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">E-Mail</h3>
                    <a
                      href="mailto:info@public-footprint.de"
                      className="text-xl text-magenta hover:text-magenta-600 transition-colors"
                    >
                      info@public-footprint.de
                    </a>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Adresse</h3>
                    <p className="text-gray-700">
                      Public Footprint GmbH<br />
                      Mendelssohnstraße 9<br />
                      51375 Leverkusen
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-lg p-8 shadow-sm border-l-4 border-gray-300">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Bürozeiten</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Montag – Donnerstag</span>
                    <span className="font-medium">9:00 – 17:00 Uhr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Freitag</span>
                    <span className="font-medium">9:00 – 14:00 Uhr</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Termine außerhalb der Bürozeiten nach Vereinbarung möglich.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Simple Contact CTA */}
            <div className="bg-gradient-to-br from-magenta to-magenta-700 rounded-lg p-8 md:p-12 text-center text-white shadow-lg">
              <h2 className="text-3xl font-light mb-4">Lassen Sie uns sprechen</h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Schreiben Sie uns eine E-Mail oder rufen Sie uns an.
                Wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:info@public-footprint.de"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-magenta font-medium rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  E-Mail schreiben
                </a>
                <a
                  href="tel:+492148309779"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Anrufen
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">
              Wie wir arbeiten
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-magenta rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Erstgespräch</h3>
                <p className="text-gray-600">
                  Unverbindlich kennenlernen und Anforderungen besprechen
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-magenta rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Konzept</h3>
                <p className="text-gray-600">
                  Maßgeschneiderte Strategie und transparentes Angebot
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-magenta rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Umsetzung</h3>
                <p className="text-gray-600">
                  Pragmatische Umsetzung mit regelmäßigem Austausch
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
