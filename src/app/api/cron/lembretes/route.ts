import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function emailHtml({
  nome,
  servico,
  data,
  horario,
  nomeBarbearia,
}: {
  nome: string
  servico: string
  data: string
  horario: string
  nomeBarbearia: string
}) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0d10;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0d10;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#13181c;border:1px solid #1d2429;border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="padding:28px 32px;border-bottom:1px solid #1d2429;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#00e5a0;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                  <span style="color:#000;font-size:18px;font-weight:800;line-height:32px;">a</span>
                </td>
                <td style="padding-left:10px;">
                  <span style="color:#e9eef3;font-size:15px;font-weight:600;letter-spacing:-0.02em;">AttendeAI</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="color:#e9eef3;font-size:22px;font-weight:600;letter-spacing:-0.025em;margin:0 0 8px;">
              Lembrete de agendamento
            </p>
            <p style="color:#6c7884;font-size:14px;margin:0 0 28px;line-height:1.5;">
              Olá, <strong style="color:#aab4bd;">${nome}</strong>! Seu agendamento é amanhã.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1316;border-radius:12px;overflow:hidden;margin-bottom:28px;">
              ${[
                ['Barbearia', nomeBarbearia],
                ['Serviço', servico],
                ['Data', data],
                ['Horário', horario],
              ].map(([label, value], i, arr) => `
              <tr>
                <td style="padding:12px 16px;border-bottom:${i < arr.length - 1 ? '1px solid #1d2429' : 'none'};">
                  <span style="color:#6c7884;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">${label}</span>
                </td>
                <td style="padding:12px 16px;border-bottom:${i < arr.length - 1 ? '1px solid #1d2429' : 'none'};text-align:right;">
                  <span style="color:#e9eef3;font-size:13.5px;font-weight:500;">${value}</span>
                </td>
              </tr>`).join('')}
            </table>

            <p style="color:#6c7884;font-size:13px;line-height:1.6;margin:0;">
              Caso precise remarcar ou cancelar, entre em contato diretamente com a barbearia.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #1d2429;">
            <p style="color:#3a444c;font-size:12px;margin:0;text-align:center;">
              Enviado por AttendeAI · attendeai.ia.br
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Tomorrow in BRT (UTC-3)
  const nowUtc = new Date()
  const nowBrt = new Date(nowUtc.getTime() - 3 * 60 * 60 * 1000)
  const tomorrow = new Date(nowBrt)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  // Service-role client bypasses RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*, barbershops(nome, plano, payment_status)')
    .eq('data', tomorrowStr)
    .eq('status', 'confirmed')
    .not('client_email', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Only Pro/Business paid barbershops
  const eligible = (appointments ?? []).filter(a => {
    const shop = a.barbershops as { plano: string | null; payment_status: string } | null
    if (!shop || shop.payment_status !== 'paid') return false
    return shop.plano === 'pro' || shop.plano === 'business'
  })

  let sent = 0
  let errors = 0

  for (const appt of eligible) {
    const shop = appt.barbershops as { nome: string } | null
    const nomeBarbearia = shop?.nome || 'sua barbearia'
    const horario = String(appt.horario).slice(0, 5)
    const [y, m, d] = appt.data.split('-').map(Number)
    const dataLabel = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AttendeAI <noreply@attendeai.ia.br>',
        to: [appt.client_email],
        subject: `Lembrete: seu agendamento amanhã às ${horario} — ${nomeBarbearia}`,
        html: emailHtml({
          nome: appt.client_nome,
          servico: appt.servico,
          data: dataLabel,
          horario,
          nomeBarbearia,
        }),
      }),
    })

    if (res.ok) sent++
    else errors++
  }

  return NextResponse.json({ date: tomorrowStr, total: eligible.length, sent, errors })
}
