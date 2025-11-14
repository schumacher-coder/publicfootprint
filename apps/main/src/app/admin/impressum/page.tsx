'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt?: string; caption?: string }

interface ImpressumContent {
  title: string
  content: ContentBlock[]
}

export default function AdminImpressum() {
  const [content, setContent] = useState<ImpressumContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/admin/impressum')
      const data = await response.json()
      setContent(data)
    } catch (error) {
      setMessage('Fehler beim Laden')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content) return

    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/impressum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        setMessage('✓ Gespeichert')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Fehler beim Speichern')
      }
    } catch (error) {
      setMessage('Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const addTextBlock = () => {
    if (!content) return
    setContent({
      ...content,
      content: [...content.content, { type: 'text', content: 'Neuer Absatz' }]
    })
  }

  const addImageBlock = () => {
    if (!content) return
    setContent({
      ...content,
      content: [...content.content, { type: 'image', src: '', alt: '', caption: '' }]
    })
  }

  const updateBlock = (index: number, block: ContentBlock) => {
    if (!content) return
    const newContent = [...content.content]
    newContent[index] = block
    setContent({ ...content, content: newContent })
  }

  const moveBlockUp = (index: number) => {
    if (!content || index === 0) return
    const newContent = [...content.content]
    ;[newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]]
    setContent({ ...content, content: newContent })
  }

  const moveBlockDown = (index: number) => {
    if (!content || index === content.content.length - 1) return
    const newContent = [...content.content]
    ;[newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]]
    setContent({ ...content, content: newContent })
  }

  const deleteBlock = (index: number) => {
    if (!content) return
    const newContent = content.content.filter((_, i) => i !== index)
    setContent({ ...content, content: newContent })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">Laden...</div>
      </div>
    )
  }

  if (!content) return null

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-magenta hover:text-magenta-600 mb-2 inline-block">
              ← Zurück zum Admin
            </Link>
            <h1 className="text-3xl font-light">Impressum bearbeiten</h1>
          </div>
          <div className="flex items-center gap-4">
            {message && (
              <span className={message.includes('✓') ? 'text-green-600' : 'text-red-600'}>
                {message}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Speichern...' : 'Speichern'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seitentitel
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-magenta focus:border-magenta"
            />
          </div>

          {/* Content Blocks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Inhalt
              </label>
              <div className="flex gap-2">
                <button
                  onClick={addTextBlock}
                  className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  + Text hinzufügen
                </button>
                <button
                  onClick={addImageBlock}
                  className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  + Bild hinzufügen
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {content.content.map((block, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      {block.type === 'text' ? '📝 Text-Block' : '🖼️ Bild-Block'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveBlockUp(index)}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Nach oben"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveBlockDown(index)}
                        disabled={index === content.content.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Nach unten"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => deleteBlock(index)}
                        className="text-red-400 hover:text-red-600"
                        title="Löschen"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {block.type === 'text' ? (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(index, { ...block, content: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-magenta focus:border-magenta font-mono text-sm"
                      placeholder="Text (Markdown unterstützt: **fett**, ## Überschrift, etc.)"
                    />
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={block.src}
                        onChange={(e) => updateBlock(index, { ...block, src: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-magenta focus:border-magenta"
                        placeholder="Bild-URL (z.B. /images/foto.jpg)"
                      />
                      <input
                        type="text"
                        value={block.alt || ''}
                        onChange={(e) => updateBlock(index, { ...block, alt: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-magenta focus:border-magenta"
                        placeholder="Alt-Text (für Barrierefreiheit)"
                      />
                      <input
                        type="text"
                        value={block.caption || ''}
                        onChange={(e) => updateBlock(index, { ...block, caption: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-magenta focus:border-magenta"
                        placeholder="Bildunterschrift (optional)"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
