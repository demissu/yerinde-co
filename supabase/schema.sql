create extension if not exists pgcrypto;

create table if not exists public.places (
  id text primary key,
  name text not null,
  city text not null,
  district text not null,
  category text not null check (
    category in (
      'Coffee',
      'Food',
      'Dessert',
      'Bar',
      'Breakfast',
      'Work-friendly',
      'Date',
      'Photogenic'
    )
  ),
  price_level text not null check (price_level in ('₺', '₺₺', '₺₺₺', '₺₺₺₺')),
  rating numeric(2, 1) not null check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  design_score numeric(2, 1) not null default 4.0 check (design_score >= 0 and design_score <= 5),
  espresso_score numeric(2, 1) not null default 4.0 check (espresso_score >= 0 and espresso_score <= 5),
  quietness_score numeric(2, 1) not null default 3.5 check (quietness_score >= 0 and quietness_score <= 5),
  aesthetic_view_score numeric(2, 1) not null default 4.0 check (aesthetic_view_score >= 0 and aesthetic_view_score <= 5),
  editorial_description text not null,
  long_description text not null,
  editor_review text not null default '',
  best_for text[] not null default array[]::text[],
  atmosphere_tags text[] not null default array[]::text[],
  mood text not null default '',
  image_url text not null,
  address text not null,
  google_maps_url text not null default '',
  instagram_url text not null default '',
  website_url text not null default '',
  phone text not null default '',
  lat numeric(9, 6) not null,
  lng numeric(9, 6) not null,
  map_x numeric(5, 2) not null,
  map_y numeric(5, 2) not null,
  attributes jsonb not null default '{}'::jsonb,
  features text[] not null default array[]::text[],
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  type text not null default 'atmosphere',
  created_at timestamptz not null default now()
);

create table if not exists public.place_tags (
  place_id text not null references public.places(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (place_id, tag_id)
);

create index if not exists places_published_sort_order_idx
  on public.places (published, sort_order, name);

create index if not exists places_city_district_idx
  on public.places (city, district);

create index if not exists places_category_idx
  on public.places (category);

create index if not exists tags_type_slug_idx
  on public.tags (type, slug);

alter table public.places enable row level security;
alter table public.tags enable row level security;
alter table public.place_tags enable row level security;

drop policy if exists "Public can read published places" on public.places;
create policy "Public can read published places"
  on public.places
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Public can read tags" on public.tags;
create policy "Public can read tags"
  on public.tags
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read published place tags" on public.place_tags;
create policy "Public can read published place tags"
  on public.place_tags
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.places
      where places.id = place_tags.place_id
        and places.published = true
    )
  );
