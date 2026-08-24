-- Conversations table
create table conversations (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade,
  client_nome text,
  client_whatsapp text not null,
  status text default 'open',
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Messages table
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- AI prompt on barbershops
alter table barbershops add column if not exists ai_prompt text;

-- RLS
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "owner access conversations" on conversations for all
  using (barbershop_id in (select barbershop_id from users where id = auth.uid()));

create policy "owner access messages" on messages for all
  using (conversation_id in (
    select id from conversations
    where barbershop_id in (select barbershop_id from users where id = auth.uid())
  ));

-- Indexes
create index on conversations (barbershop_id, last_message_at desc);
create index on messages (conversation_id, created_at asc);
