import React from 'react'

// Simple markdown parser for basic formatting
// Supports: **bold** and [link text](url)
export function parseMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let currentText = text
  let keyCounter = 0

  // Process in order: links first, then bold within remaining text
  const elements: Array<{ type: 'bold' | 'link'; start: number; end: number; content: string; url?: string }> = []

  // Find all links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let linkMatch: RegExpExecArray | null
  while ((linkMatch = linkRegex.exec(text)) !== null) {
    elements.push({
      type: 'link',
      start: linkMatch.index,
      end: linkMatch.index + linkMatch[0].length,
      content: linkMatch[1],
      url: linkMatch[2]
    })
  }

  // Find all bold **text**
  const boldRegex = /\*\*(.+?)\*\*/g
  let boldMatch: RegExpExecArray | null
  while ((boldMatch = boldRegex.exec(text)) !== null) {
    // Check if this bold is inside a link (skip if so)
    const insideLink = elements.some(
      el => el.type === 'link' && boldMatch!.index >= el.start && boldMatch!.index < el.end
    )
    if (!insideLink) {
      elements.push({
        type: 'bold',
        start: boldMatch.index,
        end: boldMatch.index + boldMatch[0].length,
        content: boldMatch[1]
      })
    }
  }

  // Sort by start position
  elements.sort((a, b) => a.start - b.start)

  // Build the result
  let lastIndex = 0
  elements.forEach(el => {
    // Add text before this element
    if (el.start > lastIndex) {
      parts.push(text.substring(lastIndex, el.start))
    }

    // Add the element
    if (el.type === 'link') {
      parts.push(
        <a
          key={`link-${keyCounter++}`}
          href={el.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-magenta-600 hover:text-magenta-700 underline transition-colors"
        >
          {el.content}
        </a>
      )
    } else if (el.type === 'bold') {
      parts.push(
        <strong key={`bold-${keyCounter++}`} className="text-gray-900">
          {el.content}
        </strong>
      )
    }

    lastIndex = el.end
  })

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : text
}
