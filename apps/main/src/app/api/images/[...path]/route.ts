import { NextRequest } from 'next/server'
import { createReadStream, statSync } from 'fs'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/')
    const fullPath = join(process.cwd(), 'public', 'images', imagePath)

    // Check file exists and get size
    const stats = statSync(fullPath)

    // Determine content type
    const ext = imagePath.split('.').pop()?.toLowerCase()
    const contentType = ext === 'webp' ? 'image/webp' : 'image/jpeg'

    // Create a readable stream
    const stream = createReadStream(fullPath, { highWaterMark: 64 * 1024 }) // 64KB chunks

    // Convert Node stream to Web Stream
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk))
        })
        stream.on('end', () => {
          controller.close()
        })
        stream.on('error', (error) => {
          controller.error(error)
        })
      },
    })

    return new Response(readableStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Image loading error:', error)
    return new Response('Image not found', { status: 404 })
  }
}
