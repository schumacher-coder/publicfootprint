'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt?: string; caption?: string }

interface AppContent {
  domain: string
  hero: {
    title: string
    subtitle: string
    description: string
    image?: string
  }
  sections: Array<{
    id: string
    title: string
    content: ContentBlock[]
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
              content: [{ type: 'text', content: 'Inhalt des ersten Abschnitts' }]
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

  // Section management
  const addSection = () => {
    if (!content) return
    setContent({
      ...content,
      sections: [
        ...(content.sections || []),
        {
          id: `section-${Date.now()}`,
          title: 'Neuer Abschnitt',
          content: [{ type: 'text', content: 'Inhalt des Abschnitts' }]
        }
      ]
    })
  }

  const updateSectionTitle = (sectionIndex: number, title: string) => {
    if (!content) return
    const newSections = [...(content.sections || [])]
    newSections[sectionIndex] = { ...newSections[sectionIndex], title }
    setContent({ ...content, sections: newSections })
  }

  const removeSection = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      sections: (content.sections || []).filter((_, i) => i !== index)
    })
  }

  // Content block management within sections
  const updateSectionBlock = (sectionIndex: number, blockIndex: number, block: ContentBlock) => {
    if (!content) return
    const newSections = [...(content.sections || [])]
    const newContent = [...(newSections[sectionIndex].content || [])]
    newContent[blockIndex] = block
    newSections[sectionIndex] = { ...newSections[sectionIndex], content: newContent }
    setContent({ ...content, sections: newSections })
  }

  const addSectionTextBlock = (sectionIndex: number) => {
    if (!content) return
    const newSections = [...(content.sections || [])]
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      content: [...(newSections[sectionIndex].content || []), { type: 'text', content: 'Neuer Absatz' }]
    }
    setContent({ ...content, sections: newSections })
  }

  const addSectionImageBlock = (sectionIndex: number) => {
    if (!content) return
    const newSections = [...(content.sections || [])]
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      content: [...(newSections[sectionIndex].content || []), { type: 'image', src: '', alt: '', caption: '' }]
    }
    setContent({ ...content, sections: newSections })
  }

  const removeSectionBlock = (sectionIndex: number, blockIndex: number) => {
    if (!content) return
    const newSections = [...(content.sections || [])]
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      content: (newSections[sectionIndex].content || []).filter((_, i) => i !== blockIndex)
    }
    setContent({ ...content, sections: newSections })
  }

  const moveSectionBlock = (sectionIndex: number, blockIndex: number, direction: 'up' | 'down') => {
    if (!content) return
    const newSections = [...(content.sections || [])]
    const newContent = [...(newSections[sectionIndex].content || [])]
    const targetIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1
    if (targetIndex < 0 || targetIndex >= newContent.length) return

    [newContent[blockIndex], newContent[targetIndex]] = [newContent[targetIndex], newContent[blockIndex]]
    newSections[sectionIndex] = { ...newSections[sectionIndex], content: newContent }
    setContent({ ...content, sections: newSections })
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero-Bild (optional)
                </label>
                <input
                  type="text"
                  value={content.hero.image || ''}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, image: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                  placeholder="/images/visuals/reference-hero.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Bildpfad z.B.: /images/visuals/hero-image.jpg oder /images/portraits/thomas.jpg
                </p>
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
              {(content.sections || []).map((section, sectionIndex) => (
                <div key={section.id} className="border-2 border-gray-300 rounded-lg p-5 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-600">Bereich {sectionIndex + 1}</span>
                    <button
                      onClick={() => removeSection(sectionIndex)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Bereich entfernen
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bereichs-Titel
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta bg-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inhalte
                    </label>
                    {(section.content || []).map((block, blockIndex) => (
                      <div key={blockIndex} className="p-4 border border-gray-200 rounded-md bg-white">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-medium text-gray-600">
                            {block.type === 'text' ? '📝 Text' : '🖼️ Bild'}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => moveSectionBlock(sectionIndex, blockIndex, 'up')}
                              disabled={blockIndex === 0}
                              className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveSectionBlock(sectionIndex, blockIndex, 'down')}
                              disabled={blockIndex === (section.content || []).length - 1}
                              className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => removeSectionBlock(sectionIndex, blockIndex)}
                              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        {block.type === 'text' ? (
                          <textarea
                            value={block.content}
                            onChange={(e) => updateSectionBlock(sectionIndex, blockIndex, { ...block, content: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta text-sm"
                            placeholder="Text hier eingeben... (Markdown wird unterstützt: **fett**)"
                          />
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={block.src}
                              onChange={(e) => updateSectionBlock(sectionIndex, blockIndex, { ...block, src: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta text-sm"
                              placeholder="Bildpfad: /images/visuals/beispiel.jpg"
                            />
                            <input
                              type="text"
                              value={block.alt || ''}
                              onChange={(e) => updateSectionBlock(sectionIndex, blockIndex, { ...block, alt: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta text-sm"
                              placeholder="Alt-Text (für Barrierefreiheit)"
                            />
                            <input
                              type="text"
                              value={block.caption || ''}
                              onChange={(e) => updateSectionBlock(sectionIndex, blockIndex, { ...block, caption: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta text-sm"
                              placeholder="Bildunterschrift (optional)"
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => addSectionTextBlock(sectionIndex)}
                        className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-md"
                      >
                        + Text hinzufügen
                      </button>
                      <button
                        onClick={() => addSectionImageBlock(sectionIndex)}
                        className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-md"
                      >
                        + Bild hinzufügen
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {(content.sections || []).length === 0 && (
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
