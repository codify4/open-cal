import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/calendar/'],
    },
    sitemap: 'https://www.trycaly.cc/sitemap.xml',
  }
}
