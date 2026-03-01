import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
      <section className={content.hero.image ? "relative min-h-[60vh] flex items-center justify-center overflow-hidden" : "section-padding bg-gradient-to-b from-gray-50 to-white"}>
        {content.hero.image && (
          <>
            {/* Background Image */}
            <img
              src={content.hero.image}
              alt={content.hero.title}
              className="absolute inset-0 w-full h-full object-cover z-0"
              loading="eager"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10" />
            {/* Content Overlay */}
            <div className="relative z-20 container-custom py-20 text-center">
              <h1 className="mb-8 text-magenta drop-shadow-lg text-[80px] font-bold">
                {content.hero.title}
              </h1>
              <p className="text-2xl text-white mb-4 font-light drop-shadow-lg">
                {content.hero.subtitle}
              </p>
              <p className="text-xl text-white/90 drop-shadow-lg">
                {content.hero.description}
              </p>
            </div>
          </>
        )}
        {!content.hero.image && (
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <img
                    src="/images/logos/pf-signet.png"
                    alt="Public Footprint"
                    className="h-16 w-auto opacity-20"
                  />
                </div>
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
        )}
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
