import React from 'react'
import Link from 'next/link'
import type { AppContent, ContentBlock } from '@/lib/content'
import { parseMarkdown } from '@/lib/markdown'

function renderContentBlock(block: ContentBlock, index: number) {
  if (block.type === 'text') {
    return (
      <p key={index}>{parseMarkdown(block.content)}</p>
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

interface LandingPageProps {
  content: AppContent
}

export function LandingPage({ content }: LandingPageProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {content.hero.image && (
              <div className="mb-8 flex justify-center">
                <img
                  src={content.hero.image}
                  alt={content.hero.title}
                  className="rounded-lg shadow-lg max-w-2xl w-full object-cover"
                />
              </div>
            )}
            <div className="text-center">
              <h1 className="mb-6">{content.hero.title}</h1>
              <p className="text-2xl text-gray-700 mb-4 font-light">
                {content.hero.subtitle}
              </p>
              <p className="text-xl text-gray-600">
                {content.hero.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {content.sections.map((section, index) => (
        <section
          key={section.id}
          className={`section-padding ${
            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
          }`}
        >
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6">{section.title}</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                {section.content.map((block, blockIndex) =>
                  renderContentBlock(block, blockIndex)
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-magenta-600 to-magenta-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-white mb-6">{content.cta.title}</h2>
          <a
            href={content.cta.buttonLink}
            className="inline-block px-8 py-3 bg-white text-magenta font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            {content.cta.buttonText}
          </a>
        </div>
      </section>
    </>
  )
}
