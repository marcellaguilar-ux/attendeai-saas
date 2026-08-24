import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AttendeAI SDR — Agente de IA para prospecção via WhatsApp'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0d10',
          padding: '64px 72px',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,229,160,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(0,229,160,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px', position: 'relative' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#00e5a0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '800',
              color: '#000',
            }}
          >
            a
          </div>
          <span style={{ fontSize: '22px', fontWeight: '700', color: '#e9eef3', letterSpacing: '-0.03em' }}>
            attende<span style={{ color: '#6c7884', fontWeight: 400 }}>.ai</span>
          </span>
          <div
            style={{
              marginLeft: '4px',
              padding: '3px 10px',
              background: 'rgba(0,229,160,0.12)',
              border: '1px solid rgba(0,229,160,0.3)',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#00e5a0',
              letterSpacing: '0.04em',
            }}
          >
            SDR
          </div>
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00e5a0',
            }}
          />
          <span style={{ fontSize: '14px', color: '#00e5a0', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Prospecção via WhatsApp com IA
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '68px',
            fontWeight: '700',
            color: '#e9eef3',
            lineHeight: '1.0',
            letterSpacing: '-0.04em',
            maxWidth: '800px',
            position: 'relative',
          }}
        >
          Seu SDR nunca
          <br />
          <span style={{ color: '#00e5a0' }}>para de prospectar.</span>
        </div>

        {/* Description */}
        <div
          style={{
            marginTop: '28px',
            fontSize: '22px',
            color: '#aab4bd',
            lineHeight: '1.45',
            maxWidth: '680px',
            fontWeight: '400',
            position: 'relative',
          }}
        >
          Dispara campanhas, qualifica leads e agenda reuniões automaticamente — 24h por dia, sem custo de CLT.
        </div>

        {/* Stats row */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            gap: '0',
            position: 'relative',
          }}
        >
          {[
            { n: '24/7', l: 'prospectando' },
            { n: '10x', l: 'mais leads abordados' },
            { n: '5min', l: 'tempo de resposta' },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingRight: '40px',
                marginRight: '40px',
                borderRight: i < 2 ? '1px solid #1d2429' : 'none',
              }}
            >
              <span style={{ fontSize: '32px', fontWeight: '700', color: '#e9eef3', letterSpacing: '-0.04em' }}>
                {s.n}
              </span>
              <span style={{ fontSize: '14px', color: '#6c7884', marginTop: '2px' }}>{s.l}</span>
            </div>
          ))}

          {/* CTA pill */}
          <div
            style={{
              marginLeft: 'auto',
              padding: '14px 28px',
              background: '#00e5a0',
              borderRadius: '100px',
              fontSize: '16px',
              fontWeight: '700',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              alignSelf: 'flex-end',
            }}
          >
            attendeai.ia.br/sdr
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
