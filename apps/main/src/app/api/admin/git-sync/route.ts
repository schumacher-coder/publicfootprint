import { NextRequest, NextResponse } from 'next/server'
import { commitAndPush, pullFromGitHub, hasChanges, getChangedFiles } from '@/lib/git'

/**
 * GET: Check git status
 */
export async function GET(request: NextRequest) {
  try {
    const changes = getChangedFiles()
    const hasUncommittedChanges = hasChanges()

    return NextResponse.json({
      hasChanges: hasUncommittedChanges,
      changes,
      count: changes.length
    })
  } catch (error: any) {
    console.error('Error checking git status:', error)
    return NextResponse.json(
      { error: 'Fehler beim Prüfen des Git-Status' },
      { status: 500 }
    )
  }
}

/**
 * POST: Commit and push changes to GitHub
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, message } = body

    if (action === 'push') {
      const result = await commitAndPush(message)
      return NextResponse.json(result)
    } else if (action === 'pull') {
      const result = await pullFromGitHub()
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { error: 'Ungültige Aktion. Nutze "push" oder "pull"' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Git sync error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Git-Sync' },
      { status: 500 }
    )
  }
}
