-- Safaro Supabase Schema
-- این فایل را در Supabase > SQL Editor اجرا کن.

create table if not exists public.safaro_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.safaro_store enable row level security;

-- نسخه دمو برای سایت static:
-- خواندن/نوشتن با anon key آزاد است.
-- برای نسخه نهایی تجاری بهتر است Auth و RLS اختصاصی تنظیم شود.
drop policy if exists "safaro_store_select_all" on public.safaro_store;
drop policy if exists "safaro_store_insert_all" on public.safaro_store;
drop policy if exists "safaro_store_update_all" on public.safaro_store;
drop policy if exists "safaro_store_delete_all" on public.safaro_store;

create policy "safaro_store_select_all"
on public.safaro_store
for select
using (true);

create policy "safaro_store_insert_all"
on public.safaro_store
for insert
with check (true);

create policy "safaro_store_update_all"
on public.safaro_store
for update
using (true)
with check (true);

create policy "safaro_store_delete_all"
on public.safaro_store
for delete
using (true);

-- تست اختیاری بعد از اجرای SQL
insert into public.safaro_store(key,value,updated_at)
values ('supabase_test','{"ok": true}'::jsonb, now())
on conflict (key) do update set value=excluded.value, updated_at=now();
