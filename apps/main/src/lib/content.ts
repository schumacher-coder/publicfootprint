import fs from 'fs'
import path from 'path'

const contentDir = path.join(process.cwd(), '../..', 'content')

export interface Service {
  id: string
  title: string
  slug: string
  domain: string
  excerpt: string
  enabled: boolean
  sortOrder: number
}

export interface Homepage {
  hero: {
    title: string
    paragraphs: string[]
  }
  aboutSection: {
    title: string
    paragraphs: string[]
  }
  servicesSection: {
    title: string
  }
  ctaSection: {
    title: string
    description: string
    buttonText: string
  }
}

export interface AppContent {
  domain: string
  hero: {
    title: string
    subtitle: string
    description: string
  }
  sections: Array<{
    id: string
    title: string
    content: string
  }>
  cta: {
    title: string
    buttonText: string
    buttonLink: string
  }
}

// Read functions
export function getHomepageContent(): Homepage {
  const filePath = path.join(contentDir, 'main', 'homepage.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export function getServices(): Service[] {
  const filePath = path.join(contentDir, 'main', 'services.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContents)
  return data.services
    .filter((s: Service) => s.enabled)
    .sort((a: Service, b: Service) => a.sortOrder - b.sortOrder)
}

export function getAllServices(): Service[] {
  const filePath = path.join(contentDir, 'main', 'services.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContents)
  return data.services.sort((a: Service, b: Service) => a.sortOrder - b.sortOrder)
}

export function getAppContent(appSlug: string): AppContent | null {
  try {
    const filePath = path.join(contentDir, 'apps', `${appSlug}.json`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    return null
  }
}

// Write functions (for admin)
export function updateHomepageContent(content: Homepage): void {
  const filePath = path.join(contentDir, 'main', 'homepage.json')
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8')
}

export function updateServices(services: Service[]): void {
  const filePath = path.join(contentDir, 'main', 'services.json')
  fs.writeFileSync(filePath, JSON.stringify({ services }, null, 2), 'utf8')
}

export function updateAppContent(appSlug: string, content: AppContent): void {
  const filePath = path.join(contentDir, 'apps', `${appSlug}.json`)
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8')
}

export function createNewApp(appSlug: string, content: AppContent): void {
  const filePath = path.join(contentDir, 'apps', `${appSlug}.json`)
  if (fs.existsSync(filePath)) {
    throw new Error('App content already exists')
  }
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8')
}

export function deleteApp(appSlug: string): void {
  const filePath = path.join(contentDir, 'apps', `${appSlug}.json`)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}
