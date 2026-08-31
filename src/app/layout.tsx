import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "AttendeAI",
      "description": "Agente de IA que atende clientes, verifica horários e confirma agendamentos automaticamente pelo WhatsApp — 24h por dia.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": "https://attendeai.ia.br",
      "inLanguage": "pt-BR",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "147",
        "highPrice": "497",
        "priceCurrency": "BRL",
        "offerCount": "3",
      },
      "publisher": {
        "@type": "Organization",
        "name": "AttendeAI",
        "url": "https://attendeai.ia.br",
      },
    },
    {
      "@type": "Organization",
      "name": "AttendeAI",
      "url": "https://attendeai.ia.br",
      "description": "Plataforma SaaS de agentes de IA para atendimento e agendamento automático via WhatsApp.",
      "foundingLocation": { "@type": "Place", "addressCountry": "BR" },
    },
  ],
};

export const metadata: Metadata = {
  title: "AttendeAI — Agendamentos Automáticos pelo WhatsApp",
  description: "Seu negócio atendendo e agendando 24h pelo WhatsApp, sem esforço. Agente IA que responde clientes, verifica horários e confirma agendamentos automaticamente.",
  keywords: ["automação de agendamentos pelo WhatsApp", "agente IA WhatsApp", "atendimento automático WhatsApp", "assistente virtual agendamento", "chatbot agendamento WhatsApp", "IA para negócios"],
  authors: [{ name: "AttendeAI" }],
  metadataBase: new URL("https://attendeai.ia.br"),
  openGraph: {
    title: "AttendeAI — Agendamentos Automáticos pelo WhatsApp",
    description: "Seu negócio atendendo e agendando 24h pelo WhatsApp, sem esforço. Agente IA que responde clientes, verifica horários e confirma agendamentos automaticamente.",
    url: "https://attendeai.ia.br",
    siteName: "AttendeAI",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AttendeAI — Agendamentos Automáticos pelo WhatsApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AttendeAI — Agendamentos Automáticos pelo WhatsApp",
    description: "Seu negócio atendendo e agendando 24h pelo WhatsApp, sem esforço. Agente IA que responde clientes, verifica horários e confirma agendamentos automaticamente.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://attendeai.ia.br",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
