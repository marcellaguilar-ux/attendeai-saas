# AttendeAI — Barbearia SaaS

Plataforma SaaS de agendamento automático via WhatsApp com agente IA (Bia) para barbearias.

**Produção:** https://attendeai.ia.br
**Super admin:** https://attendeai.ia.br/admin

---

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Banco de dados:** Supabase (PostgreSQL + Auth + RLS)
- **Deploy:** Vercel
- **WhatsApp:** Baileys (VPS HostGator 129.121.39.54)
- **Email:** Resend
- **Pagamento:** InfinitePay
- **IA:** Groq API (modelo `openai/gpt-oss-120b`)
- **Transcrição de áudio:** Groq Whisper

---

## Estrutura de rotas

### Público
| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Login |
| `/cadastro` | Cadastro de barbearia |
| `/pagamento` | Checkout InfinitePay |
| `/precos` | Página de preços |
| `/[slug]` | Perfil público da barbearia (agendamento) |

### Dashboard (barbearia owners)
| Rota | Descrição |
|------|-----------|
| `/dashboard` | Visão geral — agendamentos do dia/mês |
| `/dashboard/agendamentos` | Gerenciar agendamentos |
| `/dashboard/conversas` | Histórico de conversas da Bia |
| `/dashboard/conversas/[id]` | Detalhe de uma conversa |
| `/dashboard/whatsapp` | Status da conexão WhatsApp + QR code |
| `/dashboard/configuracoes` | Configurações da barbearia |

### Super Admin (`attendeai.ia@gmail.com`)
| Rota | Descrição |
|------|-----------|
| `/admin` | Visão geral global da plataforma |
| `/admin/barbearias` | Todas as barbearias cadastradas |
| `/admin/conversas` | Todas as conversas da plataforma |
| `/admin/agendamentos` | Todos os agendamentos |
| `/admin/faturamento` | MRR, ARR, clientes pagos/pendentes |

### APIs internas
| Rota | Descrição |
|------|-----------|
| `POST /api/whatsapp/qr` | Status e QR code do WhatsApp |
| `POST /api/whatsapp/reconnect` | Reconectar sessão WhatsApp |
| `POST /api/book/[slug]` | Criar agendamento |
| `GET /api/book/[slug]/slots` | Horários disponíveis |
| `POST /api/send-message` | Enviar mensagem manual |
| `POST /api/takeover` | Takeover (modo manual) |
| `POST /api/appointments/[id]` | Atualizar agendamento |
| `POST /api/payment/webhook` | Webhook InfinitePay |
| `POST /api/cadastro` | Criar conta + barbearia |

---

## Banco de dados (Supabase)

**Projeto:** `xikrkmemzxpblhkzkxvc`
**URL:** `https://xikrkmemzxpblhkzkxvc.supabase.co`

### Tabelas principais

```
barbershops       — Estabelecimentos (nome, slug, telefone, payment_status, ai_prompt...)
users             — Contas (id, barbershop_id, email, role, created_at)
appointments      — Agendamentos (client_nome, servico, data, horario, status...)
conversations     — Conversas WhatsApp (client_nome, client_whatsapp, status, last_message_at)
messages          — Mensagens das conversas (role: user|assistant, content)
services          — Serviços da barbearia
business_hours    — Horários de funcionamento
whatsapp_instances — Status da conexão WhatsApp
```

### Roles de usuário
- `owner` (padrão) — dono de barbearia, acessa apenas o próprio dashboard
- `super_admin` — acessa o painel `/admin` com dados de toda a plataforma

**Super admin atual:** `attendeai.ia@gmail.com`
A verificação de super_admin é feita por email (não por query no banco) para evitar conflitos de RLS.

---

## VPS — Agente WhatsApp (Bia)

**Servidor:** HostGator VPS `129.121.39.54` | SSH porta `22022`
**Processo:** PM2 `baileys-sdr` (ID 1)
**Arquivo principal:** `/root/baileys-test/server-vps.mjs`
**Porta local:** `8080`

### Comandos úteis no VPS
```bash
pm2 logs 1 --lines 50          # Ver logs em tempo real
pm2 restart 1                   # Reiniciar o bot
pm2 status                      # Status dos processos

# Resetar sessão WhatsApp (gera novo QR)
rm -rf /root/baileys-test/auth
pm2 restart 1
```

### Variáveis de ambiente do PM2
```
GROQ_MODEL=openai/gpt-oss-120b
GROQ_API_KEY=...
RESEND_API_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

### Reconexão automática
O bot trata `loggedOut` (código 401) limpando a pasta `auth/` e chamando `connectWhatsApp()` novamente — gera novo QR automaticamente sem precisar reiniciar o PM2.

### Endpoints do VPS (autenticados via `x-api-key`)
```
GET  /qr         — Status e QR code da sessão WhatsApp
POST /reconnect  — Forçar reconexão
```

---

## Variáveis de ambiente (Vercel)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
VPS_BASE_URL=http://129.121.39.54:8080
VPS_API_KEY=attendeai-internal-vps-key
RESEND_API_KEY=
INFINITEPAY_SECRET=
```

---

## Design system

Todas as páginas usam **inline styles** (sem Tailwind nas páginas, apenas nos componentes UI).

| Token | Valor |
|-------|-------|
| Background | `#0a0d10` |
| Card | `#13181c` |
| Card inner | `#181e23` |
| Border | `#1d2429` |
| Sidebar | `#0f1316` |
| Accent (verde) | `#00e5a0` |
| Accent (azul) | `#5b9cff` |
| Texto primário | `#e9eef3` |
| Texto secundário | `#6c7884` |
| Texto muted | `#aab4bd` |
| Erro | `#f87171` |
| Aviso | `#fbbf24` |

---

## Funcionalidades do agente IA (Bia)

- Responde mensagens de texto e áudio (transcrição via Groq Whisper)
- Verifica horários disponíveis no Supabase
- Cria agendamentos automaticamente
- Envia confirmação por WhatsApp com link do Google Maps
- Envia email de confirmação com convite `.ics` para Google Agenda
- Salva conversas e mensagens no Supabase em tempo real
- Suporta modo takeover (barbeiro assume a conversa manualmente)

---

## Super Admin — Como adicionar novos admins

Edite o array `SUPER_ADMIN_EMAILS` em dois arquivos:

1. `src/app/admin/layout.tsx`
2. `src/app/login/page.tsx`

```ts
const SUPER_ADMIN_EMAILS = ['attendeai.ia@gmail.com', 'novo@email.com']
```

Não é necessário alterar o banco de dados.
