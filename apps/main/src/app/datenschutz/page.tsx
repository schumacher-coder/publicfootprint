import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - Public Footprint GmbH',
  description: 'Datenschutzerklärung der Public Footprint GmbH.',
}

export default function DatenschutzPage() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-12">Datenschutzerklärung</h1>

          <div className="prose prose-lg max-w-none space-y-8">

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">1. Datenschutz auf einen Blick</h2>
              <h3 className="text-xl font-medium text-gray-800 mb-3">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
                Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem
                Text aufgeführten Datenschutzerklärung.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">2. Verantwortliche Stelle</h2>
              <p>
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p>
                Public Footprint GmbH<br />
                Thomas Krings<br />
                Mendelssohnstraße 9<br />
                51375 Leverkusen
              </p>
              <p>
                Telefon: <a href="tel:+492148309779" className="text-magenta hover:text-magenta-600">+49 214 830977-90</a><br />
                E-Mail: <a href="mailto:info@public-footprint.de" className="text-magenta hover:text-magenta-600">info@public-footprint.de</a>
              </p>
              <p>
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
                gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen
                Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">3. Datenerfassung auf dieser Website</h2>
              <h3 className="text-xl font-medium text-gray-800 mb-3">Server-Log-Dateien</h3>
              <p>
                Der Provider der Seiten (Vercel) erhebt und speichert automatisch Informationen in
                so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p>
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">4. Kontaktformular</h2>
              <p>
                Wenn Sie uns per Kontaktformular (Google Forms) Anfragen zukommen lassen, werden Ihre
                Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten
                zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">5. Google Forms</h2>
              <p>
                Wir verwenden Google Forms für unser Kontaktformular. Anbieter ist die Google Ireland
                Limited, Gordon House, Barrow Street, Dublin 4, Irland. Bei der Nutzung von Google Forms
                werden Daten an Google übermittelt. Weitere Informationen finden Sie in der
                Datenschutzerklärung von Google:{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-magenta hover:text-magenta-600"
                >
                  https://policies.google.com/privacy
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">6. Google Calendar</h2>
              <p>
                Wir verwenden Google Calendar für Terminvereinbarungen. Anbieter ist die Google Ireland
                Limited, Gordon House, Barrow Street, Dublin 4, Irland. Bei der Nutzung von Google Calendar
                werden Daten an Google übermittelt. Weitere Informationen finden Sie in der
                Datenschutzerklärung von Google:{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-magenta hover:text-magenta-600"
                >
                  https://policies.google.com/privacy
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">7. Ihre Rechte</h2>
              <p>
                Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten
                personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung
                sowie ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren
                Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Hinweis:</strong> Diese Datenschutzerklärung ist ein Basis-Template.
                Bitte lassen Sie diese von einem Rechtsanwalt oder Datenschutzbeauftragten
                auf Vollständigkeit und Rechtssicherheit prüfen und an Ihre spezifischen
                Anforderungen anpassen.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
