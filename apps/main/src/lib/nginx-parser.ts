import * as fs from 'fs'
import * as readline from 'readline'
import { UAParser } from 'ua-parser-js'

/**
 * Nginx Access Log Parser
 *
 * DSGVO-compliant server statistics:
 * - Anonymizes IPs (last octet set to 0)
 * - No personal data storage
 * - Only aggregated stats
 *
 * Log format: Combined (nginx default)
 * IP - - [timestamp] "METHOD /path HTTP/version" status bytes "referrer" "user-agent"
 */

export interface LogEntry {
  ip: string // Anonymized
  timestamp: Date
  method: string
  path: string
  status: number
  bytes: number
  referrer: string
  userAgent: string
  isBot: boolean
  isMobile: boolean
  browser?: string
  os?: string
}

export interface DashboardStats {
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

/**
 * Anonymize IP address (DSGVO-compliant)
 * Example: 192.168.1.123 → 192.168.1.0
 */
function anonymizeIP(ip: string): string {
  const parts = ip.split('.')
  if (parts.length === 4) {
    parts[3] = '0' // Set last octet to 0
    return parts.join('.')
  }
  // IPv6 - truncate last segment
  const v6parts = ip.split(':')
  if (v6parts.length > 1) {
    v6parts[v6parts.length - 1] = '0'
    return v6parts.join(':')
  }
  return ip
}

/**
 * Detect if user-agent is a bot
 */
function isBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /zgrab/i,
    /python-requests/i,
    /go-http-client/i,
    /curl/i,
    /wget/i,
    /monitoring/i,
    /scanner/i,
  ]
  return botPatterns.some(pattern => pattern.test(userAgent))
}

/**
 * Parse a single nginx log line
 * Format: IP - - [timestamp] "METHOD /path HTTP/version" status bytes "referrer" "user-agent"
 */
function parseLogLine(line: string): LogEntry | null {
  // Nginx combined log format regex
  const regex = /^(\S+) - - \[([^\]]+)\] "(\S+) (\S+) HTTP\/\S+" (\d+) (\d+) "([^"]*)" "([^"]*)"/
  const match = line.match(regex)

  if (!match) {
    return null // Invalid line
  }

  const [, ip, timestamp, method, path, status, bytes, referrer, userAgent] = match

  // Parse user-agent
  const parser = new UAParser(userAgent)
  const device = parser.getDevice()
  const browser = parser.getBrowser()
  const os = parser.getOS()

  return {
    ip: anonymizeIP(ip),
    timestamp: new Date(timestamp.replace(':', ' ')), // Convert to JS Date
    method,
    path,
    status: parseInt(status, 10),
    bytes: parseInt(bytes, 10),
    referrer: referrer === '-' ? '' : referrer,
    userAgent,
    isBot: isBot(userAgent),
    isMobile: device.type === 'mobile' || device.type === 'tablet',
    browser: browser.name,
    os: os.name,
  }
}

/**
 * Parse nginx access log file and generate stats
 * @param logPath Path to nginx access.log
 * @param since Filter entries since this date
 */
export async function parseNginxLogs(
  logPath: string = '/var/log/nginx/access.log',
  since?: Date
): Promise<DashboardStats> {
  const entries: LogEntry[] = []
  const uniqueIPs = new Set<string>()
  const pageCounts = new Map<string, number>()
  const statusCounts: Record<number, number> = {}
  const referrerCounts = new Map<string, number>()
  const hourlyCounts = new Map<string, number>()
  const error404Counts = new Map<string, number>()

  let totalHits = 0
  let botTraffic = 0
  let humanTraffic = 0
  let mobileHits = 0
  let desktopHits = 0

  // Check if file exists
  if (!fs.existsSync(logPath)) {
    console.warn(`Log file not found: ${logPath}`)
    return {
      totalHits: 0,
      uniqueIPs: 0,
      botTraffic: 0,
      humanTraffic: 0,
      topPages: [],
      statusCodes: {},
      deviceStats: { mobile: 0, desktop: 0 },
      referrers: [],
      hourlyStats: [],
      errors404: [],
    }
  }

  // Read file line by line (memory-efficient for large logs)
  const fileStream = fs.createReadStream(logPath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    const entry = parseLogLine(line)
    if (!entry) continue

    // Filter by date if specified
    if (since && entry.timestamp < since) continue

    totalHits++
    uniqueIPs.add(entry.ip)

    // Bot vs Human
    if (entry.isBot) {
      botTraffic++
    } else {
      humanTraffic++
    }

    // Device stats
    if (entry.isMobile) {
      mobileHits++
    } else {
      desktopHits++
    }

    // Page counts (exclude admin, api, static files)
    if (!entry.path.startsWith('/admin') &&
        !entry.path.startsWith('/api') &&
        !entry.path.startsWith('/_next') &&
        !entry.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
      pageCounts.set(entry.path, (pageCounts.get(entry.path) || 0) + 1)
    }

    // Status codes
    statusCounts[entry.status] = (statusCounts[entry.status] || 0) + 1

    // 404 errors
    if (entry.status === 404) {
      error404Counts.set(entry.path, (error404Counts.get(entry.path) || 0) + 1)
    }

    // Referrers (exclude empty and same-domain)
    if (entry.referrer &&
        !entry.referrer.includes('publicfootprint.de') &&
        !entry.referrer.includes('personal-footprint.de') &&
        !entry.referrer.includes('reference-footprint.de')) {
      referrerCounts.set(entry.referrer, (referrerCounts.get(entry.referrer) || 0) + 1)
    }

    // Hourly stats
    const hour = entry.timestamp.toISOString().substring(0, 13) // YYYY-MM-DDTHH
    hourlyCounts.set(hour, (hourlyCounts.get(hour) || 0) + 1)
  }

  // Sort and format results
  const topPages = Array.from(pageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, hits]) => ({ path, hits }))

  const topReferrers = Array.from(referrerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([referrer, hits]) => ({ referrer, hits }))

  const top404s = Array.from(error404Counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, hits]) => ({ path, hits }))

  const hourlyStats = Array.from(hourlyCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([hour, hits]) => ({ hour, hits }))

  return {
    totalHits,
    uniqueIPs: uniqueIPs.size,
    botTraffic,
    humanTraffic,
    topPages,
    statusCodes,
    deviceStats: { mobile: mobileHits, desktop: desktopHits },
    referrers: topReferrers,
    hourlyStats,
    errors404: top404s,
  }
}

/**
 * Helper: Get stats for specific time period
 */
export async function getStatsForPeriod(
  period: 'today' | 'yesterday' | '7days' | '30days',
  logPath?: string
): Promise<DashboardStats> {
  const now = new Date()
  let since: Date

  switch (period) {
    case 'today':
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'yesterday':
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      const until = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      // TODO: Filter between since and until
      break
    case '7days':
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30days':
      since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      since = new Date(0) // All time
  }

  return parseNginxLogs(logPath, since)
}
