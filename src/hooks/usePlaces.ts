import { useEffect, useState } from 'react';
import { SAMPLE_PLACES } from '../data/places';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Category, Place } from '../types';

type SupabasePlaceRow = {
  id: string;
  name: string;
  city: string;
  district: string;
  category: string;
  price_level: string;
  rating: number | string;
  review_count: number | null;
  design_score?: number | string | null;
  espresso_score?: number | string | null;
  quietness_score?: number | string | null;
  aesthetic_view_score?: number | string | null;
  editorial_description: string;
  long_description: string;
  editor_review?: string | null;
  best_for?: string[] | null;
  atmosphere_tags?: string[] | null;
  mood?: string | null;
  image_url: string;
  address: string;
  google_maps_url?: string | null;
  instagram_url?: string | null;
  website_url?: string | null;
  phone?: string | null;
  lat: number | string;
  lng: number | string;
  map_x: number | string;
  map_y: number | string;
  attributes: Partial<Place['attributes']> | null;
  features: string[] | null;
  place_tags?: { tags: { name: string } | null }[] | null;
};

type PlacesSource = 'supabase' | 'fallback';

const categories: Category[] = [
  'Coffee',
  'Food',
  'Dessert',
  'Bar',
  'Breakfast',
  'Work-friendly',
  'Date',
  'Photogenic',
];

const isCategory = (value: string): value is Category =>
  categories.includes(value as Category);

const toNumber = (value: number | string): number =>
  typeof value === 'number' ? value : Number(value);

const toOptionalNumber = (value: number | string | null | undefined): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = toNumber(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const isMissingPhase3ColumnError = (error: { code?: string; message?: string } | null) =>
  Boolean(
    error &&
      (error.code === '42703' ||
        error.message?.includes('does not exist') ||
        error.message?.includes('Could not find'))
  );

const mapSupabasePlace = (row: SupabasePlaceRow): Place => ({
  id: row.id,
  name: row.name,
  city: row.city,
  district: row.district,
  category: isCategory(row.category) ? row.category : 'Food',
  priceLevel: row.price_level as Place['priceLevel'],
  rating: toNumber(row.rating),
  reviewCount: row.review_count ?? 0,
  designScore: toOptionalNumber(row.design_score) ?? row.attributes?.designFactor,
  espressoScore: toOptionalNumber(row.espresso_score) ?? row.attributes?.coffeeRating,
  quietnessScore: toOptionalNumber(row.quietness_score) ?? row.attributes?.quietScore,
  aestheticViewScore: toOptionalNumber(row.aesthetic_view_score) ?? row.attributes?.aestheticViewScore,
  atmosphereTags:
    row.atmosphere_tags && row.atmosphere_tags.length > 0
      ? row.atmosphere_tags
      : (row.place_tags
          ?.map((placeTag) => placeTag.tags?.name)
          .filter((tag): tag is string => Boolean(tag)) ?? []),
  editorialDescription: row.editorial_description,
  longDescription: row.long_description,
  editorReview: row.editor_review ?? undefined,
  bestFor: row.best_for ?? [],
  mood: row.mood ?? undefined,
  image: row.image_url,
  address: row.address,
  googleMapsUrl: row.google_maps_url ?? undefined,
  instagramUrl: row.instagram_url ?? undefined,
  websiteUrl: row.website_url ?? undefined,
  phone: row.phone ?? undefined,
  coordinates: {
    lat: toNumber(row.lat),
    lng: toNumber(row.lng),
    x: toNumber(row.map_x),
    y: toNumber(row.map_y),
  },
  attributes: {
    coffeeRating: row.attributes?.coffeeRating,
    designFactor: row.attributes?.designFactor,
    quietScore: row.attributes?.quietScore,
    seaView: row.attributes?.seaView,
    affordable: row.attributes?.affordable,
    premium: row.attributes?.premium,
    workFriendly: row.attributes?.workFriendly,
    dateSpot: row.attributes?.dateSpot,
    photogenic: row.attributes?.photogenic,
    aestheticViewScore: toOptionalNumber(row.aesthetic_view_score) ?? row.attributes?.aestheticViewScore,
  },
  features: row.features ?? [],
});

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>(SAMPLE_PLACES);
  const [source, setSource] = useState<PlacesSource>('fallback');
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setPlaces(SAMPLE_PLACES);
      setSource('fallback');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadPlaces() {
      setIsLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
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
          editorial_description,
          long_description,
          editor_review,
          best_for,
          atmosphere_tags,
          mood,
          image_url,
          address,
          google_maps_url,
          instagram_url,
          website_url,
          phone,
          lat,
          lng,
          map_x,
          map_y,
          attributes,
          features,
          place_tags (
            tags (
              name
            )
          )
        `)
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (!isMounted) return;

      if (queryError && isMissingPhase3ColumnError(queryError)) {
        const { data: legacyData, error: legacyError } = await supabase
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
            editorial_description,
            long_description,
            image_url,
            address,
            lat,
            lng,
            map_x,
            map_y,
            attributes,
            features,
            place_tags (
              tags (
                name
              )
            )
          `)
          .eq('published', true)
          .order('sort_order', { ascending: true })
          .order('name', { ascending: true });

        if (!isMounted) return;

        if (legacyError || !legacyData || legacyData.length === 0) {
          setPlaces(SAMPLE_PLACES);
          setSource('fallback');
          setError(legacyError?.message ?? 'Supabase legacy places query returned no published places.');
          setIsLoading(false);
          return;
        }

        setPlaces((legacyData as unknown as SupabasePlaceRow[]).map(mapSupabasePlace));
        setSource('supabase');
        setIsLoading(false);
        return;
      }

      if (queryError || !data || data.length === 0) {
        setPlaces(SAMPLE_PLACES);
        setSource('fallback');
        setError(queryError?.message ?? 'Supabase places query returned no published places.');
        setIsLoading(false);
        return;
      }

      setPlaces((data as unknown as SupabasePlaceRow[]).map(mapSupabasePlace));
      setSource('supabase');
      setIsLoading(false);
    }

    loadPlaces();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    places,
    source,
    isLoading,
    error,
    isUsingFallback: source === 'fallback',
  };
}
