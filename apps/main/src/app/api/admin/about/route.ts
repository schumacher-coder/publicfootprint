import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const contentDir = path.join(process.cwd(), '../..', 'content')

export async function GET() {
  try {
    const filePath = path.join(contentDir, 'main', 'about.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const content = JSON.parse(fileContents)
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load about content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    const filePath = path.join(contentDir, 'main', 'about.json')
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8')

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}
