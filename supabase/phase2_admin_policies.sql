-- Phase 2 temporary admin policies.
-- These allow the unauthenticated /admin UI to manage places before Phase 3 auth exists.
-- Replace these with authenticated role-based policies when authentication is implemented.

drop policy if exists "Temporary anon admin can read all places" on public.places;
create policy "Temporary anon admin can read all places"
  on public.places
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Temporary anon admin can insert places" on public.places;
create policy "Temporary anon admin can insert places"
  on public.places
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Temporary anon admin can update places" on public.places;
create policy "Temporary anon admin can update places"
  on public.places
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Temporary anon admin can delete places" on public.places;
create policy "Temporary anon admin can delete places"
  on public.places
  for delete
  to anon, authenticated
  using (true);

drop policy if exists "Temporary anon admin can insert tags" on public.tags;
create policy "Temporary anon admin can insert tags"
  on public.tags
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Temporary anon admin can update tags" on public.tags;
create policy "Temporary anon admin can update tags"
  on public.tags
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Temporary anon admin can manage place tags" on public.place_tags;
create policy "Temporary anon admin can manage place tags"
  on public.place_tags
  for all
  to anon, authenticated
  using (true)
  with check (true);
