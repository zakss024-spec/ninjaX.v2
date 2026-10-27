create extension if not exists pgcrypto;
create table if not exists public.messages(id uuid primary key default gen_random_uuid(),user_id uuid null,username text not null,content text not null check(char_length(content) between 1 and 2000),created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists public.profiles(id uuid primary key default gen_random_uuid(),username text unique not null,display_name text,avatar_url text,online boolean default false,last_seen timestamptz default now(),created_at timestamptz default now());
create table if not exists public.global_senders(id uuid primary key default gen_random_uuid(),name text not null,sender_id text unique not null,avatar_url text,status text default 'ACTIVE',created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists public.notifications(id uuid primary key default gen_random_uuid(),user_id uuid null,title text not null,body text,read boolean default false,created_at timestamptz default now());
alter table public.messages enable row level security;
alter table public.profiles enable row level security;
alter table public.global_senders enable row level security;
alter table public.notifications enable row level security;
drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages for select to anon,authenticated using(true);
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert to anon,authenticated with check(char_length(content) between 1 and 2000);
drop policy if exists senders_select on public.global_senders;
create policy senders_select on public.global_senders for select to anon,authenticated using(true);
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to anon,authenticated using(true);
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'global_senders'
  ) then
    alter publication supabase_realtime add table public.global_senders;
  end if;
end $$;