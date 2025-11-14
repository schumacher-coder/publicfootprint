import { NextRequest, NextResponse } from 'next/server'
import { getDatenschutzContent, updateDatenschutzContent } from '@/lib/content'

export async function GET() {
  try {
    const content = getDatenschutzContent()
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load datenschutz content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json()
    updateDatenschutzContent(content)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update datenschutz content' },
      { status: 500 }
    )
  }
}
