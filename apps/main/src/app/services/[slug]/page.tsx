import { getAppContent, getServices } from '@/lib/content'
import { LandingPage } from '@/components/LandingPage'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const services = getServices()
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const content = getAppContent(params.slug)

  if (!content) {
    notFound()
  }

  return <LandingPage content={content} />
}
