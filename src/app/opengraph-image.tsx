import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0a0d10',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 100px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid lines decoration */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,229,160,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          display: 'flex',
        }} />

        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: -100, left: -100,
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(0,229,160,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <div style={{
            width: 56, height: 56,
            background: '#00e5a0',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            fontWeight: 800,
            color: '#000',
            letterSpacing: '-0.04em',
            paddingBottom: 2,
          }}>
            a
          </div>
          <span style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#e9eef3',
            letterSpacing: '-0.03em',
          }}>
            AttendeAI
          </span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 64,
          fontWeight: 800,
          color: '#e9eef3',
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          marginBottom: 24,
          maxWidth: 900,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0 16px',
          alignItems: 'baseline',
        }}>
          <span>Agendamentos</span>
          <span style={{ color: '#00e5a0' }}>automáticos</span>
          <span>pelo WhatsApp</span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 26,
          color: '#6c7884',
          letterSpacing: '-0.02em',
          lineHeight: 1.4,
          maxWidth: 720,
        }}>
          Agente IA que responde, verifica horários e confirma agendamentos — 24h por dia, sem esforço.
        </div>

        {/* Bottom badge */}
        <div style={{
          position: 'absolute',
          bottom: 60,
          right: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(0,229,160,0.08)',
          border: '1px solid rgba(0,229,160,0.2)',
          borderRadius: 100,
          padding: '10px 20px',
        }}>
          <div style={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: '#00e5a0',
            display: 'flex',
          }} />
          <span style={{ color: '#00e5a0', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>
            attendeai.ia.br
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
