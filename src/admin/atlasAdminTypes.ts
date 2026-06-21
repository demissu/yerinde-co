export type AtlasKind = 'regions' | 'cities' | 'destinations' | 'routes';

export const atlasKinds: AtlasKind[] = ['regions', 'cities', 'destinations', 'routes'];

export const atlasKindLabels: Record<AtlasKind, string> = {
  regions: 'Regions',
  cities: 'Cities',
  destinations: 'Destinations',
  routes: 'Routes',
};

export const atlasKindSingularLabels: Record<AtlasKind, string> = {
  regions: 'Region',
  cities: 'City',
  destinations: 'Destination',
  routes: 'Route',
};

export const atlasTableNames: Record<AtlasKind, string> = {
  regions: 'atlas_regions',
  cities: 'atlas_cities',
  destinations: 'atlas_destinations',
  routes: 'atlas_routes',
};

export type AtlasAdminRow = {
  id: string;
  name?: string;
  title?: string;
  plate_code?: string | null;
  type: string;
  region: string | null;
  city: string | null;
  description: string;
  cover_image_url: string;
  duration?: string | null;
  stop_count?: number | null;
  place_ids?: string[] | null;
  tags: string[] | null;
  sort_order: number | null;
  published: boolean;
};

export type AtlasAdminFormValues = {
  id?: string;
  title: string;
  plate_code: string;
  type: string;
  region: string;
  city: string;
  description: string;
  cover_image_url: string;
  duration: string;
  stop_count: string;
  place_ids: string;
  tags: string;
  sort_order: string;
  published: boolean;
};
