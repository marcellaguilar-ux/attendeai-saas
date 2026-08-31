import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AttendeAI SDR — Seu SDR nunca para de prospectar',
  description:
    'Agente de IA que dispara campanhas via WhatsApp, qualifica leads automaticamente e agenda reuniões com seus consultores — 24h por dia, sem custo de CLT.',
  keywords: [
    'SDR inteligência artificial',
    'prospecção automática WhatsApp',
    'agente IA vendas',
    'qualificação de leads WhatsApp',
    'automação comercial',
    'AttendeAI SDR',
  ],
  authors: [{ name: 'AttendeAI' }],
  openGraph: {
    title: 'AttendeAI SDR — Seu SDR nunca para de prospectar',
    description:
      'Agente de IA que dispara campanhas via WhatsApp, qualifica leads automaticamente e agenda reuniões com seus consultores — 24h por dia, sem custo de CLT.',
    url: 'https://attendeai.ia.br/sdr',
    siteName: 'AttendeAI',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/sdr/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AttendeAI SDR — Agente de IA para prospecção via WhatsApp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AttendeAI SDR — Seu SDR nunca para de prospectar',
    description:
      'Agente de IA que dispara campanhas via WhatsApp, qualifica leads automaticamente e agenda reuniões — 24h por dia.',
    images: ['/sdr/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://attendeai.ia.br/sdr',
  },
}

export default function SdrLayout({ children }: { children: React.ReactNode }) {
  return children
}
