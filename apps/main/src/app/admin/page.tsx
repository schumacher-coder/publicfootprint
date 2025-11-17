'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface GitStatus {
  hasChanges: boolean
  changes: string[]
  count: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  // Load git status
  const loadGitStatus = async () => {
    try {
      const res = await fetch('/api/admin/git-sync')
      const data = await res.json()
      setGitStatus(data)
    } catch (error) {
      console.error('Error loading git status:', error)
    }
  }

  // Push to GitHub
  const handlePush = async () => {
    setSyncing(true)
    setSyncMessage(null)
    try {
      const res = await fetch('/api/admin/git-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'push' })
      })
      const result = await res.json()

      if (result.success) {
        setSyncMessage({ type: 'success', text: result.message })
        loadGitStatus() // Refresh status
      } else {
        setSyncMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setSyncMessage({ type: 'error', text: 'Fehler beim Push zu GitHub' })
    } finally {
      setSyncing(false)
    }
  }

  // Pull from GitHub
  const handlePull = async () => {
    setSyncing(true)
    setSyncMessage(null)
    try {
      const res = await fetch('/api/admin/git-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pull' })
      })
      const result = await res.json()

      if (result.success) {
        setSyncMessage({ type: 'success', text: result.message })
        loadGitStatus() // Refresh status
        // Reload page to show updated content
        if (result.message.includes('geladen')) {
          setTimeout(() => window.location.reload(), 1500)
        }
      } else {
        setSyncMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setSyncMessage({ type: 'error', text: 'Fehler beim Pull von GitHub' })
    } finally {
      setSyncing(false)
    }
  }

  // Load git status on mount
  useEffect(() => {
    loadGitStatus()
  }, [])

  const sections = [
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
        {/* Git Sync Section */}
        <div className="mb-8 bg-gradient-to-r from-magenta-50 to-magenta-100 border border-magenta-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔄</span>
                <h3 className="text-lg font-semibold text-gray-900">
                  GitHub Synchronisation
                </h3>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Änderungen zu GitHub pushen oder von GitHub pullen
              </p>

              {/* Git Status */}
              {gitStatus && (
                <div className="mb-4">
                  {gitStatus.hasChanges ? (
                    <div className="text-sm">
                      <p className="text-amber-700 font-medium mb-1">
                        ⚠️ {gitStatus.count} Datei(en) geändert:
                      </p>
                      <ul className="text-gray-600 space-y-0.5 ml-4">
                        {gitStatus.changes.slice(0, 5).map((file, idx) => (
                          <li key={idx} className="font-mono text-xs">• {file}</li>
                        ))}
                        {gitStatus.count > 5 && (
                          <li className="text-xs text-gray-500">... und {gitStatus.count - 5} weitere</li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-green-700 text-sm font-medium">
                      ✅ Alle Änderungen sind auf GitHub
                    </p>
                  )}
                </div>
              )}

              {/* Sync Message */}
              {syncMessage && (
                <div
                  className={`text-sm p-3 rounded mb-4 ${
                    syncMessage.type === 'success'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {syncMessage.text}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={handlePull}
                disabled={syncing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Änderungen von GitHub laden"
              >
                {syncing ? '⏳' : '⬇️'} Pull
              </button>
              <button
                onClick={handlePush}
                disabled={syncing || !gitStatus?.hasChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-magenta-600 rounded-md hover:bg-magenta-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Änderungen zu GitHub pushen"
              >
                {syncing ? '⏳' : '⬆️'} Push
              </button>
            </div>
          </div>
        </div>

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
