import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-light text-white mb-4">
              Public <span className="text-magenta font-medium">Footprint</span> GmbH
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Seit 2006 Ihr Partner für strategische B2B-IT Kommunikation.
              Wir helfen Unternehmen, ihre einzigartigen Geschichten zu erzählen.
            </p>
            <div className="space-y-2 text-sm">
              <p>Mendelssohnstraße 9</p>
              <p>51375 Leverkusen</p>
              <p className="pt-2">
                <a href="tel:+492148309779" className="hover:text-magenta transition-colors">
                  +49 214 830977-90
                </a>
              </p>
              <p>
                <a href="mailto:info@public-footprint.de" className="hover:text-magenta transition-colors">
                  info@public-footprint.de
                </a>
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services#reference" className="hover:text-magenta transition-colors">
                  Reference Footprint
                </Link>
              </li>
              <li>
                <Link href="/services#media" className="hover:text-magenta transition-colors">
                  Media Footprint
                </Link>
              </li>
              <li>
                <Link href="/services#digital" className="hover:text-magenta transition-colors">
                  Digital Footprint
                </Link>
              </li>
              <li>
                <Link href="/services#social" className="hover:text-magenta transition-colors">
                  Social Media Footprint
                </Link>
              </li>
              <li>
                <Link href="/services#event" className="hover:text-magenta transition-colors">
                  Event Footprint
                </Link>
              </li>
              <li>
                <Link href="/services#marketing" className="hover:text-magenta transition-colors">
                  Marketing Footprint
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-magenta transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-magenta transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/notizen" className="hover:text-magenta transition-colors">
                  Notizen
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-magenta transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-magenta transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {currentYear} Public Footprint GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/impressum" className="hover:text-magenta transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-magenta transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
