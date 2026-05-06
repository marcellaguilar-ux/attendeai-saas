create table barbershops (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text unique not null,
  endereco text,
  telefone text,
  logo_url text,
  plano text default 'basic',
  ativo boolean default true,
  groq_key text,
  resend_key text,
  created_at timestamptz default now()
);

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  barbershop_id uuid references barbershops(id) on delete set null,
  nome text,
  email text,
  created_at timestamptz default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade,
  nome text not null,
  preco numeric(10,2),
  duracao_min int default 60,
  ativo boolean default true
);

create table business_hours (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade,
  dia_semana int not null,
  hora_inicio text,
  hora_fim text,
  fechado boolean default false
);

create table whatsapp_instances (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade,
  numero text,
  status text default 'disconnected',
  updated_at timestamptz default now()
);

create table calendar_integrations (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade,
  calendar_id text,
  service_account_json text
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade,
  client_nome text,
  client_email text,
  client_whatsapp text,
  servico text,
  preco numeric(10,2),
  data date,
  horario time,
  status text default 'confirmed',
  gcal_event_id text,
  created_at timestamptz default now()
);

alter table barbershops enable row level security;
alter table users enable row level security;
alter table services enable row level security;
alter table business_hours enable row level security;
alter table whatsapp_instances enable row level security;
alter table calendar_integrations enable row level security;
alter table appointments enable row level security;

create policy "users own data" on users for all using (auth.uid() = id);

create policy "owner access barbershop" on barbershops for all
  using (id in (select barbershop_id from users where id = auth.uid()));

create policy "owner access services" on services for all
  using (barbershop_id in (select barbershop_id from users where id = auth.uid()));

create policy "owner access hours" on business_hours for all
  using (barbershop_id in (select barbershop_id from users where id = auth.uid()));

create policy "owner access whatsapp" on whatsapp_instances for all
  using (barbershop_id in (select barbershop_id from users where id = auth.uid()));

create policy "owner access calendar" on calendar_integrations for all
  using (barbershop_id in (select barbershop_id from users where id = auth.uid()));

create policy "owner access appointments" on appointments for all
  using (barbershop_id in (select barbershop_id from users where id = auth.uid()));
