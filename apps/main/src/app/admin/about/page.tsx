'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AboutContent {
  hero: {
    title: string
    subtitle: string
  }
  companyStory: {
    paragraphs: string[]
  }
  thomasBio: {
    title: string
    image: string
    paragraphs: string[]
    mantra: {
      intro: string
      quote: string
    }
  }
  timeline: Array<{
    year: string
    title: string
    description: string
  }>
}

export default function AdminAbout() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/admin/about')
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
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        setMessage('✅ About-Seite erfolgreich gespeichert!')
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

  const updateCompanyParagraph = (index: number, value: string) => {
    if (!content) return
    const newParagraphs = [...content.companyStory.paragraphs]
    newParagraphs[index] = value
    setContent({
      ...content,
      companyStory: { paragraphs: newParagraphs }
    })
  }

  const updateBioParagraph = (index: number, value: string) => {
    if (!content) return
    const newParagraphs = [...content.thomasBio.paragraphs]
    newParagraphs[index] = value
    setContent({
      ...content,
      thomasBio: { ...content.thomasBio, paragraphs: newParagraphs }
    })
  }

  const updateTimelineItem = (index: number, field: 'year' | 'title' | 'description', value: string) => {
    if (!content) return
    const newTimeline = [...content.timeline]
    newTimeline[index] = { ...newTimeline[index], [field]: value }
    setContent({ ...content, timeline: newTimeline })
  }

  const addTimelineItem = () => {
    if (!content) return
    setContent({
      ...content,
      timeline: [...content.timeline, {
        year: '2025',
        title: 'Neuer Meilenstein',
        description: 'Beschreibung'
      }]
    })
  }

  const removeTimelineItem = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      timeline: content.timeline.filter((_, i) => i !== index)
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
          <h1 className="text-2xl font-bold text-gray-900">About-Seite bearbeiten</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Hero */}
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
            </div>
          </section>

          {/* Company Story */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Unternehmensgeschichte</h2>
            <div className="space-y-4">
              {content.companyStory.paragraphs.map((paragraph, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Absatz {index + 1}
                  </label>
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateCompanyParagraph(index, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                    placeholder="Markdown wird unterstützt: **fett**"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Thomas Bio */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thomas Bio</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.thomasBio.title}
                  onChange={(e) => setContent({
                    ...content,
                    thomasBio: { ...content.thomasBio, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porträtbild
                </label>
                <input
                  type="text"
                  value={content.thomasBio.image}
                  onChange={(e) => setContent({
                    ...content,
                    thomasBio: { ...content.thomasBio, image: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                  placeholder="/images/portraits/thomas-krings.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Bildpfad z.B.: /images/portraits/thomas.jpg
                </p>
              </div>

              {content.thomasBio.paragraphs.map((paragraph, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Absatz {index + 1}
                  </label>
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateBioParagraph(index, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                    placeholder="Markdown wird unterstützt: **fett**"
                  />
                </div>
              ))}

              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mantra Einleitung
                </label>
                <input
                  type="text"
                  value={content.thomasBio.mantra.intro}
                  onChange={(e) => setContent({
                    ...content,
                    thomasBio: {
                      ...content.thomasBio,
                      mantra: { ...content.thomasBio.mantra, intro: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta mb-4"
                />

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mantra Zitat
                </label>
                <textarea
                  value={content.thomasBio.mantra.quote}
                  onChange={(e) => setContent({
                    ...content,
                    thomasBio: {
                      ...content.thomasBio,
                      mantra: { ...content.thomasBio.mantra, quote: e.target.value }
                    }
                  })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
              <button
                onClick={addTimelineItem}
                className="px-4 py-2 bg-magenta text-white rounded-md hover:bg-magenta-700 text-sm"
              >
                + Meilenstein hinzufügen
              </button>
            </div>

            <div className="space-y-4">
              {content.timeline.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm text-gray-500">Meilenstein {index + 1}</span>
                    <button
                      onClick={() => removeTimelineItem(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Entfernen
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jahr
                      </label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titel
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Beschreibung
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Link
            href="/about"
            target="_blank"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Vorschau ansehen
          </Link>
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
