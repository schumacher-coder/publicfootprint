'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface NotizenEntryProps {
  entry: {
    id: string
    date: string
    content: string[]
  }
}

export default function NotizenEntry({ entry }: NotizenEntryProps) {
  return (
    <article key={entry.id} className="border-t-2 border-gray-300 pt-8">
      <time className="block font-mono text-sm text-gray-500 mb-4">
        {entry.date}
      </time>
      <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
        {entry.content.map((paragraph, index) => (
          <div key={index}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom styling for markdown elements
                p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-magenta hover:text-magenta-600 underline"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <img
                    src={src}
                    alt={alt || 'Bild'}
                    className="rounded-lg shadow-md my-6 max-w-full h-auto"
                  />
                ),
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 my-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 my-4">{children}</ol>,
                code: ({ inline, children }: any) =>
                  inline ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
                  ) : (
                    <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto my-4">
                      {children}
                    </code>
                  ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {paragraph}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </article>
  )
}
