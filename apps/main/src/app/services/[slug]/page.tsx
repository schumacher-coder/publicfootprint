import { getAppContent, getServices } from '@/lib/content'
import { LandingPage } from '@/components/LandingPage'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const services = getServices()
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const content = getAppContent(slug)

  if (!content) {
    notFound()
  }

  return <LandingPage content={content} />
}
