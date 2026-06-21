drop policy if exists "Users can update own collection items" on public.collection_items;
create policy "Users can update own collection items"
  on public.collection_items
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.collections
      where collections.id = collection_items.collection_id
        and collections.user_id = auth.uid()
    )
  );
