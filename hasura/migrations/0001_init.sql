create extension if not exists pgcrypto;

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.chats enable row level security;
alter table public.messages enable row level security;

create policy chats_isolation on public.chats
  using (user_id = (current_setting('hasura.user', true)::jsonb ->> 'x-hasura-user-id')::uuid)
  with check (user_id = (current_setting('hasura.user', true)::jsonb ->> 'x-hasura-user-id')::uuid);

create policy messages_isolation on public.messages
  using (user_id = (current_setting('hasura.user', true)::jsonb ->> 'x-hasura-user-id')::uuid)
  with check (user_id = (current_setting('hasura.user', true)::jsonb ->> 'x-hasura-user-id')::uuid);


