import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://vinamah.com'

  // Public pages that should be indexed
  const routes = [
    '',
    '/about',
    '/acceptable-use',
    '/cookies',
    '/early-access',
    '/feedback',
    '/guidelines',
    '/privacy',
    '/terms',
    '/use-case',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
}

