create extension if not exists pgcrypto;

create table if not exists public.atlas_regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'region',
  region text,
  city text,
  description text not null default '',
  cover_image_url text not null default '',
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'city',
  region text,
  city text,
  description text not null default '',
  cover_image_url text not null default '',
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'destination',
  region text,
  city text,
  description text not null default '',
  cover_image_url text not null default '',
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_routes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'route',
  region text,
  city text,
  description text not null default '',
  cover_image_url text not null default '',
  duration text not null default '',
  stop_count integer not null default 0,
  place_ids text[] not null default '{}',
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null unique,
  url text not null,
  file_name text not null,
  content_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_atlas_regions_updated_at on public.atlas_regions;
create trigger set_atlas_regions_updated_at
before update on public.atlas_regions
for each row execute function public.set_updated_at();

drop trigger if exists set_atlas_cities_updated_at on public.atlas_cities;
create trigger set_atlas_cities_updated_at
before update on public.atlas_cities
for each row execute function public.set_updated_at();

drop trigger if exists set_atlas_destinations_updated_at on public.atlas_destinations;
create trigger set_atlas_destinations_updated_at
before update on public.atlas_destinations
for each row execute function public.set_updated_at();

drop trigger if exists set_atlas_routes_updated_at on public.atlas_routes;
create trigger set_atlas_routes_updated_at
before update on public.atlas_routes
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

alter table public.atlas_regions enable row level security;
alter table public.atlas_cities enable row level security;
alter table public.atlas_destinations enable row level security;
alter table public.atlas_routes enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists "Public can read published atlas regions" on public.atlas_regions;
create policy "Public can read published atlas regions"
on public.atlas_regions for select
using (published = true);

drop policy if exists "Temporary admin can manage atlas regions" on public.atlas_regions;
create policy "Temporary admin can manage atlas regions"
on public.atlas_regions for all
using (true)
with check (true);

drop policy if exists "Public can read published atlas cities" on public.atlas_cities;
create policy "Public can read published atlas cities"
on public.atlas_cities for select
using (published = true);

drop policy if exists "Temporary admin can manage atlas cities" on public.atlas_cities;
create policy "Temporary admin can manage atlas cities"
on public.atlas_cities for all
using (true)
with check (true);

drop policy if exists "Public can read published atlas destinations" on public.atlas_destinations;
create policy "Public can read published atlas destinations"
on public.atlas_destinations for select
using (published = true);

drop policy if exists "Temporary admin can manage atlas destinations" on public.atlas_destinations;
create policy "Temporary admin can manage atlas destinations"
on public.atlas_destinations for all
using (true)
with check (true);

drop policy if exists "Public can read published atlas routes" on public.atlas_routes;
create policy "Public can read published atlas routes"
on public.atlas_routes for select
using (published = true);

drop policy if exists "Temporary admin can manage atlas routes" on public.atlas_routes;
create policy "Temporary admin can manage atlas routes"
on public.atlas_routes for all
using (true)
with check (true);

drop policy if exists "Public can read media assets" on public.media_assets;
create policy "Public can read media assets"
on public.media_assets for select
using (true);

drop policy if exists "Temporary admin can manage media assets" on public.media_assets;
create policy "Temporary admin can manage media assets"
on public.media_assets for all
using (true)
with check (true);

drop policy if exists "Public can read media files" on storage.objects;
create policy "Public can read media files"
on storage.objects for select
using (bucket_id = 'media');

drop policy if exists "Temporary admin can upload media files" on storage.objects;
create policy "Temporary admin can upload media files"
on storage.objects for insert
with check (bucket_id = 'media');

drop policy if exists "Temporary admin can update media files" on storage.objects;
create policy "Temporary admin can update media files"
on storage.objects for update
using (bucket_id = 'media')
with check (bucket_id = 'media');

drop policy if exists "Temporary admin can delete media files" on storage.objects;
create policy "Temporary admin can delete media files"
on storage.objects for delete
using (bucket_id = 'media');
