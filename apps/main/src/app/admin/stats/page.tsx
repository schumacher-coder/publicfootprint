'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DashboardStats {
  totalHits: number
  uniqueIPs: number
  botTraffic: number
  humanTraffic: number
  topPages: Array<{ path: string; hits: number }>
  statusCodes: Record<number, number>
  deviceStats: { mobile: number; desktop: number }
  referrers: Array<{ referrer: string; hits: number }>
  hourlyStats: Array<{ hour: string; hits: number }>
  errors404: Array<{ path: string; hits: number }>
}

type Period = 'today' | 'yesterday' | '7days' | '30days'

const COLORS = {
  primary: '#2563eb', // blue-600
  success: '#16a34a', // green-600
  warning: '#ea580c', // orange-600
  danger: '#dc2626', // red-600
  purple: '#9333ea', // purple-600
  teal: '#0d9488', // teal-600
}

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>('today')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/stats?period=${period}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      console.error('Stats fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Server Statistiken</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-500">Lade Daten...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Server Statistiken</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Fehler beim Laden der Statistiken</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-600 mt-4">
            Hinweis: Das Log-Parsing funktioniert nur auf dem Server mit Zugriff auf /var/log/nginx/access.log
          </p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  // Prepare chart data
  const trafficData = [
    { name: 'Menschen', value: stats.humanTraffic, color: COLORS.success },
    { name: 'Bots', value: stats.botTraffic, color: COLORS.warning },
  ]

  const deviceData = [
    { name: 'Desktop', value: stats.deviceStats.desktop, color: COLORS.primary },
    { name: 'Mobile', value: stats.deviceStats.mobile, color: COLORS.purple },
  ]

  const statusData = Object.entries(stats.statusCodes).map(([status, count]) => ({
    status: `HTTP ${status}`,
    count,
    color: status.startsWith('2') ? COLORS.success :
           status.startsWith('3') ? COLORS.primary :
           status.startsWith('4') ? COLORS.warning :
           COLORS.danger,
  }))

  // Format hourly stats for chart (last 24 hours or available)
  const hourlyData = stats.hourlyStats.slice(-24).map(stat => ({
    hour: new Date(stat.hour).toLocaleString('de-DE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
    }),
    hits: stat.hits,
  }))

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">📊 Server Statistiken</h1>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(['today', 'yesterday', '7days', '30days'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded transition ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {p === 'today' ? 'Heute' :
               p === 'yesterday' ? 'Gestern' :
               p === '7days' ? '7 Tage' :
               '30 Tage'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Gesamt-Aufrufe"
          value={stats.totalHits.toLocaleString('de-DE')}
          color="bg-blue-500"
          icon="📈"
        />
        <StatCard
          title="Unique Visitors"
          value={stats.uniqueIPs.toLocaleString('de-DE')}
          color="bg-purple-500"
          icon="👥"
        />
        <StatCard
          title="Menschlicher Traffic"
          value={stats.humanTraffic.toLocaleString('de-DE')}
          subtitle={`${Math.round((stats.humanTraffic / stats.totalHits) * 100)}%`}
          color="bg-green-500"
          icon="✅"
        />
        <StatCard
          title="Bot Traffic"
          value={stats.botTraffic.toLocaleString('de-DE')}
          subtitle={`${Math.round((stats.botTraffic / stats.totalHits) * 100)}%`}
          color="bg-orange-500"
          icon="🤖"
        />
      </div>

      {/* Charts Row 1: Traffic & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bot vs Human Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bot vs. Menschlicher Traffic</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Device Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Geräte-Verteilung</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Traffic Chart */}
      {hourlyData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Zeitverlauf (Stündlich)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="hits"
                stroke={COLORS.primary}
                strokeWidth={2}
                name="Zugriffe"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Status Codes */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">HTTP Status Codes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Anzahl">
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📄 Top Seiten</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Pfad</th>
                  <th className="text-right py-2">Aufrufe</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPages.map((page, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-mono text-sm">{page.path}</td>
                    <td className="text-right py-2">{page.hits.toLocaleString('de-DE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🔗 Top Referrer</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Quelle</th>
                  <th className="text-right py-2">Aufrufe</th>
                </tr>
              </thead>
              <tbody>
                {stats.referrers.length > 0 ? (
                  stats.referrers.map((ref, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 text-sm truncate max-w-xs">{ref.referrer}</td>
                      <td className="text-right py-2">{ref.hits.toLocaleString('de-DE')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-4 text-gray-500">
                      Keine externen Referrer
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 404 Errors */}
      {stats.errors404.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">⚠️ Top 404 Fehler</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Pfad</th>
                  <th className="text-right py-2">Anzahl</th>
                </tr>
              </thead>
              <tbody>
                {stats.errors404.map((error, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-mono text-sm text-red-600">{error.path}</td>
                    <td className="text-right py-2">{error.hits.toLocaleString('de-DE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>🔒 Datenschutz:</strong> Alle Statistiken sind DSGVO-konform.
          IPs werden anonymisiert (letztes Oktett = 0), keine vollständigen IP-Adressen gespeichert.
          Nur aggregierte Server-Log-Daten, kein User-Tracking, keine Cookies.
        </p>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  color,
  icon,
}: {
  title: string
  value: string
  subtitle?: string
  color: string
  icon: string
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <div className={`text-3xl font-bold ${color.replace('bg-', 'text-')}`}>
          {value}
        </div>
        {subtitle && (
          <div className="text-sm text-gray-500">{subtitle}</div>
        )}
      </div>
    </div>
  )
}
