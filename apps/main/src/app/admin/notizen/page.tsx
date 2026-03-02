'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface NotizenEntry {
  id: string
  date: string
  content: string[]
  published: boolean
}

interface NotizenContent {
  hero: {
    title: string
    description: string
  }
  entries: NotizenEntry[]
  infoBox: {
    title: string
    paragraphs: string[]
    linkedinUrl: string
  }
}

export default function AdminNotizen() {
  const [content, setContent] = useState<NotizenContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false)
  const [previewMode, setPreviewMode] = useState<Record<string, boolean>>({})
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/admin/notizen')
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
      const response = await fetch('/api/admin/notizen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        setMessage('✅ Notizen erfolgreich gespeichert!')
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

  const addNewEntry = () => {
    if (!content) return
    const today = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    const newEntry: NotizenEntry = {
      id: `entry-${Date.now()}`,
      date: today,
      content: ['Neuer Notiz-Eintrag...'],
      published: false,
    }
    setContent({
      ...content,
      entries: [newEntry, ...(content.entries || [])]
    })
  }

  const updateEntry = (id: string, field: keyof NotizenEntry, value: any) => {
    if (!content) return
    setContent({
      ...content,
      entries: (content.entries || []).map(e => e.id === id ? { ...e, [field]: value } : e)
    })
  }

  const updateEntryContent = (id: string, index: number, value: string) => {
    if (!content) return
    setContent({
      ...content,
      entries: (content.entries || []).map(e => {
        if (e.id === id) {
          const newContent = [...e.content]
          newContent[index] = value
          return { ...e, content: newContent }
        }
        return e
      })
    })
  }

  const addParagraphToEntry = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      entries: (content.entries || []).map(e =>
        e.id === id ? { ...e, content: [...e.content, 'Neuer Absatz...'] } : e
      )
    })
  }

  const removeParagraphFromEntry = (id: string, index: number) => {
    if (!content) return
    setContent({
      ...content,
      entries: (content.entries || []).map(e => {
        if (e.id === id) {
          return { ...e, content: e.content.filter((_, i) => i !== index) }
        }
        return e
      })
    })
  }

  const deleteEntry = (id: string) => {
    if (!content) return
    if (confirm('Notiz wirklich löschen?')) {
      setContent({
        ...content,
        entries: (content.entries || []).filter(e => e.id !== id)
      })
    }
  }

  const moveEntryUp = (index: number) => {
    if (!content || index === 0) return
    const newEntries = [...(content.entries || [])]
    ;[newEntries[index - 1], newEntries[index]] = [newEntries[index], newEntries[index - 1]]
    setContent({ ...content, entries: newEntries })
  }

  const moveEntryDown = (index: number) => {
    if (!content || index === (content.entries || []).length - 1) return
    const newEntries = [...(content.entries || [])]
    ;[newEntries[index], newEntries[index + 1]] = [newEntries[index + 1], newEntries[index]]
    setContent({ ...content, entries: newEntries })
  }

  const handleImageUpload = async (entryId: string, paragraphIndex: number, file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()

      // Insert Markdown image syntax at cursor position or end of paragraph
      const entry = content?.entries.find(e => e.id === entryId)
      if (entry) {
        const currentContent = entry.content[paragraphIndex] || ''
        const imageMarkdown = `![Bild](${data.url})`
        const newContent = currentContent ? `${currentContent}\n\n${imageMarkdown}` : imageMarkdown

        updateEntryContent(entryId, paragraphIndex, newContent)
        setMessage(`✅ Bild hochgeladen: ${data.filename}`)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage(`❌ Upload-Fehler: ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Notizen verwalten</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('✅') ? 'bg-green-50 border border-green-200' :
            message.includes('❌') ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            {message}
          </div>
        )}

        {uploading && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            📤 Bild wird hochgeladen...
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

          {/* Entries */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Notizen</h2>
                <p className="text-sm text-gray-600 mt-1">
                  ✨ Markdown-Formatierung wird unterstützt
                  <button
                    onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    {showMarkdownHelp ? 'Hilfe ausblenden' : 'Markdown-Hilfe'}
                  </button>
                </p>
              </div>
              <button
                onClick={addNewEntry}
                className="px-4 py-2 bg-magenta text-white rounded-md hover:bg-magenta-700"
              >
                + Neue Notiz
              </button>
            </div>

            {/* Markdown Help */}
            {showMarkdownHelp && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <h3 className="font-semibold mb-2">Markdown-Formatierung</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><code>**fett**</code> → <strong>fett</strong></p>
                    <p><code>*kursiv*</code> → <em>kursiv</em></p>
                    <p><code>[Link](url)</code> → Link</p>
                  </div>
                  <div>
                    <p><code># Überschrift</code> → H1</p>
                    <p><code>## Überschrift</code> → H2</p>
                    <p><code>- Liste</code> → Aufzählung</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-300">
                  <p className="font-semibold">📷 Bilder hochladen:</p>
                  <p>Klicke auf den 📷-Button neben dem Absatz, um ein Bild hochzuladen.</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Der Markdown-Code <code>![Bild](url)</code> wird automatisch eingefügt.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {(content.entries || []).map((entry, index) => (
                <div
                  key={entry.id}
                  className={`border rounded-lg p-4 ${
                    !entry.published ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => moveEntryUp(index)}
                        disabled={index === 0}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-30 rounded"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveEntryDown(index)}
                        disabled={index === (content.entries || []).length - 1}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-30 rounded"
                      >
                        ↓
                      </button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Datum
                          </label>
                          <input
                            type="text"
                            value={entry.date}
                            onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                            placeholder="DD.MM.YYYY"
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={entry.published}
                              onChange={(e) => updateEntry(entry.id, 'published', e.target.checked)}
                              className="w-4 h-4 text-magenta focus:ring-magenta border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">Veröffentlicht</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Absätze (Markdown)
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setPreviewMode({
                                ...previewMode,
                                [entry.id]: !previewMode[entry.id]
                              })}
                              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                            >
                              {previewMode[entry.id] ? '📝 Bearbeiten' : '👁️ Vorschau'}
                            </button>
                          </div>
                        </div>
                        {entry.content.map((paragraph, pIndex) => (
                          <div key={pIndex} className="mb-3">
                            <div className="flex gap-2">
                              {!previewMode[entry.id] ? (
                                <textarea
                                  value={paragraph}
                                  onChange={(e) => updateEntryContent(entry.id, pIndex, e.target.value)}
                                  rows={3}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta font-mono text-sm"
                                  placeholder="Text mit Markdown-Formatierung..."
                                />
                              ) : (
                                <div className="flex-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 prose prose-sm max-w-none">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {paragraph}
                                  </ReactMarkdown>
                                </div>
                              )}
                              <div className="flex flex-col gap-1">
                                <label
                                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded cursor-pointer text-center"
                                  title="Bild hochladen"
                                >
                                  📷
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploading}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        handleImageUpload(entry.id, pIndex, file)
                                      }
                                    }}
                                  />
                                </label>
                                <button
                                  onClick={() => removeParagraphFromEntry(entry.id, pIndex)}
                                  className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                                  title="Absatz löschen"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addParagraphToEntry(entry.id)}
                          className="mt-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                          + Absatz hinzufügen
                        </button>
                      </div>

                      <div className="flex justify-end pt-4 border-t">
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Notiz löschen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(content.entries || []).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Noch keine Notizen vorhanden
                </p>
              )}
            </div>
          </section>

          {/* Info Box */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Info-Box</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.infoBox.title}
                  onChange={(e) => setContent({
                    ...content,
                    infoBox: { ...content.infoBox, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  value={content.infoBox.linkedinUrl}
                  onChange={(e) => setContent({
                    ...content,
                    infoBox: { ...content.infoBox, linkedinUrl: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Absätze
                </label>
                {content.infoBox.paragraphs.map((paragraph, index) => (
                  <textarea
                    key={index}
                    value={paragraph}
                    onChange={(e) => {
                      const newParagraphs = [...content.infoBox.paragraphs]
                      newParagraphs[index] = e.target.value
                      setContent({
                        ...content,
                        infoBox: { ...content.infoBox, paragraphs: newParagraphs }
                      })
                    }}
                    rows={3}
                    className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-magenta"
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Link
            href="/notizen"
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
