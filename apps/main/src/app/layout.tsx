import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Self-hosted Google Font (DSGVO-konform)
const nunito = Nunito({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
})

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
    <html lang="de" className={nunito.variable}>
      <head>
        <link rel="icon" type="image/png" href="/images/logos/pf-signet.png" />
      </head>
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
