import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Self-hosted Nunito font via Fontsource (DSGVO-konform, keine Google-Verbindung)
import '@fontsource/nunito/300.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/500.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'

export const metadata: Metadata = {
  title: 'Public Footprint GmbH - B2B-IT Kommunikation',
  description: 'Wir helfen Unternehmen, ihre einzigartigen Geschichten zu erzählen. Über 20 Jahre Erfahrung in B2B-IT Kommunikation.',
  keywords: 'B2B IT Kommunikation, PR Agentur, Storytelling, Reference Stories, Medien, Digital Marketing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" type="image/png" href="/images/logos/pf-signet.png" />
      </head>
      <body>
        {/* Skip to main content link for keyboard navigation */}
        <a href="#main" className="skip-link">
          Zum Hauptinhalt springen
        </a>
        <Header />
        <main id="main" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
