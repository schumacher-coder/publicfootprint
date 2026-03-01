import type { Metadata } from 'next'
import { getImpressumContent, type ContentBlock } from '@/lib/content'
import { parseMarkdown } from '@/lib/markdown'

export const metadata: Metadata = {
  title: 'Impressum - Public Footprint GmbH',
  description: 'Impressum und rechtliche Angaben der Public Footprint GmbH.',
}

// Revalidate every 60 seconds - ISR (Incremental Static Regeneration)
export const revalidate = 60

function renderContentBlock(block: ContentBlock, index: number) {
  if (block.type === 'text') {
    return (
      <div key={index}>
        {parseMarkdown(block.content)}
      </div>
    )
  } else if (block.type === 'image') {
    return (
      <div key={index} className="my-8">
        <img
          src={block.src}
          alt={block.alt || ''}
          className="rounded-lg shadow-lg max-w-full mx-auto"
        />
        {block.caption && (
          <p className="text-sm text-gray-600 text-center mt-2 italic">
            {block.caption}
          </p>
        )}
      </div>
    )
  }
  return null
}

export default function ImpressumPage() {
  const content = getImpressumContent()

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-12">{content.title}</h1>

          <div className="space-y-8">
            {content.content.map((block, index) => renderContentBlock(block, index))}
          </div>
        </div>
      </div>
    </section>
  )
}
