'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const sections = [
    {
      title: 'Server Statistiken',
      description: 'DSGVO-konforme Zugriffszahlen und Analytics aus nginx Logs',
      href: '/admin/stats',
      icon: '📊',
    },
    {
      title: 'Homepage bearbeiten',
      description: 'Hero, Über-uns-Bereich und Call-to-Action anpassen',
      href: '/admin/homepage',
      icon: '🏠',
    },
    {
      title: 'About-Seite bearbeiten',
      description: 'Unternehmensgeschichte, Thomas Bio und Timeline verwalten',
      href: '/admin/about',
      icon: '👤',
    },
    {
      title: 'Services verwalten',
      description: 'Services hinzufügen, bearbeiten, löschen und sortieren',
      href: '/admin/services',
      icon: '⚙️',
    },
    {
      title: 'Landing Pages',
      description: 'Content für Service-Domains bearbeiten',
      href: '/admin/apps',
      icon: '📄',
    },
    {
      title: 'Notizen verwalten',
      description: 'Blog-Einträge erstellen, bearbeiten und veröffentlichen',
      href: '/admin/notizen',
      icon: '📝',
    },
    {
      title: 'Impressum bearbeiten',
      description: 'Rechtliche Angaben und Kontaktdaten anpassen',
      href: '/admin/impressum',
      icon: '⚖️',
    },
    {
      title: 'Datenschutz bearbeiten',
      description: 'Datenschutzerklärung verwalten und aktualisieren',
      href: '/admin/datenschutz',
      icon: '🔒',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
              <p className="text-sm text-gray-600">Public Footprint Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Willkommen im Admin-Bereich
          </h2>
          <p className="text-gray-600">
            Hier können Sie alle Inhalte Ihrer Website bearbeiten, ohne den Quellcode ändern zu müssen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="text-4xl mb-4">{section.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {section.title}
              </h3>
              <p className="text-gray-600 text-sm">{section.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Tipp: Multi-Domain-Verwaltung
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>
              <strong>Services verwalten:</strong> Fügen Sie neue Services hinzu oder löschen Sie bestehende.
              Jeder Service kann auf eine eigene Domain verweisen.
            </p>
            <p>
              <strong>Landing Pages:</strong> Für jeden Service können Sie individuelle Landing-Page-Inhalte
              erstellen und bearbeiten.
            </p>
            <p>
              <strong>On-the-fly hinzufügen:</strong> Neue Services und Landing Pages können jederzeit
              ohne Entwicklerunterstützung erstellt werden.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
