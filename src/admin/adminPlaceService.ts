import { supabase } from '../lib/supabase';
import { Category } from '../types';
import { AdminPlaceFormValues, AdminPlaceRow } from './adminTypes';

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

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const createPlaceId = (name: string) => {
  const base = slugify(name) || 'place';
  return `place_${base}_${Date.now().toString(36)}`;
};

export const parseTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

const stringifyList = (value: string[] | null | undefined) => value?.join(', ') ?? '';

const numberOrDefault = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const isMissingPhase3ColumnError = (error: SupabaseErrorLike | null) =>
  Boolean(
    error &&
      (error.code === '42703' ||
        error.message?.includes('does not exist') ||
        error.message?.includes('Could not find'))
  );

const formatSupabaseError = (context: string, error: SupabaseErrorLike) => {
  const parts = [
    `${context}: ${error.message ?? 'Unknown Supabase error.'}`,
    error.code ? `Code: ${error.code}` : null,
    error.details ? `Details: ${error.details}` : null,
    error.hint ? `Hint: ${error.hint}` : null,
  ].filter(Boolean);

  return new Error(parts.join(' | '));
};

const getFallbackScores = (row: AdminPlaceRow) => ({
  design_score: row.design_score ?? row.attributes?.designFactor ?? '',
  espresso_score: row.espresso_score ?? row.attributes?.coffeeRating ?? '',
  quietness_score: row.quietness_score ?? row.attributes?.quietScore ?? '',
  aesthetic_view_score:
    row.aesthetic_view_score ??
    row.attributes?.aestheticViewScore ??
    (row.attributes?.photogenic ? 4.8 : ''),
});

export const mapRowToFormValues = (row: AdminPlaceRow): AdminPlaceFormValues => ({
  id: row.id,
  name: row.name,
  city: row.city,
  district: row.district,
  category: row.category,
  price_level: row.price_level,
  rating: String(row.rating ?? 4.5),
  review_count: String(row.review_count ?? 0),
  design_score: String(getFallbackScores(row).design_score),
  espresso_score: String(getFallbackScores(row).espresso_score),
  quietness_score: String(getFallbackScores(row).quietness_score),
  aesthetic_view_score: String(getFallbackScores(row).aesthetic_view_score),
  tags:
    row.place_tags
      ?.map((placeTag) => placeTag.tags?.name)
      .filter((tag): tag is string => Boolean(tag))
      .join(', ') ?? '',
  atmosphere_tags: stringifyList(row.atmosphere_tags) || (row.place_tags
    ?.map((placeTag) => placeTag.tags?.name)
    .filter((tag): tag is string => Boolean(tag))
    .join(', ') ?? ''),
  features: stringifyList(row.features),
  mood: row.mood ?? '',
  image_url: row.image_url,
  address: row.address,
  google_maps_url: row.google_maps_url ?? '',
  instagram_url: row.instagram_url ?? '',
  website_url: row.website_url ?? '',
  phone: row.phone ?? '',
  editorial_description: row.editorial_description,
  long_description: row.long_description,
  editor_review: row.editor_review ?? row.long_description ?? '',
  best_for: stringifyList(row.best_for),
  lat: String(row.lat),
  lng: String(row.lng),
  map_x: String(row.map_x),
  map_y: String(row.map_y),
  published: row.published,
});

export async function listAdminPlaces() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('places')
    .select(`
      id,
      name,
      city,
      district,
      category,
      price_level,
      rating,
      review_count,
      design_score,
      espresso_score,
      quietness_score,
      aesthetic_view_score,
      image_url,
      editorial_description,
      long_description,
      editor_review,
      best_for,
      atmosphere_tags,
      features,
      mood,
      address,
      google_maps_url,
      instagram_url,
      website_url,
      phone,
      lat,
      lng,
      map_x,
      map_y,
      published,
      sort_order,
      place_tags (
        tags (
          name
        )
      )
    `)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error && !isMissingPhase3ColumnError(error)) {
    throw formatSupabaseError('Could not load places', error);
  }

  if (error && isMissingPhase3ColumnError(error)) {
    const fallback = await client
      .from('places')
      .select(`
        id,
        name,
        city,
        district,
        category,
        price_level,
        rating,
        review_count,
        image_url,
        editorial_description,
        long_description,
        address,
        lat,
        lng,
        map_x,
        map_y,
        attributes,
        features,
        published,
        sort_order,
        place_tags (
          tags (
            name
          )
        )
      `)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (fallback.error) throw formatSupabaseError('Could not load places with legacy schema', fallback.error);
    return (fallback.data ?? []) as unknown as AdminPlaceRow[];
  }

  return (data ?? []) as unknown as AdminPlaceRow[];
}

export async function getAdminPlace(id: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('places')
    .select(`
      id,
      name,
      city,
      district,
      category,
      price_level,
      rating,
      review_count,
      design_score,
      espresso_score,
      quietness_score,
      aesthetic_view_score,
      image_url,
      editorial_description,
      long_description,
      editor_review,
      best_for,
      atmosphere_tags,
      features,
      mood,
      address,
      google_maps_url,
      instagram_url,
      website_url,
      phone,
      lat,
      lng,
      map_x,
      map_y,
      published,
      sort_order,
      place_tags (
        tags (
          name
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error && !isMissingPhase3ColumnError(error)) {
    throw formatSupabaseError('Could not load place', error);
  }

  if (error && isMissingPhase3ColumnError(error)) {
    const fallback = await client
      .from('places')
      .select(`
        id,
        name,
        city,
        district,
        category,
        price_level,
        rating,
        review_count,
        image_url,
        editorial_description,
        long_description,
        address,
        lat,
        lng,
        map_x,
        map_y,
        attributes,
        features,
        published,
        sort_order,
        place_tags (
          tags (
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (fallback.error) throw formatSupabaseError('Could not load place with legacy schema', fallback.error);
    return fallback.data as unknown as AdminPlaceRow;
  }

  return data as unknown as AdminPlaceRow;
}

async function replacePlaceTags(placeId: string, tagNames: string[]) {
  const client = requireSupabase();
  const uniqueTagNames = Array.from(new Set(tagNames));

  const { error: deleteError } = await client
    .from('place_tags')
    .delete()
    .eq('place_id', placeId);

  if (deleteError) throw formatSupabaseError('Could not replace place tags', deleteError);

  if (uniqueTagNames.length === 0) {
    return;
  }

  const tagRows = uniqueTagNames.map((name) => ({
    slug: slugify(name),
    name,
    type: 'atmosphere',
  }));

  const { error: upsertTagsError } = await client
    .from('tags')
    .upsert(tagRows, { onConflict: 'slug' });

  if (upsertTagsError) throw formatSupabaseError('Could not save tags', upsertTagsError);

  const { data: tags, error: tagsError } = await client
    .from('tags')
    .select('id, slug')
    .in('slug', tagRows.map((tag) => tag.slug));

  if (tagsError) throw formatSupabaseError('Could not reload saved tags', tagsError);

  const placeTagRows =
    tags?.map((tag) => ({
      place_id: placeId,
      tag_id: tag.id,
    })) ?? [];

  const { error: insertPlaceTagsError } = await client
    .from('place_tags')
    .insert(placeTagRows);

  if (insertPlaceTagsError) throw formatSupabaseError('Could not link tags to place', insertPlaceTagsError);
}

const buildLegacyPayload = (values: AdminPlaceFormValues) => ({
  name: values.name.trim(),
  city: values.city.trim(),
  district: values.district.trim(),
  category: values.category as Category,
  price_level: values.price_level,
  rating: numberOrDefault(values.rating, 4.5),
  review_count: Math.max(0, Math.round(numberOrDefault(values.review_count, 0))),
  image_url: values.image_url.trim(),
  editorial_description: values.editorial_description.trim(),
  long_description: values.long_description.trim() || values.editorial_description.trim(),
  address: values.address.trim(),
  lat: Number(values.lat),
  lng: Number(values.lng),
  map_x: Number(values.map_x),
  map_y: Number(values.map_y),
  attributes: {
    coffeeRating: numberOrDefault(values.espresso_score, 0),
    designFactor: numberOrDefault(values.design_score, 0),
    quietScore: numberOrDefault(values.quietness_score, 0),
    aestheticViewScore: numberOrDefault(values.aesthetic_view_score, 0),
    seaView: false,
    affordable: false,
    premium: numberOrDefault(values.rating, 0) >= 4.8,
    workFriendly: values.category === 'Work-friendly',
    dateSpot: values.category === 'Date',
    photogenic: numberOrDefault(values.aesthetic_view_score, 0) >= 4.5,
  },
  features: parseTags(values.features),
  published: values.published,
});

export async function saveAdminPlace(values: AdminPlaceFormValues) {
  const client = requireSupabase();
  const isEditing = Boolean(values.id);
  const placeId = values.id ?? createPlaceId(values.name);
  const sharedPayload = {
    name: values.name.trim(),
    city: values.city.trim(),
    district: values.district.trim(),
    category: values.category as Category,
    price_level: values.price_level,
    rating: numberOrDefault(values.rating, 4.5),
    review_count: Math.max(0, Math.round(numberOrDefault(values.review_count, 0))),
    design_score: numberOrDefault(values.design_score, 0),
    espresso_score: numberOrDefault(values.espresso_score, 0),
    quietness_score: numberOrDefault(values.quietness_score, 0),
    aesthetic_view_score: numberOrDefault(values.aesthetic_view_score, 0),
    image_url: values.image_url.trim(),
    editorial_description: values.editorial_description.trim(),
    long_description: values.long_description.trim() || values.editorial_description.trim(),
    editor_review: values.editor_review.trim() || values.long_description.trim() || values.editorial_description.trim(),
    best_for: parseTags(values.best_for),
    atmosphere_tags: parseTags(values.atmosphere_tags || values.tags),
    features: parseTags(values.features),
    mood: values.mood.trim(),
    address: values.address.trim(),
    google_maps_url: values.google_maps_url.trim(),
    instagram_url: values.instagram_url.trim(),
    website_url: values.website_url.trim(),
    phone: values.phone.trim(),
    lat: Number(values.lat),
    lng: Number(values.lng),
    map_x: Number(values.map_x),
    map_y: Number(values.map_y),
    published: values.published,
  };

  if (isEditing) {
    const { error } = await client
      .from('places')
      .update(sharedPayload)
      .eq('id', placeId);

    if (error && !isMissingPhase3ColumnError(error)) {
      throw formatSupabaseError('Could not save place', error);
    }

    if (error && isMissingPhase3ColumnError(error)) {
      const fallback = await client
        .from('places')
        .update(buildLegacyPayload(values))
        .eq('id', placeId);

      if (fallback.error) throw formatSupabaseError('Could not save place with legacy schema', fallback.error);
    }

    await replacePlaceTags(placeId, parseTags(values.atmosphere_tags || values.tags));
    return placeId;
  }

  const { data: latestPlace } = await client
    .from('places')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    id: placeId,
    ...sharedPayload,
    attributes: {},
    sort_order: ((latestPlace?.sort_order as number | null) ?? 0) + 1,
  };

  const { error } = await client
    .from('places')
    .insert(payload);

  if (error && !isMissingPhase3ColumnError(error)) {
    throw formatSupabaseError('Could not create place', error);
  }

  if (error && isMissingPhase3ColumnError(error)) {
    const fallbackPayload = {
      id: placeId,
      ...buildLegacyPayload(values),
      sort_order: ((latestPlace?.sort_order as number | null) ?? 0) + 1,
    };

    const fallback = await client
      .from('places')
      .insert(fallbackPayload);

    if (fallback.error) throw formatSupabaseError('Could not create place with legacy schema', fallback.error);
  }

  await replacePlaceTags(placeId, parseTags(values.atmosphere_tags || values.tags));
  return placeId;
}

export async function deleteAdminPlace(id: string) {
  const client = requireSupabase();
  const { error } = await client
    .from('places')
    .delete()
    .eq('id', id);

  if (error) throw formatSupabaseError('Could not delete place', error);
}

export async function setAdminPlacePublished(id: string, published: boolean) {
  const client = requireSupabase();
  const { error } = await client
    .from('places')
    .update({ published })
    .eq('id', id);

  if (error) throw formatSupabaseError('Could not update publish state', error);
}
