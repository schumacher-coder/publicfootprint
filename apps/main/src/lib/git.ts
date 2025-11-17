import { execSync } from 'child_process'

/**
 * Git operations for committing and pushing content changes
 */

export interface GitSyncResult {
  success: boolean
  message: string
  changes?: string[]
}

/**
 * Check if there are uncommitted changes
 */
export function hasChanges(): boolean {
  try {
    const status = execSync('git status --porcelain', {
      cwd: process.cwd(),
      encoding: 'utf-8'
    })
    return status.trim().length > 0
  } catch (error) {
    console.error('Error checking git status:', error)
    return false
  }
}

/**
 * Get list of changed files
 */
export function getChangedFiles(): string[] {
  try {
    const status = execSync('git status --porcelain', {
      cwd: process.cwd(),
      encoding: 'utf-8'
    })

    return status
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.substring(3)) // Remove status prefix (e.g., " M ")
  } catch (error) {
    console.error('Error getting changed files:', error)
    return []
  }
}

/**
 * Commit and push changes to GitHub
 */
export async function commitAndPush(commitMessage?: string): Promise<GitSyncResult> {
  try {
    // Check if there are changes
    if (!hasChanges()) {
      return {
        success: true,
        message: 'Keine Änderungen zum Committen',
        changes: []
      }
    }

    // Get list of changes before committing
    const changes = getChangedFiles()

    // Add all changes in content directory
    execSync('git add content/', {
      cwd: process.cwd(),
      encoding: 'utf-8'
    })

    // Commit with message
    const message = commitMessage || `Content updated via Admin-CMS (${new Date().toLocaleString('de-DE')})`
    execSync(`git commit -m "${message}"`, {
      cwd: process.cwd(),
      encoding: 'utf-8'
    })

    // Push to remote
    execSync('git push origin main', {
      cwd: process.cwd(),
      encoding: 'utf-8'
    })

    return {
      success: true,
      message: 'Änderungen erfolgreich zu GitHub gepusht',
      changes
    }
  } catch (error: any) {
    console.error('Git sync error:', error)

    // Parse error message
    let errorMessage = 'Fehler beim Git-Push'
    if (error.message.includes('Authentication failed')) {
      errorMessage = 'Git-Authentifizierung fehlgeschlagen. SSH-Key oder Token konfigurieren.'
    } else if (error.message.includes('repository not found')) {
      errorMessage = 'Repository nicht gefunden'
    } else if (error.message.includes('Connection refused')) {
      errorMessage = 'Keine Verbindung zu GitHub möglich'
    }

    return {
      success: false,
      message: errorMessage,
      changes: []
    }
  }
}

/**
 * Pull latest changes from GitHub
 */
export async function pullFromGitHub(): Promise<GitSyncResult> {
  try {
    // Check for uncommitted changes
    if (hasChanges()) {
      return {
        success: false,
        message: 'Es gibt ungespeicherte Änderungen. Bitte erst committen.',
        changes: getChangedFiles()
      }
    }

    // Pull from remote
    const output = execSync('git pull origin main', {
      cwd: process.cwd(),
      encoding: 'utf-8'
    })

    return {
      success: true,
      message: output.includes('Already up to date')
        ? 'Bereits auf dem neuesten Stand'
        : 'Änderungen von GitHub geladen',
      changes: []
    }
  } catch (error: any) {
    console.error('Git pull error:', error)
    return {
      success: false,
      message: 'Fehler beim Laden von GitHub',
      changes: []
    }
  }
}
