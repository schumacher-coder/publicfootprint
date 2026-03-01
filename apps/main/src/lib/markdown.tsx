import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Full markdown parser using react-markdown
export function parseMarkdown(text: string): React.ReactNode {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-gray-900" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-8 text-gray-900" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-2 mt-6 text-gray-900" {...props} />,
        h4: ({ node, ...props }) => <h4 className="text-lg font-semibold mb-2 mt-4 text-gray-900" {...props} />,

        // Paragraphs
        p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,

        // Links
        a: ({ node, ...props }) => (
          <a
            className="text-magenta hover:text-magenta-700 underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),

        // Lists
        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />,
        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,

        // Strong/Bold
        strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,

        // Emphasis/Italic
        em: ({ node, ...props }) => <em className="italic" {...props} />,

        // Code
        code: ({ node, ...props }) => (
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />
        ),

        // Blockquote
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-magenta pl-4 py-2 mb-4 italic text-gray-600" {...props} />
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  )
}
