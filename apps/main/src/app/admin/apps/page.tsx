'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Service {
  id: string
  title: string
  slug: string
  domain: string
}

export default function AdminAppsOverview() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      const data = await response.json()
      setServices(data.services)
    } catch (error) {
      console.error('Fehler beim Laden')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Lädt...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 mb-1 inline-block">
            ← Zurück zum Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Landing Pages verwalten</h1>
          <p className="text-sm text-gray-600 mt-1">
            Content für jede Service-Domain individuell bearbeiten
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/admin/apps/${service.slug}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {service.domain}
              </p>
              <div className="text-magenta text-sm font-medium">
                Landing Page bearbeiten →
              </div>
            </Link>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 mb-4">Noch keine Services vorhanden</p>
            <Link
              href="/admin/services"
              className="inline-block px-6 py-3 bg-magenta text-white rounded-md hover:bg-magenta-700"
            >
              Services verwalten
            </Link>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            💡 Hinweis
          </h3>
          <p className="text-yellow-800">
            Jede Landing Page hat ihren eigenen Content. Wenn Sie einen neuen Service hinzufügen,
            wird automatisch eine neue Landing Page erstellt, die Sie hier bearbeiten können.
          </p>
        </div>
      </main>
    </div>
  )
}
