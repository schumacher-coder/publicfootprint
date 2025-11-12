import React from 'react'

// Simple markdown parser for basic formatting
export function parseMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  // Match **bold** text
  const boldRegex = /\*\*(.+?)\*\*/g
  let match: RegExpExecArray | null

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Add bold text
    parts.push(
      <strong key={match.index} className="text-gray-900">
        {match[1]}
      </strong>
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : text
}
