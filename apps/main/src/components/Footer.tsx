import Link from 'next/link'
import { getServices } from '@/lib/content'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const services = getServices()

  return (
    <footer className="text-white" style={{ backgroundColor: '#575757' }}>
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <img
                src="/images/logos/public-footprint-logo.png"
                alt="Public Footprint"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white leading-relaxed mb-4">
              Seit 2006 Ihr Partner für strategische B2B-IT Kommunikation.
              Wir helfen Unternehmen, ihre einzigartigen Geschichten zu erzählen.
            </p>
            <div className="space-y-2 text-base text-white">
              <p className="text-white">Mendelssohnstraße 9</p>
              <p className="text-white">51375 Leverkusen</p>
              <p className="pt-2">
                <a href="tel:+492148309779" className="text-white hover:text-magenta transition-colors">
                  +49 214 830977-90
                </a>
              </p>
              <p>
                <a href="mailto:info@public-footprint.de" className="text-white hover:text-magenta transition-colors">
                  info@public-footprint.de
                </a>
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-base">
              {services.map((service) => (
                <li key={service.slug}>
                  <a
                    href={service.domain}
                    className="text-magenta hover:text-magenta-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-base">
              <li>
                <Link href="/" className="text-magenta hover:text-magenta-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/notizen" className="text-magenta hover:text-magenta-400 transition-colors">
                  Notizen
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-magenta hover:text-magenta-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-magenta hover:text-magenta-400 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-base text-white">
          <p>© {currentYear} Public Footprint GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/impressum" className="text-magenta hover:text-magenta-400 transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-magenta hover:text-magenta-400 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
