import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-8">
              Was ist Ihre Story?
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                Unsere physikalische Welt besteht aus Atomen und Elementarteilchen. Doch was verbindet Menschen miteinander? Die Antwort ist einfach: <strong className="text-gray-900">Kommunikation!</strong>
              </p>
              <p>
                Seit Anbeginn der Menschheit sind Geschichten der Kitt unseres sozialen Zusammenhalts. Vom Lagerfeuer bis zum digitalen Zeitalter: Storytelling bleibt unser mächtigstes Werkzeug. Unser Gehirn speichert Bilder und Zusammenhänge leichter ab als bloße Fakten.
              </p>
              <p>
                Bei Public Footprint helfen wir Unternehmen, ihre einzigartigen Geschichten zu erzählen – spannend, lehrreich, informativ und manchmal einfach unterhaltsam! Wer überzeugende Geschichten erzählt, hinterlässt bleibende Spuren in der Erinnerung seiner Zielgruppe.
              </p>
              <p className="text-xl font-medium text-gray-900 pt-4">
                Wir helfen Ihnen dabei, den perfekten kommunikativen Fußabdruck für Ihr Unternehmen zu gestalten!
              </p>
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
            <h2 className="mb-8 text-center">Public Footprint</h2>
            <div className="space-y-6">
              <p>
                Kommunikation ist dann wirkungsvoll, wenn sie lebendig ist und nachhaltige Spuren hinterlässt. Genau dieses Prinzip prägt seit unserer Gründung 2006 unsere Arbeit: Wir schaffen für unsere Kunden einen unverwechselbaren „Public Footprint" in der Medienlandschaft und den sozialen Netzwerken.
              </p>
              <p>
                Je markanter dieser Abdruck, desto sicherer nehmen potenzielle Kunden Ihre Fährte auf und entscheiden sich für Ihr Angebot! Mit strategischem Storytelling und maßgeschneiderten Kommunikationslösungen sorgen wir dafür, dass Ihre Botschaft nicht nur gehört, sondern auch in Erinnerung bleibt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-12 text-center">Unsere Footprints</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services#${service.slug}`}
                  className="group bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-magenta transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.excerpt}
                  </p>
                </Link>
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
            Bereit für Ihren Public Footprint?
          </h2>
          <p className="text-xl text-magenta-50 mb-8 max-w-2xl mx-auto">
            Lassen Sie uns gemeinsam Ihre Geschichte erzählen und nachhaltige Spuren in Ihrer Zielgruppe hinterlassen.
          </p>
          <Link
            href="/kontakt"
            className="inline-block px-8 py-3 bg-white text-magenta font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Jetzt Kontakt aufnehmen
          </Link>
        </div>
      </section>
    </>
  )
}

const services = [
  {
    title: 'Reference Footprint',
    slug: 'reference',
    excerpt: 'Überzeugende Kundenreferenzen und Success Stories, die Ihre Kompetenz greifbar machen.',
  },
  {
    title: 'Media Footprint',
    slug: 'media',
    excerpt: 'Platzierung in Fachmedien mit hochwertigem Content. Über 20 Jahre Redaktionskontakte.',
  },
  {
    title: 'Digital Footprint',
    slug: 'digital',
    excerpt: 'Digitale Sichtbarkeit erhöhen und neue Zielgruppen online erreichen.',
  },
  {
    title: 'Social Media Footprint',
    slug: 'social',
    excerpt: 'Professionelle Pflege Ihrer Business-Netzwerke auf LinkedIn, XING und Co.',
  },
  {
    title: 'Event Footprint',
    slug: 'event',
    excerpt: 'Maximale Aufmerksamkeit auf Messen und Kongressen – live und digital.',
  },
  {
    title: 'Marketing Footprint',
    slug: 'marketing',
    excerpt: 'Strategischer Einsatz von Marketing-Mitteln für nachhaltige Ergebnisse.',
  },
]
