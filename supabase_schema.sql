-- Safaro Clean Supabase Schema
create table if not exists public.safaro_store (key text primary key,value jsonb not null,updated_at timestamptz default now());
alter table public.safaro_store enable row level security;
drop policy if exists "safaro_store_select_all" on public.safaro_store;
drop policy if exists "safaro_store_insert_all" on public.safaro_store;
drop policy if exists "safaro_store_update_all" on public.safaro_store;
create policy "safaro_store_select_all" on public.safaro_store for select using (true);
create policy "safaro_store_insert_all" on public.safaro_store for insert with check (true);
create policy "safaro_store_update_all" on public.safaro_store for update using (true) with check (true);
