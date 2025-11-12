import { NextRequest, NextResponse } from 'next/server'
import { getAllServices, updateServices } from '@/lib/content'

export async function GET() {
  try {
    const services = getAllServices()
    return NextResponse.json({ services })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { services } = body

    updateServices(services)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update services' },
      { status: 500 }
    )
  }
}
