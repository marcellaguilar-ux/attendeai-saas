'use client'
import { ThemeProvider, useTheme } from '@/lib/theme'
import Sidebar from '@/components/sidebar'

type Barbershop = { id: string; nome: string; slug?: string; payment_status: string; plano: string | null }

const DARK = {
  '--dash-bg': '#0a0d10',
  '--dash-bg-sidebar': '#0f1316',
  '--dash-bg-card': '#13181c',
  '--dash-bg-input': '#181e23',
  '--dash-bg-hover': '#1a2028',
  '--dash-border': '#1d2429',
  '--dash-border-input': '#2a343c',
  '--dash-border-hover': '#3a444c',
  '--dash-text': '#e9eef3',
  '--dash-text-secondary': '#aab4bd',
  '--dash-text-muted': '#6c7884',
  '--dash-text-dim': '#3a444c',
  '--dash-accent': '#00e5a0',
  '--dash-accent-bg': 'rgba(0,229,160,0.04)',
  '--dash-accent-border': 'rgba(0,229,160,0.12)',
  '--dash-accent-badge': 'rgba(0,229,160,0.08)',
} as Record<string, string>

const LIGHT = {
  '--dash-bg': '#f4f6f8',
  '--dash-bg-sidebar': '#ffffff',
  '--dash-bg-card': '#ffffff',
  '--dash-bg-input': '#f0f2f5',
  '--dash-bg-hover': '#eaecef',
  '--dash-border': '#e0e4e8',
  '--dash-border-input': '#cdd3da',
  '--dash-border-hover': '#b0b8c1',
  '--dash-text': '#1a1d21',
  '--dash-text-secondary': '#4a5260',
  '--dash-text-muted': '#6b7685',
  '--dash-text-dim': '#a0a8b2',
  '--dash-accent': '#00b377',
  '--dash-accent-bg': 'rgba(0,179,119,0.06)',
  '--dash-accent-border': 'rgba(0,179,119,0.18)',
  '--dash-accent-badge': 'rgba(0,179,119,0.10)',
} as Record<string, string>

function DashboardInner({ barbershop, children }: { barbershop: Barbershop; children: React.ReactNode }) {
  const { theme } = useTheme()
  const vars = theme === 'dark' ? DARK : LIGHT

  return (
    <div style={{
      ...vars as React.CSSProperties,
      minHeight: '100vh',
      background: 'var(--dash-bg)',
      display: 'flex',
      fontFamily: "var(--font-geist-sans, 'Inter', sans-serif)",
      transition: 'background-color .2s ease',
    }}>
      <Sidebar barbershop={barbershop} plano={barbershop.plano} />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}

export default function DashboardShell({ barbershop, children }: { barbershop: Barbershop; children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardInner barbershop={barbershop}>
        {children}
      </DashboardInner>
    </ThemeProvider>
  )
}
