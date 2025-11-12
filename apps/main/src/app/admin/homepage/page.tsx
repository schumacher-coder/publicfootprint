'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Homepage {
  hero: {
    title: string
    backgroundImage?: string
    paragraphs: string[]
  }
  aboutSection: {
    title: string
    paragraphs: string[]
  }
  servicesSection: {
    title: string
  }
  ctaSection: {
    title: string
    description: string
    buttonText: string
  }
}

export default function AdminHomepage() {
  const [content, setContent] = useState<Homepage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/admin/homepage')
      const data = await response.json()
      setContent(data.content)
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
      const response = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        setMessage('✅ Homepage erfolgreich gespeichert!')
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

  const updateHeroParagraph = (index: number, value: string) => {
    if (!content) return
    const newParagraphs = [...content.hero.paragraphs]
    newParagraphs[index] = value
    setContent({
      ...content,
      hero: { ...content.hero, paragraphs: newParagraphs }
    })
  }

  const addHeroParagraph = () => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        paragraphs: [...content.hero.paragraphs, 'Neuer Absatz']
      }
    })
  }

  const removeHeroParagraph = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        paragraphs: content.hero.paragraphs.filter((_, i) => i !== index)
      }
    })
  }

  const updateAboutParagraph = (index: number, value: string) => {
    if (!content) return
    const newParagraphs = [...content.aboutSection.paragraphs]
    newParagraphs[index] = value
    setContent({
      ...content,
      aboutSection: { ...content.aboutSection, paragraphs: newParagraphs }
    })
  }

  if (loading || !content) {
    return <div className="p-8">Lädt...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 mb-1 inline-block">
            ← Zurück zum Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Homepage bearbeiten</h1>
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
                  Hintergrundbild (optional)
                </label>
                <input
                  type="text"
                  value={content.hero.backgroundImage || ''}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, backgroundImage: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                  placeholder="/images/visuals/hero-background.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Bildpfad z.B.: /images/visuals/hero-bg.jpg (leer lassen, wenn kein Bild)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Absätze
                </label>
                {content.hero.paragraphs.map((paragraph, index) => (
                  <div key={index} className="mb-3 flex gap-2">
                    <textarea
                      value={paragraph}
                      onChange={(e) => updateHeroParagraph(index, e.target.value)}
                      rows={3}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                      placeholder="Text hier eingeben... (Markdown wird unterstützt: **fett**)"
                    />
                    <button
                      onClick={() => removeHeroParagraph(index)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={addHeroParagraph}
                  className="mt-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  + Absatz hinzufügen
                </button>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Public Footprint Bereich</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.aboutSection.title}
                  onChange={(e) => setContent({
                    ...content,
                    aboutSection: { ...content.aboutSection, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Absätze
                </label>
                {content.aboutSection.paragraphs.map((paragraph, index) => (
                  <div key={index} className="mb-3">
                    <textarea
                      value={paragraph}
                      onChange={(e) => updateAboutParagraph(index, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Services-Bereich</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel
              </label>
              <input
                type="text"
                value={content.servicesSection.title}
                onChange={(e) => setContent({
                  ...content,
                  servicesSection: { title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
              />
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Call-to-Action Bereich</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.ctaSection.title}
                  onChange={(e) => setContent({
                    ...content,
                    ctaSection: { ...content.ctaSection, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschreibung
                </label>
                <textarea
                  value={content.ctaSection.description}
                  onChange={(e) => setContent({
                    ...content,
                    ctaSection: { ...content.ctaSection, description: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button-Text
                </label>
                <input
                  type="text"
                  value={content.ctaSection.buttonText}
                  onChange={(e) => setContent({
                    ...content,
                    ctaSection: { ...content.ctaSection, buttonText: e.target.value }
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
            {saving ? 'Speichern...' : 'Änderungen speichern'}
          </button>
        </div>
      </main>
    </div>
  )
}
