import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
