'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Service {
  id: string
  title: string
  slug: string
  domain: string
  excerpt: string
  enabled: boolean
  sortOrder: number
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      const data = await response.json()
      setServices(data.services)
    } catch (error) {
      setMessage('Fehler beim Laden der Services')
    } finally {
      setLoading(false)
    }
  }

  const saveServices = async () => {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services }),
      })

      if (response.ok) {
        setMessage('✅ Services erfolgreich gespeichert!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ Fehler beim Speichern')
      }
    } catch (error) {
      setMessage('❌ Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const addNewService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      title: 'Neuer Service',
      slug: 'neuer-service',
      domain: 'https://neuer-service.de',
      excerpt: 'Beschreibung des neuen Services',
      enabled: true,
      sortOrder: services.length + 1,
    }
    setServices([...services, newService])
    setEditingId(newService.id)
  }

  const updateService = (id: string, field: keyof Service, value: any) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const deleteService = (id: string) => {
    if (confirm('Wirklich löschen? Die zugehörige Landing Page bleibt bestehen.')) {
      setServices(services.filter(s => s.id !== id))
    }
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newServices = [...services]
    ;[newServices[index - 1], newServices[index]] = [newServices[index], newServices[index - 1]]
    newServices.forEach((s, i) => s.sortOrder = i + 1)
    setServices(newServices)
  }

  const moveDown = (index: number) => {
    if (index === services.length - 1) return
    const newServices = [...services]
    ;[newServices[index], newServices[index + 1]] = [newServices[index + 1], newServices[index]]
    newServices.forEach((s, i) => s.sortOrder = i + 1)
    setServices(newServices)
  }

  if (loading) {
    return <div className="p-8">Lädt...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 mb-1 inline-block">
                ← Zurück zum Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Services verwalten</h1>
            </div>
            <button
              onClick={addNewService}
              className="px-4 py-2 bg-magenta text-white rounded-md hover:bg-magenta-700 transition-colors"
            >
              + Neuer Service
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`bg-white rounded-lg shadow-sm border ${
                !service.enabled ? 'border-gray-300 opacity-60' : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-30 rounded"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === services.length - 1}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-30 rounded"
                    >
                      ↓
                    </button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titel
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => updateService(service.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Slug (URL-Teil)
                        </label>
                        <input
                          type="text"
                          value={service.slug}
                          onChange={(e) => updateService(service.id, 'slug', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Domain / URL
                      </label>
                      <input
                        type="text"
                        value={service.domain}
                        onChange={(e) => updateService(service.id, 'domain', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                        placeholder="https://service-footprint.de"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kurzbeschreibung (Excerpt)
                      </label>
                      <textarea
                        value={service.excerpt}
                        onChange={(e) => updateService(service.id, 'excerpt', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={service.enabled}
                          onChange={(e) => updateService(service.id, 'enabled', e.target.checked)}
                          className="w-4 h-4 text-magenta focus:ring-magenta border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Service aktiviert (auf Website anzeigen)</span>
                      </label>

                      <div className="flex gap-2">
                        <Link
                          href={`/admin/apps/${service.slug}`}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Landing Page bearbeiten
                        </Link>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 mb-4">Noch keine Services vorhanden</p>
            <button
              onClick={addNewService}
              className="px-6 py-3 bg-magenta text-white rounded-md hover:bg-magenta-700"
            >
              Ersten Service hinzufügen
            </button>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={saveServices}
            disabled={saving}
            className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {saving ? 'Speichern...' : 'Alle Änderungen speichern'}
          </button>
        </div>
      </main>
    </div>
  )
}
