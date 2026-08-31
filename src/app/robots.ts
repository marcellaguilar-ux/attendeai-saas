import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/sdr', '/precos'],
        disallow: ['/dashboard', '/admin', '/api/', '/pagamento'],
      },
    ],
    sitemap: 'https://attendeai.ia.br/sitemap.xml',
  }
}
