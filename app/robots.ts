import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/calendar/'],
    },
    sitemap: 'https://caly.com/sitemap.xml',
  }
}
