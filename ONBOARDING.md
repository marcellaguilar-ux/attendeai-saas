# Guia de Onboarding — Novo Cliente BarberAI

Este documento descreve o passo a passo completo para ativar o serviço BarberAI para um novo cliente (barbearia).

---

## Informações que você precisa coletar do cliente

Antes de começar, colete as seguintes informações:

| Campo | Exemplo |
|---|---|
| Nome do responsável | João Silva |
| Email do responsável | joao@barbearia.com |
| Nome da barbearia | Barbearia Silva |
| Endereço completo | Av. Brasil, 100 — Centro, Uberlândia/MG |
| Telefone / WhatsApp da barbearia | (34) 99999-9999 |
| Número de WhatsApp para o agente IA | (34) 98888-8888 (chip exclusivo para a Bia) |
| Email do Google Calendar | joao@gmail.com |
| Serviços e preços | Corte R$35, Barba R$25, Combo R$55... |
| Horário de funcionamento | Seg–Sex 09h–19h, Sáb 09h–17h |

---

## Passo 1 — Criar a conta na dashboard

Execute o script abaixo no terminal (substitua os valores):

```bash
node -e "
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
  process.env.SUPABASE_URL,       // use env var — NEVER hardcode
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
async function main() {
  const NOME_RESPONSAVEL = 'João Silva'
  const EMAIL = 'joao@barbearia.com'
  const PASSWORD = 'SenhaSegura@2026'
  const NOME_BARBEARIA = 'Barbearia Silva'
  const TELEFONE = '(34) 99999-9999'
  const ENDERECO = 'Av. Brasil, 100 — Centro, Uberlândia/MG'

  // Criar usuário no Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: EMAIL, password: PASSWORD, email_confirm: true,
  })
  if (authError) { console.error('Erro auth:', authError.message); return }

  // Criar slug único para a barbearia
  const slug = NOME_BARBEARIA.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Math.random().toString(36).slice(2, 6)

  // Criar barbearia
  const { data: shop, error: shopError } = await supabase
    .from('barbershops')
    .insert({ nome: NOME_BARBEARIA, slug, telefone: TELEFONE, endereco: ENDERECO })
    .select().single()
  if (shopError) { console.error('Erro barbearia:', shopError.message); return }

  // Criar usuário vinculado
  const { error: userError } = await supabase.from('users')
    .insert({ id: authData.user.id, nome: NOME_RESPONSAVEL, email: EMAIL, barbershop_id: shop.id })
  if (userError) { console.error('Erro usuário:', userError.message); return }

  console.log('=== CONTA CRIADA COM SUCESSO ===')
  console.log('Barbershop ID:', shop.id)
  console.log('Email:', EMAIL)
  console.log('Senha:', PASSWORD)
}
main()
"
```

Anote o **Barbershop ID** gerado — será usado nos próximos passos.

---

## Passo 2 — Configurar o Google Calendar

1. Acesse o Google Calendar com a conta Google do cliente.
2. Na barra lateral, clique nos 3 pontos ao lado do calendário principal e selecione **Configurações e compartilhamento**.
3. Em **Compartilhar com pessoas específicas**, adicione o email da service account:
   ```
   barbearia-monteiro@barbearia-monteiro-493422.iam.gserviceaccount.com
   ```
4. Defina a permissão como **Fazer alterações nos eventos**.
5. Salve. O ID do calendário será o email Google do cliente (ex: `joao@gmail.com`).

---

## Passo 3 — Criar o agente IA no VPS

Conecte ao servidor via SSH:

```bash
ssh -p 22022 root@<VPS_IP>
# senha armazenada no gerenciador de senhas da equipe
```

### 3.1 Criar pasta do novo cliente

```bash
mkdir -p /opt/whatsapp-agent-CLIENTE
cd /opt/whatsapp-agent-CLIENTE
```

### 3.2 Copiar e inicializar o package.json

```bash
cp /opt/whatsapp-agent/package.json .
npm install
```

### 3.3 Copiar as credenciais do Google

```bash
cp /opt/whatsapp-agent/google-credentials.json .
```

### 3.4 Criar o server.mjs do cliente

Copie o arquivo `/opt/whatsapp-agent/server.mjs` e ajuste as seguintes constantes no topo:

```js
const PORT = 8081                          // porta diferente para cada cliente (8080, 8081, 8082...)
const CALENDAR_ID = 'joao@gmail.com'       // email do Google Calendar do cliente
const SERVICE_ACCOUNT_FILE = '/opt/whatsapp-agent-CLIENTE/google-credentials.json'
const BARBERSHOP_ID = 'ID_GERADO_NO_PASSO_1'

// Atualizar o prompt da IA com os dados do novo cliente:
// - Nome da barbearia
// - Endereço
// - Serviços e preços
// - Horário de funcionamento
```

No `buildSystemPrompt`, substitua todas as referências à "Barbearia Monteiro" pelo nome do novo cliente, incluindo endereço, serviços, preços e horários.

### 3.5 Iniciar com PM2

```bash
pm2 start server.mjs --name whatsapp-CLIENTE
pm2 save
```

### 3.6 Escanear o QR code

```bash
pm2 logs whatsapp-CLIENTE --lines 50
```

O QR code será salvo em `/opt/whatsapp-agent-CLIENTE/whatsapp-qr.png`. Baixe e compartilhe com o cliente para escanear com o WhatsApp do número exclusivo da Bia.

```bash
# Para baixar o QR no seu Mac:
scp -P <SSH_PORT> root@<VPS_IP>:/opt/whatsapp-agent-CLIENTE/whatsapp-qr.png ~/Desktop/qr-CLIENTE.png
```

---

## Passo 4 — Registrar o WhatsApp na dashboard

Após o cliente escanear o QR e o agente conectar, o Supabase é atualizado automaticamente. Mas se precisar fazer manualmente:

```bash
node -e "
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
  process.env.SUPABASE_URL,       // use env var — NEVER hardcode
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
supabase.from('whatsapp_instances').insert({
  barbershop_id: 'BARBERSHOP_ID_DO_PASSO_1',
  numero: '+55 (34) 98888-8888',
  status: 'connected'
}).then(({ error }) => console.log(error || 'ok'))
"
```

---

## Passo 5 — Entregar ao cliente

Envie as seguintes informações ao cliente:

```
Acesso à Dashboard BarberAI:
URL:   https://barbearia-saas-eight.vercel.app/login
Email: joao@barbearia.com
Senha: SenhaSegura@2026

Número do WhatsApp da Bia: (34) 98888-8888
```

Oriente o cliente a:
1. Acessar o dashboard e conferir os dados na tela de Configurações
2. Testar enviando uma mensagem para o número da Bia
3. Conferir se o agendamento aparece na tela de Agendamentos

---

## Checklist final

- [ ] Conta criada no Supabase (email + senha funcionando no login)
- [ ] Google Calendar compartilhado com a service account
- [ ] Agente PM2 rodando no VPS (`pm2 list` mostra `online`)
- [ ] WhatsApp escaneado e conectado (status verde no dashboard)
- [ ] Prompt da IA atualizado com dados do cliente (nome, endereço, serviços, horários)
- [ ] Teste de agendamento feito pelo WhatsApp e aparecendo no dashboard
- [ ] Credenciais entregues ao cliente

---

## Referências rápidas

| Recurso | Valor |
|---|---|
| Dashboard | https://barbearia-saas-eight.vercel.app |
| VPS IP | (ver gerenciador de senhas) |
| VPS SSH porta | (ver gerenciador de senhas) |
| VPS usuário | (ver gerenciador de senhas) |
| Supabase projeto | xikrkmemzxpblhkzkxvc.supabase.co |
| Service Account email | barbearia-monteiro@barbearia-monteiro-493422.iam.gserviceaccount.com |
| Credenciais Google (VPS) | /opt/whatsapp-agent/google-credentials.json |
| Agente Barbearia Monteiro | PM2 `whatsapp-agent`, porta 8080 |
