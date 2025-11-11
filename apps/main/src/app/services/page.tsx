import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services - Public Footprint GmbH',
  description: 'Unsere Kommunikations-Services: Reference Stories, Media Relations, Digital Marketing, Social Media, Events und Marketing.',
}

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Unsere Services</h1>
            <p className="text-xl text-gray-600">
              Spezialisierte Kommunikationslösungen für B2B-IT Unternehmen.
              Jeder „Footprint" trägt dazu bei, Ihre Sichtbarkeit zu erhöhen
              und Ihre Botschaften gezielt zu platzieren.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto space-y-20">

            {/* Reference Footprint */}
            <div id="reference" className="scroll-mt-24">
              <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm border-l-4 border-magenta">
                <h2 className="mb-6">Reference Footprint</h2>
                <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                  <p>
                    Erfolgsgeschichten Ihrer Kunden sind Ihr stärkstes Marketing-Werkzeug.
                    Wir entwickeln überzeugende Reference Stories, die zeigen, wie Ihre
                    Lösungen echte Business-Probleme lösen.
                  </p>
                  <p>
                    Von der Recherche über Interviews bis zur finalen Story – wir machen
                    Ihre Kompetenz greifbar und helfen potenziellen Kunden, sich mit Ihren
                    bestehenden Kunden zu identifizieren.
                  </p>
                  <div className="pt-4">
                    <Link
                      href="/kontakt"
                      className="inline-flex items-center text-magenta hover:text-magenta-600 font-medium"
                    >
                      Reference Stories anfragen
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Footprint */}
            <div id="media" className="scroll-mt-24">
              <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm border-l-4 border-magenta">
                <h2 className="mb-6">Media Footprint</h2>
                <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                  <p>
                    Fachmedien zählen zu den wichtigsten Informationsquellen für Entscheider*innen.
                    Wir bringen Ihre Themen mit hochwertigem Content in die Medien, digital und
                    klassisch als "Print", und vergrößern dadurch Ihren Medien-Footprint.
                  </p>
                  <p>
                    Unser großes Plus: Mit über 20 Jahren Erfahrung kennen wir unsere
                    Ansprechpartner*innen in den Redaktionen und Ihre Themen aus dem Eff-Eff.
                  </p>
                  <p>
                    Oder anders gesagt: Wenn wir Ihre Themen nicht verstehen, werden Ihre
                    potenziellen Kunden und Partner damit auch Schwierigkeiten haben! Verständliche
                    Texte transportieren Ihre Vision und können auch Mitarbeiter*innen helfen, die
                    Strategie und Ziele Ihres Unternehmens besser zu verstehen. Und werden gern
                    von Redaktionen veröffentlicht!
                  </p>
                </div>
              </div>
            </div>

            {/* Digital Footprint */}
            <div id="digital" className="scroll-mt-24">
              <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm border-l-4 border-magenta">
                <h2 className="mb-6">Digital Footprint</h2>
                <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                  <p>
                    B2B-Unternehmen finden ihre Kunden heute vor allem im digitalen Raum.
                    Wir unterstützen Sie bei der Zielgruppenanalyse und definieren konkrete
                    Maßnahmen, damit Ihr digitaler Footprint wächst und Sie und Ihre Lösungen
                    und Dienstleistungen schneller online gefunden werden.
                  </p>
                  <p>
                    Und wir helfen Ihnen, neue Zielgruppen zu finden und anzusprechen. Sei es
                    über digitale Inhalte auf reichweitenstarken Seiten oder in sozialen Netzwerken.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Footprint */}
            <div id="social" className="scroll-mt-24">
              <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm border-l-4 border-magenta">
                <h2 className="mb-6">Social Media Footprint</h2>
                <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                  <p>
                    Die Pflege sozialer Kanäle ist heute ein Muss - aber aufwändig und im
                    stressigen Arbeitsalltag ohne Unterstützung kaum zu bewältigen. Wir
                    unterstützen Sie bei der Positionierung Ihres Unternehmens mit Curated
                    Content und bei der Pflege Ihrer Social Communitys, vorrangig in den
                    Business-Netzwerken LinkedIn und XING, aber auch auf allen anderen
                    relevanten Kanälen.
                  </p>
                  <p>
                    Wir helfen darüber hinaus Ihren Führungskräften, sich als Experten ein
                    eigenes Netzwerk aufzubauen, dieses zu pflegen und für Social Selling zu nutzen.
                  </p>
                  <p>
                    Unser Service reicht von der Themenrecherche und -aufbereitung über die
                    Zielgruppenanalyse bis hin zur regelmäßigen Bespielung der Kanäle und Analyse.
                    Wir beobachten Ihre Kanäle und initiieren Reaktionen, für mehr Engagement und
                    smarte "Shitstorm"-Prävention. Alle Maßnahmen zielen darauf ab, ihren
                    Social-Media-Footprint wachsen zu lassen. Damit Sie glänzen!
                  </p>
                </div>
              </div>
            </div>

            {/* Event Footprint */}
            <div id="event" className="scroll-mt-24">
              <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm border-l-4 border-magenta">
                <h2 className="mb-6">Event Footprint</h2>
                <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                  <p>
                    Sehen, anfassen, Informationen aus erster Hand - Messen und Kongresse sind
                    nach wie vor eine der besten Möglichkeiten, die Aufmerksamkeit des Fachpublikums
                    auf sich zu ziehen. Aber leider auch sehr kostspielig.
                  </p>
                  <p>
                    Um Ihren Event-Footprint zu vergrößern und das Optimum aus den nicht unerheblichen
                    Investitionen herauszuholen, unterstützen wir Unternehmen und Executives dabei,
                    "live" in den sozialen Medien zu berichten und sich mit Besucher*innen und
                    Interessierten zu vernetzen.
                  </p>
                  <p>
                    Sei es als Backup aus unserem Büro oder als externe Social-Media-Manager, die
                    vor Ort O-Töne einholen, Bilder und Videosequenzen aufnehmen und als
                    Ansprechpartner zur Verfügung stehen. Das macht Eindruck beim Fachpublikum vor
                    Ort und bindet gleichzeitig diejenigen ein, die nicht teilnehmen können.
                  </p>
                </div>
              </div>
            </div>

            {/* Marketing Footprint */}
            <div id="marketing" className="scroll-mt-24">
              <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm border-l-4 border-magenta">
                <h2 className="mb-6">Marketing Footprint</h2>
                <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
                  <p>
                    Geld ist immer knapp, vor allem das eigene – das gilt auch für Unternehmen!
                    Wir helfen Ihnen, die vorhandenen Mittel im Einklang mit den Unternehmenszielen
                    einzusetzen, indem wir die richtigen Zielgruppen und Maßnahmen definieren, um
                    nachhaltige Ergebnisse zu erzielen.
                  </p>
                  <p>
                    Haben Sie zum Beispiel das Potenzial Ihres Kundenstamms bereits ausgeschöpft?
                    Neue Kunden zu gewinnen ist fast immer teurer als in die Bindung bestehender
                    Kunden zu investieren.
                  </p>
                  <p>
                    Wir helfen Ihnen dabei, Ihren Marketing-Footprint sichtbarer zu machen -
                    manchmal auch mit unkonventionellen Ideen. Sprechen Sie uns an!
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="mb-6">Lassen Sie uns über Ihr Projekt sprechen</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Welcher Footprint passt zu Ihren Zielen? Wir beraten Sie gerne
            und entwickeln eine maßgeschneiderte Kommunikationsstrategie.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/kontakt" className="btn-primary">
              Jetzt Kontakt aufnehmen
            </Link>
            <Link href="/about" className="btn-secondary">
              Mehr über uns
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
