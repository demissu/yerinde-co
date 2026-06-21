create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  username text unique,
  display_name text not null default '',
  avatar_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (
    username is null or username ~ '^[a-z0-9_]{3,24}$'
  )
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null references public.places(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (collection_id, place_id)
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists profiles_username_idx on public.profiles(username);
create index if not exists collections_user_id_idx on public.collections(user_id, sort_order);
create index if not exists collection_items_user_id_idx on public.collection_items(user_id);
create index if not exists collection_items_collection_id_idx on public.collection_items(collection_id);
create index if not exists collection_items_place_id_idx on public.collection_items(place_id);

alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own collections" on public.collections;
create policy "Users can read own collections"
  on public.collections
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own collections" on public.collections;
create policy "Users can insert own collections"
  on public.collections
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own collections" on public.collections;
create policy "Users can update own collections"
  on public.collections
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own collections" on public.collections;
create policy "Users can delete own collections"
  on public.collections
  for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can read own collection items" on public.collection_items;
create policy "Users can read own collection items"
  on public.collection_items
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own collection items" on public.collection_items;
create policy "Users can insert own collection items"
  on public.collection_items
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.collections
      where collections.id = collection_items.collection_id
        and collections.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own collection items" on public.collection_items;
create policy "Users can delete own collection items"
  on public.collection_items
  for delete
  to authenticated
  using (auth.uid() = user_id);

insert into public.profiles (user_id, display_name, avatar_url)
select id, coalesce(raw_user_meta_data->>'full_name', ''), coalesce(raw_user_meta_data->>'avatar_url', '')
from auth.users
where not exists (
  select 1
  from public.profiles
  where profiles.user_id = auth.users.id
);
