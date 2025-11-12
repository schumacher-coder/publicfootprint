import { NextRequest, NextResponse } from 'next/server'
import { getHomepageContent, updateHomepageContent } from '@/lib/content'

export async function GET() {
  try {
    const content = getHomepageContent()
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load homepage content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    updateHomepageContent(content)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update homepage content' },
      { status: 500 }
    )
  }
}
