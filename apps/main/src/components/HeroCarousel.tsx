'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface HeroCarouselProps {
  images: string[]
  interval?: number
  children: React.ReactNode
}

export default function HeroCarousel({ images, interval = 5000, children }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (images.length <= 1 || isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval, isPaused])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      aria-label="Hero section with background carousel"
    >
      {/* Background Images with Crossfade */}
      {images.map((image, index) => (
        <div
          key={image}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          <Image
            src={image}
            alt="" /* Decorative background image */
            fill
            priority={index === 0}
            quality={90}
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            aria-hidden="true"
          />
        </div>
      ))}

      {/* Subtle Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 z-5" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {/* Carousel Controls */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
          {/* Pause/Play Button */}
          <button
            onClick={togglePause}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-200 shadow-lg"
            aria-label={isPaused ? 'Resume carousel' : 'Pause carousel'}
            title={isPaused ? 'Fortsetzen' : 'Pausieren'}
          >
            {isPaused ? (
              <svg
                className="w-4 h-4 text-gray-800"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-800"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
              </svg>
            )}
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75 w-2'
                }`}
                aria-label={`Go to slide ${index + 1} of ${images.length}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Live region for screen readers */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Slide {currentIndex + 1} of {images.length}
        {isPaused ? ' (paused)' : ''}
      </div>
    </section>
  )
}
