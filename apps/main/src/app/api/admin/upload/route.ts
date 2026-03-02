import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

/**
 * Image Upload API for Notizen
 *
 * POST /api/admin/upload
 *
 * Accepts multipart/form-data with image file
 * Saves to /public/images/notizen/
 * Returns image URL for Markdown
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (images only)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images allowed (JPG, PNG, GIF, WebP).' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_') // Sanitize filename
    const filename = `${timestamp}-${originalName}`

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'notizen')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      // Directory might already exist, ignore error
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = path.join(uploadDir, filename)

    await writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/images/notizen/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: file.type,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to list uploaded images
export async function GET() {
  try {
    const { readdir } = await import('fs/promises')
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'notizen')

    try {
      const files = await readdir(uploadDir)
      const images = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(file => ({
          filename: file,
          url: `/images/notizen/${file}`,
        }))

      return NextResponse.json({ images })
    } catch (err) {
      // Directory doesn't exist yet
      return NextResponse.json({ images: [] })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    )
  }
}
