alter table public.places
  add column if not exists design_score numeric(2, 1) not null default 4.0 check (design_score >= 0 and design_score <= 5),
  add column if not exists espresso_score numeric(2, 1) not null default 4.0 check (espresso_score >= 0 and espresso_score <= 5),
  add column if not exists quietness_score numeric(2, 1) not null default 3.5 check (quietness_score >= 0 and quietness_score <= 5),
  add column if not exists aesthetic_view_score numeric(2, 1) not null default 4.0 check (aesthetic_view_score >= 0 and aesthetic_view_score <= 5),
  add column if not exists google_maps_url text not null default '',
  add column if not exists instagram_url text not null default '',
  add column if not exists website_url text not null default '',
  add column if not exists phone text not null default '',
  add column if not exists editor_review text not null default '',
  add column if not exists best_for text[] not null default array[]::text[],
  add column if not exists atmosphere_tags text[] not null default array[]::text[],
  add column if not exists mood text not null default '';

update public.places
set
  design_score = coalesce(nullif(attributes->>'designFactor', '')::numeric, design_score, 4.0),
  espresso_score = coalesce(nullif(attributes->>'coffeeRating', '')::numeric, espresso_score, 4.0),
  quietness_score = coalesce(nullif(attributes->>'quietScore', '')::numeric, quietness_score, 3.5),
  aesthetic_view_score = coalesce(
    nullif(attributes->>'aestheticViewScore', '')::numeric,
    case when (attributes->>'photogenic')::boolean is true then 4.8 else aesthetic_view_score end,
    4.0
  ),
  editor_review = coalesce(nullif(editor_review, ''), long_description, editorial_description, ''),
  atmosphere_tags = case
    when cardinality(atmosphere_tags) > 0 then atmosphere_tags
    else coalesce(
      (
        select array_agg(t.name order by t.name)
        from public.place_tags pt
        join public.tags t on t.id = pt.tag_id
        where pt.place_id = places.id
      ),
      array[]::text[]
    )
  end
where true;
