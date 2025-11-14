import { NextRequest, NextResponse } from 'next/server'
import { getImpressumContent, updateImpressumContent } from '@/lib/content'

export async function GET() {
  try {
    const content = getImpressumContent()
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load impressum content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json()
    updateImpressumContent(content)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update impressum content' },
      { status: 500 }
    )
  }
}
