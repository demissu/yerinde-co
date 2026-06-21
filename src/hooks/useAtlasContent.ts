import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type AtlasRegionContent = {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  routeCount: number;
  moodTags: string[];
};

export type AtlasCityContent = {
  id: string;
  plateCode?: string;
  name: string;
  region: string;
  why: string;
  coverImage: string;
  tags: string[];
};

export type AtlasRouteContent = {
  id: string;
  title: string;
  area: string;
  description: string;
  image: string;
  duration: string;
  stops: number;
  tags: string[];
  placeIds: string[];
};

type AtlasContent = {
  regions: AtlasRegionContent[];
  cities: AtlasCityContent[];
  routes: AtlasRouteContent[];
  isLoading: boolean;
  error: string | null;
};

type AtlasItemRow = {
  id: string;
  plate_code?: string | null;
  name: string;
  region: string | null;
  city: string | null;
  description: string;
  cover_image_url: string;
  tags: string[] | null;
};

type AtlasRouteRow = {
  id: string;
  title: string;
  region: string | null;
  city: string | null;
  description: string;
  cover_image_url: string;
  duration: string | null;
  stop_count: number | null;
  place_ids: string[] | null;
  tags: string[] | null;
};

export function useAtlasContent(): AtlasContent {
  const [content, setContent] = useState<AtlasContent>({
    regions: [],
    cities: [],
    routes: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!supabase) return;

    let isCancelled = false;

    async function loadAtlasContent() {
      try {
        setContent((current) => ({ ...current, isLoading: true, error: null }));

        const [regionsResult, citiesResult, routesResult] = await Promise.all([
          supabase
            .from('atlas_regions')
            .select('id, name, region, city, description, cover_image_url, tags')
            .eq('published', true)
            .order('sort_order', { ascending: true })
            .order('name', { ascending: true }),
          supabase
            .from('atlas_cities')
            .select('*')
            .eq('published', true)
            .order('sort_order', { ascending: true })
            .order('name', { ascending: true }),
          supabase
            .from('atlas_routes')
            .select('id, title, region, city, description, cover_image_url, duration, stop_count, place_ids, tags')
            .eq('published', true)
            .order('sort_order', { ascending: true })
            .order('title', { ascending: true }),
        ]);

        const firstError = regionsResult.error ?? citiesResult.error ?? routesResult.error;
        if (firstError) {
          throw firstError;
        }

        if (isCancelled) return;

        setContent({
          regions: ((regionsResult.data ?? []) as AtlasItemRow[]).map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            coverImage: row.cover_image_url,
            routeCount: 0,
            moodTags: row.tags ?? [],
          })),
          cities: ((citiesResult.data ?? []) as AtlasItemRow[]).map((row) => ({
            id: row.id,
            plateCode: row.plate_code ?? undefined,
            name: row.name,
            region: row.region ?? '',
            why: row.description,
            coverImage: row.cover_image_url,
            tags: row.tags ?? [],
          })),
          routes: ((routesResult.data ?? []) as AtlasRouteRow[]).map((row) => ({
            id: row.id,
            title: row.title,
            area: row.city || row.region || 'Türkiye',
            description: row.description,
            image: row.cover_image_url,
            duration: row.duration ?? '',
            stops: row.stop_count ?? row.place_ids?.length ?? 0,
            tags: row.tags ?? [],
            placeIds: row.place_ids ?? [],
          })),
          isLoading: false,
          error: null,
        });
      } catch (e) {
        if (isCancelled) return;
        setContent((current) => ({
          ...current,
          isLoading: false,
          error: e instanceof Error ? e.message : 'Could not load Atlas content.',
        }));
      }
    }

    loadAtlasContent();

    return () => {
      isCancelled = true;
    };
  }, []);

  return content;
}
