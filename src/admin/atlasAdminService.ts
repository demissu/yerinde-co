import { supabase } from '../lib/supabase';
import {
  AtlasAdminFormValues,
  AtlasAdminRow,
  AtlasKind,
  atlasTableNames,
} from './atlasAdminTypes';

type SupabaseErrorLike = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
  }

  return supabase;
};

const formatSupabaseError = (context: string, error: SupabaseErrorLike) => {
  const parts = [
    `${context}: ${error.message ?? 'Unknown Supabase error.'}`,
    error.code ? `Code: ${error.code}` : null,
    error.details ? `Details: ${error.details}` : null,
    error.hint ? `Hint: ${error.hint}` : null,
  ].filter(Boolean);

  return new Error(parts.join(' | '));
};

export const parseList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const stringifyList = (value: string[] | null | undefined) => value?.join(', ') ?? '';

const numberOrDefault = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getTable = (kind: AtlasKind) => atlasTableNames[kind];

export const getAtlasRowTitle = (row: AtlasAdminRow) => row.title ?? row.name ?? 'Untitled';

export const mapAtlasRowToFormValues = (row: AtlasAdminRow): AtlasAdminFormValues => ({
  id: row.id,
  title: getAtlasRowTitle(row),
  plate_code: row.plate_code ?? '',
  type: row.type ?? '',
  region: row.region ?? '',
  city: row.city ?? '',
  description: row.description ?? '',
  cover_image_url: row.cover_image_url ?? '',
  duration: row.duration ?? '',
  stop_count: String(row.stop_count ?? 0),
  place_ids: stringifyList(row.place_ids),
  tags: stringifyList(row.tags),
  sort_order: String(row.sort_order ?? 0),
  published: row.published,
});

export async function listAtlasItems(kind: AtlasKind, includeDrafts = true) {
  const client = requireSupabase();
  const query = client
    .from(getTable(kind))
    .select('*')
    .order('sort_order', { ascending: true })
    .order(kind === 'routes' ? 'title' : 'name', { ascending: true });

  const { data, error } = includeDrafts ? await query : await query.eq('published', true);

  if (error) throw formatSupabaseError(`Could not load ${kind}`, error);
  return (data ?? []) as unknown as AtlasAdminRow[];
}

export async function getAtlasItem(kind: AtlasKind, id: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from(getTable(kind))
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw formatSupabaseError(`Could not load ${kind.slice(0, -1)}`, error);
  return data as unknown as AtlasAdminRow;
}

export async function saveAtlasItem(kind: AtlasKind, values: AtlasAdminFormValues) {
  const client = requireSupabase();
  const isRoute = kind === 'routes';
  const isCity = kind === 'cities';
  const payload = {
    [isRoute ? 'title' : 'name']: values.title.trim(),
    ...(isCity ? { plate_code: values.plate_code.trim() || null } : {}),
    type: values.type.trim() || (isRoute ? 'route' : kind.slice(0, -1)),
    region: values.region.trim() || null,
    city: values.city.trim() || null,
    description: values.description.trim(),
    cover_image_url: values.cover_image_url.trim(),
    tags: parseList(values.tags),
    sort_order: Math.round(numberOrDefault(values.sort_order, 0)),
    published: values.published,
    ...(isRoute
      ? {
          duration: values.duration.trim(),
          stop_count: Math.max(0, Math.round(numberOrDefault(values.stop_count, 0))),
          place_ids: parseList(values.place_ids),
        }
      : {}),
  };

  if (values.id) {
    const { error } = await client
      .from(getTable(kind))
      .update(payload)
      .eq('id', values.id);

    if (error) throw formatSupabaseError(`Could not save ${kind.slice(0, -1)}`, error);
    return values.id;
  }

  const { data, error } = await client
    .from(getTable(kind))
    .insert(payload)
    .select('id')
    .single();

  if (error) throw formatSupabaseError(`Could not create ${kind.slice(0, -1)}`, error);
  return data.id as string;
}

export async function deleteAtlasItem(kind: AtlasKind, id: string) {
  const client = requireSupabase();
  const { error } = await client
    .from(getTable(kind))
    .delete()
    .eq('id', id);

  if (error) throw formatSupabaseError(`Could not delete ${kind.slice(0, -1)}`, error);
}

export async function setAtlasItemPublished(kind: AtlasKind, id: string, published: boolean) {
  const client = requireSupabase();
  const { error } = await client
    .from(getTable(kind))
    .update({ published })
    .eq('id', id);

  if (error) throw formatSupabaseError(`Could not update ${kind.slice(0, -1)}`, error);
}
