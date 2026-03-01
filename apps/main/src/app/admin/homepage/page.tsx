'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt?: string; caption?: string }

interface Homepage {
  hero: {
    title: string
    logo?: string
    backgroundImage?: string  // Deprecated, for backwards compatibility
    backgroundImages?: string[]  // Carousel images
    content?: ContentBlock[]
  }
  mainContent: {
    title: string
    content: ContentBlock[]
  }
  servicesSection: {
    title: string
    description: string
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

  // Carousel image functions
  const addCarouselImage = () => {
    if (!content) return
    const images = content.hero.backgroundImages || []
    setContent({
      ...content,
      hero: {
        ...content.hero,
        backgroundImages: [...images, '/images/visuals/']
      }
    })
  }

  const updateCarouselImage = (index: number, value: string) => {
    if (!content) return
    const images = [...(content.hero.backgroundImages || [])]
    images[index] = value
    setContent({
      ...content,
      hero: { ...content.hero, backgroundImages: images }
    })
  }

  const removeCarouselImage = (index: number) => {
    if (!content) return
    const images = content.hero.backgroundImages || []
    setContent({
      ...content,
      hero: {
        ...content.hero,
        backgroundImages: images.filter((_, i) => i !== index)
      }
    })
  }

  const moveCarouselImage = (index: number, direction: 'up' | 'down') => {
    if (!content) return
    const images = [...(content.hero.backgroundImages || [])]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= images.length) return

    [images[index], images[targetIndex]] = [images[targetIndex], images[index]]
    setContent({
      ...content,
      hero: { ...content.hero, backgroundImages: images }
    })
  }

  // Hero content block functions
  const updateHeroBlock = (index: number, block: ContentBlock) => {
    if (!content) return
    const newContent = [...(content.hero.content || [])]
    newContent[index] = block
    setContent({
      ...content,
      hero: { ...content.hero, content: newContent }
    })
  }

  const addHeroTextBlock = () => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        content: [...(content.hero.content || []), { type: 'text', content: 'Neuer Absatz' }]
      }
    })
  }

  const addHeroImageBlock = () => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        content: [...(content.hero.content || []), { type: 'image', src: '', alt: '', caption: '' }]
      }
    })
  }

  const removeHeroBlock = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        content: (content.hero.content || []).filter((_, i) => i !== index)
      }
    })
  }

  const moveHeroBlock = (index: number, direction: 'up' | 'down') => {
    if (!content) return
    const newContent = [...(content.hero.content || [])]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newContent.length) return

    [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]]
    setContent({
      ...content,
      hero: { ...content.hero, content: newContent }
    })
  }

  // Main content block functions
  const updateMainBlock = (index: number, block: ContentBlock) => {
    if (!content) return
    const newContent = [...content.mainContent.content]
    newContent[index] = block
    setContent({
      ...content,
      mainContent: { ...content.mainContent, content: newContent }
    })
  }

  const addMainTextBlock = () => {
    if (!content) return
    setContent({
      ...content,
      mainContent: {
        ...content.mainContent,
        content: [...content.mainContent.content, { type: 'text', content: 'Neuer Absatz' }]
      }
    })
  }

  const addMainImageBlock = () => {
    if (!content) return
    setContent({
      ...content,
      mainContent: {
        ...content.mainContent,
        content: [...content.mainContent.content, { type: 'image', src: '', alt: '', caption: '' }]
      }
    })
  }

  const removeMainBlock = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      mainContent: {
        ...content.mainContent,
        content: content.mainContent.content.filter((_, i) => i !== index)
      }
    })
  }

  const moveMainBlock = (index: number, direction: 'up' | 'down') => {
    if (!content) return
    const newContent = [...content.mainContent.content]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newContent.length) return

    [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]]
    setContent({
      ...content,
      mainContent: { ...content.mainContent, content: newContent }
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
                  Logo (optional)
                </label>
                <input
                  type="text"
                  value={content.hero.logo || ''}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, logo: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                  placeholder="/images/logos/public-footprint-logo.png"
                />
              </div>

              {/* Carousel Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🎠 Karussell-Bilder
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Füge mehrere Hintergrundbilder hinzu, die im Hero-Bereich als Karussell angezeigt werden.
                </p>

                {(content.hero.backgroundImages || []).map((image, index) => (
                  <div key={index} className="mb-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => updateCarouselImage(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                        placeholder="/images/visuals/hero-bg.jpg"
                      />
                      <button
                        onClick={() => moveCarouselImage(index, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Nach oben"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveCarouselImage(index, 'down')}
                        disabled={index === (content.hero.backgroundImages || []).length - 1}
                        className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Nach unten"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeCarouselImage(index)}
                        className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        title="Entfernen"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addCarouselImage}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  + Bild hinzufügen
                </button>
              </div>

              {/* Hero Content (optional - for backwards compatibility) */}
              {(content.hero.content && content.hero.content.length > 0) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Inhalte (optional, wird normalerweise nicht verwendet)
                  </label>
                  {content.hero.content.map((block, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-600">
                          {block.type === 'text' ? '📝 Text' : '🖼️ Bild'}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveHeroBlock(index, 'up')}
                            disabled={index === 0}
                            className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveHeroBlock(index, 'down')}
                            disabled={index === (content.hero.content || []).length - 1}
                            className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => removeHeroBlock(index)}
                            className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      {block.type === 'text' ? (
                        <textarea
                          value={block.content}
                          onChange={(e) => updateHeroBlock(index, { ...block, content: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                          placeholder="Text hier eingeben... (Markdown wird unterstützt: **fett**)"
                        />
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.src}
                            onChange={(e) => updateHeroBlock(index, { ...block, src: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                            placeholder="Bildpfad: /images/visuals/beispiel.jpg"
                          />
                          <input
                            type="text"
                            value={block.alt || ''}
                            onChange={(e) => updateHeroBlock(index, { ...block, alt: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                            placeholder="Alt-Text (für Barrierefreiheit)"
                          />
                          <input
                            type="text"
                            value={block.caption || ''}
                            onChange={(e) => updateHeroBlock(index, { ...block, caption: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                            placeholder="Bildunterschrift (optional)"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={addHeroTextBlock}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      + Text hinzufügen
                    </button>
                    <button
                      onClick={addHeroImageBlock}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      + Bild hinzufügen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Main Content Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hauptinhalt</h2>
            <p className="text-sm text-gray-600 mb-4">
              Dieser Bereich erscheint zwischen "Was ist Ihre Story?" und "Unsere Footprints"
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.mainContent.title}
                  onChange={(e) => setContent({
                    ...content,
                    mainContent: { ...content.mainContent, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Inhalte
                </label>
                {content.mainContent.content.map((block, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-600">
                        {block.type === 'text' ? '📝 Text' : '🖼️ Bild'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveMainBlock(index, 'up')}
                          disabled={index === 0}
                          className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveMainBlock(index, 'down')}
                          disabled={index === content.mainContent.content.length - 1}
                          className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeMainBlock(index)}
                          className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {block.type === 'text' ? (
                      <textarea
                        value={block.content}
                        onChange={(e) => updateMainBlock(index, { ...block, content: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                        placeholder="Text hier eingeben... (Markdown wird unterstützt: **fett**)"
                      />
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={block.src}
                          onChange={(e) => updateMainBlock(index, { ...block, src: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                          placeholder="Bildpfad: /images/visuals/beispiel.jpg"
                        />
                        <input
                          type="text"
                          value={block.alt || ''}
                          onChange={(e) => updateMainBlock(index, { ...block, alt: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                          placeholder="Alt-Text (für Barrierefreiheit)"
                        />
                        <input
                          type="text"
                          value={block.caption || ''}
                          onChange={(e) => updateMainBlock(index, { ...block, caption: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                          placeholder="Bildunterschrift (optional)"
                        />
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={addMainTextBlock}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    + Text hinzufügen
                  </button>
                  <button
                    onClick={addMainImageBlock}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    + Bild hinzufügen
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Services-Bereich</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.servicesSection.title}
                  onChange={(e) => setContent({
                    ...content,
                    servicesSection: { ...content.servicesSection, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschreibung
                </label>
                <textarea
                  value={content.servicesSection.description}
                  onChange={(e) => setContent({
                    ...content,
                    servicesSection: { ...content.servicesSection, description: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                  placeholder="Text unterhalb des Titels..."
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
