'use client'

import { useEffect, useState } from 'react'

interface HeroCarouselProps {
  images: string[]
  interval?: number
  children: React.ReactNode
}

export default function HeroCarousel({ images, interval = 5000, children }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Preload all images
  useEffect(() => {
    if (images.length === 0) return

    let loadedCount = 0
    const imageElements: HTMLImageElement[] = []

    images.forEach((src) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        loadedCount++
        if (loadedCount === images.length) {
          setImagesLoaded(true)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === images.length) {
          setImagesLoaded(true)
        }
      }
      imageElements.push(img)
    })

    return () => {
      imageElements.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
    }
  }, [images])

  useEffect(() => {
    if (images.length <= 1 || !imagesLoaded) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval, imagesLoaded])

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Images with Crossfade */}
      {images.map((image, index) => (
        <div
          key={image}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        />
      ))}

      {/* Subtle Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 z-5" />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {/* Carousel Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
