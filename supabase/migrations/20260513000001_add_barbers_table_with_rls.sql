-- ============================================================
-- 1. Create barbers table (was missing from initial migration)
-- ============================================================
create table if not exists barbers (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade,
  nome text not null,
  foto_url text,
  ativo boolean default true,
  created_at timestamptz default now()
);

alter table barbers enable row level security;

create policy "owner access barbers" on barbers for all
  using (barbershop_id in (select barbershop_id from users where id = auth.uid()));

create policy "public read barbers" on barbers for select
  using (ativo = true);

-- ============================================================
-- 2. Public RLS policies for the booking flow
--    (allows unauthenticated visitors to book appointments)
-- ============================================================

-- Public can read active barbershops by slug
create policy "public read active barbershops" on barbershops for select
  using (ativo = true);

-- Public can read active services
create policy "public read active services" on services for select
  using (ativo = true);

-- Public can read business hours
create policy "public read business hours" on business_hours for select
  using (true);

-- Public can create appointments (booking flow)
create policy "public insert appointments" on appointments for insert
  with check (true);

-- Public can read appointments for slot availability checks
create policy "public read appointments for availability" on appointments for select
  using (status = 'confirmed');

-- ============================================================
-- 3. Prevent double-bookings at the database level
-- ============================================================
create unique index if not exists idx_unique_booking
  on appointments (barbershop_id, data, horario)
  where status = 'confirmed';
