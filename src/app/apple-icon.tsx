import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#00e5a0',
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 112,
          fontWeight: 800,
          color: '#000',
          fontFamily: 'sans-serif',
          letterSpacing: '-0.04em',
          paddingBottom: 6,
        }}
      >
        a
      </div>
    ),
    { width: 180, height: 180 }
  )
}
