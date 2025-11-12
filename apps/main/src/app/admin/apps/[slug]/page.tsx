'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface AppContent {
  domain: string
  hero: {
    title: string
    subtitle: string
    description: string
  }
  sections: Array<{
    id: string
    title: string
    content: string
  }>
  cta: {
    title: string
    buttonText: string
    buttonLink: string
  }
}

export default function AdminAppEditor() {
  const params = useParams()
  const slug = params.slug as string

  const [content, setContent] = useState<AppContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    loadContent()
  }, [slug])

  const loadContent = async () => {
    try {
      const response = await fetch(`/api/admin/apps/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setContent(data.content)
      } else if (response.status === 404) {
        // Create new app content
        setIsNew(true)
        setContent({
          domain: `${slug}.de`,
          hero: {
            title: 'Neuer Service',
            subtitle: 'Untertitel',
            description: 'Beschreibung des Services'
          },
          sections: [
            {
              id: 'intro',
              title: 'Einführung',
              content: 'Inhalt des ersten Abschnitts'
            }
          ],
          cta: {
            title: 'Call-to-Action Titel',
            buttonText: 'Jetzt Kontakt aufnehmen',
            buttonLink: 'https://publicfootprint.de/kontakt'
          }
        })
      }
    } catch (error) {
      setMessage('Fehler beim Laden')
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(`/api/admin/apps/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, isNew }),
      })

      if (response.ok) {
        setMessage('✅ Landing Page erfolgreich gespeichert!')
        setIsNew(false)
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

  const addSection = () => {
    if (!content) return
    setContent({
      ...content,
      sections: [
        ...content.sections,
        {
          id: `section-${Date.now()}`,
          title: 'Neuer Abschnitt',
          content: 'Inhalt des Abschnitts'
        }
      ]
    })
  }

  const updateSection = (index: number, field: 'title' | 'content', value: string) => {
    if (!content) return
    const newSections = [...content.sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setContent({ ...content, sections: newSections })
  }

  const removeSection = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      sections: content.sections.filter((_, i) => i !== index)
    })
  }

  if (loading || !content) {
    return <div className="p-8">Lädt...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin/apps" className="text-sm text-gray-600 hover:text-gray-900 mb-1 inline-block">
            ← Zurück zur Übersicht
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Landing Page: {slug}
            {isNew && <span className="text-sm text-green-600 ml-2">(Neu)</span>}
          </h1>
          <p className="text-sm text-gray-600">{content.domain}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Hero Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hero-Bereich</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>
                <input
                  type="text"
                  value={content.domain}
                  onChange={(e) => setContent({ ...content, domain: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Untertitel
                </label>
                <input
                  type="text"
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschreibung
                </label>
                <textarea
                  value={content.hero.description}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, description: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Inhaltsbereiche</h2>
              <button
                onClick={addSection}
                className="px-4 py-2 text-sm bg-magenta text-white rounded-md hover:bg-magenta-700"
              >
                + Bereich hinzufügen
              </button>
            </div>

            <div className="space-y-6">
              {content.sections.map((section, index) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm text-gray-500">Bereich {index + 1}</span>
                    <button
                      onClick={() => removeSection(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Entfernen
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titel
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inhalt
                      </label>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {content.sections.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Noch keine Inhaltsbereiche vorhanden
                </p>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Call-to-Action</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.cta.title}
                  onChange={(e) => setContent({
                    ...content,
                    cta: { ...content.cta, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button-Text
                </label>
                <input
                  type="text"
                  value={content.cta.buttonText}
                  onChange={(e) => setContent({
                    ...content,
                    cta: { ...content.cta, buttonText: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button-Link
                </label>
                <input
                  type="text"
                  value={content.cta.buttonLink}
                  onChange={(e) => setContent({
                    ...content,
                    cta: { ...content.cta, buttonLink: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={saveContent}
            disabled={saving}
            className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {saving ? 'Speichern...' : isNew ? 'Landing Page erstellen' : 'Änderungen speichern'}
          </button>
        </div>
      </main>
    </div>
  )
}
