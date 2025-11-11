import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt - Public Footprint GmbH',
  description: 'Kontaktieren Sie uns für Ihre B2B-IT Kommunikationsprojekte. Telefon, E-Mail oder Termin buchen.',
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

            {/* Contact Form Placeholder */}
            <div className="bg-gray-50 rounded-lg p-8 md:p-12">
              <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">
                Nachricht senden
              </h2>

              {/* Google Forms Embed Placeholder */}
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <p className="text-gray-600 mb-6">
                    Nutzen Sie unser Kontaktformular, um uns eine Nachricht zu senden.
                    Wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.
                  </p>

                  {/* TODO: Replace with actual Google Forms embed URL */}
                  <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">
                        Google Forms wird hier eingebettet<br />
                        (Embed-URL in Entwicklung konfigurieren)
                      </p>
                    </div>
                  </div>

                  {/* Uncomment and add your Google Forms URL */}
                  {/*
                  <iframe
                    src="YOUR_GOOGLE_FORMS_EMBED_URL"
                    width="100%"
                    height="800"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className="rounded-lg"
                  >
                    Wird geladen…
                  </iframe>
                  */}
                </div>
              </div>
            </div>

            {/* Calendar Booking */}
            <div className="mt-12 bg-white rounded-lg p-8 md:p-12 shadow-sm border-l-4 border-magenta">
              <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">
                Termin vereinbaren
              </h2>
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-gray-600 mb-6">
                  Buchen Sie direkt einen Termin für ein unverbindliches Erstgespräch.
                  Wir besprechen Ihre Anforderungen und entwickeln gemeinsam eine Strategie.
                </p>

                {/* Google Calendar Embed Placeholder */}
                <div className="aspect-[4/3] bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">
                      Google Calendar Appointment Scheduling<br />
                      (Embed-URL in Entwicklung konfigurieren)
                    </p>
                  </div>
                </div>

                {/* Uncomment and add your Google Calendar Appointment Scheduling URL */}
                {/*
                <iframe
                  src="YOUR_GOOGLE_CALENDAR_APPOINTMENT_URL"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  className="rounded-lg"
                >
                  Wird geladen…
                </iframe>
                */}
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
