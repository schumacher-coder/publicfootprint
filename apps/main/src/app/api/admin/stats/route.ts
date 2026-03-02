import { NextRequest, NextResponse } from 'next/server'
import { getStatsForPeriod } from '@/lib/nginx-parser'

/**
 * Server Statistics API
 *
 * GET /api/admin/stats?period=today|yesterday|7days|30days
 *
 * Returns DSGVO-compliant aggregated server statistics from nginx logs.
 * No personal data, no tracking, only anonymized aggregate metrics.
 *
 * Protected: Only accessible from admin area (add auth check if needed)
 */
export async function GET(request: NextRequest) {
  try {
    // Get period from query params
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') as 'today' | 'yesterday' | '7days' | '30days' || 'today'

    // Optional: Custom log path (for development/testing)
    const logPath = searchParams.get('logPath') || process.env.NGINX_LOG_PATH || '/var/log/nginx/access.log'

    // Parse logs and generate stats
    const stats = await getStatsForPeriod(period, logPath)

    // Return stats with cache control (5 minutes)
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)

    // Return friendly error
    return NextResponse.json(
      {
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
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
      },
      { status: 500 }
    )
  }
}

// Optional: POST endpoint for custom date ranges
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { since, until, logPath } = body

    // TODO: Implement custom date range parsing
    // For now, just return error
    return NextResponse.json(
      { error: 'Custom date ranges not yet implemented' },
      { status: 501 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
