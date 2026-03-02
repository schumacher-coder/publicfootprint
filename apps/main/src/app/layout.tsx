import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SchemaOrg from '@/components/SchemaOrg'

// Self-hosted Nunito font via Fontsource (DSGVO-konform, keine Google-Verbindung)
import '@fontsource/nunito/300.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/500.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'

const siteUrl = 'https://publicfootprint.de'
const siteName = 'Public Footprint GmbH'
const siteDescription = 'Wir helfen Unternehmen, ihre einzigartigen Geschichten zu erzählen. Über 20 Jahre Erfahrung in B2B-IT Kommunikation, PR und Storytelling.'
const siteImage = `${siteUrl}/images/logos/public-footprint-logo.png`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - B2B-IT Kommunikation`,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  keywords: 'B2B IT Kommunikation, PR Agentur, Storytelling, Reference Stories, Medien, Digital Marketing, Content Marketing, Corporate Communications',
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - B2B-IT Kommunikation`,
    description: siteDescription,
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: `${siteName} Logo`
      }
    ]
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - B2B-IT Kommunikation`,
    description: siteDescription,
    images: [siteImage],
    creator: '@publicfootprint'
  },

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },

  // Verification (optional - add when available)
  // verification: {
  //   google: 'your-google-verification-code',
  // }
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
        <SchemaOrg />
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
