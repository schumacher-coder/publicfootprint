import { NextRequest, NextResponse } from 'next/server'
import { getAppContent, updateAppContent, createNewApp, deleteApp } from '@/lib/content'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const content = getAppContent(params.slug)
    if (!content) {
      return NextResponse.json(
        { error: 'App content not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load app content' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const { content, isNew } = body

    if (isNew) {
      createNewApp(params.slug, content)
    } else {
      updateAppContent(params.slug, content)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save app content' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    deleteApp(params.slug)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete app content' },
      { status: 500 }
    )
  }
}
