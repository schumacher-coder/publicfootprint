import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getNotizenContent, updateNotizenContent } from '@/lib/content'

export async function GET() {
  try {
    const content = getNotizenContent()
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load notizen content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    updateNotizenContent(content)

    // Immediately revalidate the public notizen page
    revalidatePath('/notizen')

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update notizen content' },
      { status: 500 }
    )
  }
}
