export type ImageSuggestion = {
  id: string;
  source: 'Unsplash' | 'Pexels';
  previewUrl: string;
  downloadUrl: string;
  sourceUrl: string;
  photographer: string;
  creditUrl?: string;
  downloadTrackingUrl?: string;
};

type UnsplashPhoto = {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  links: {
    html: string;
    download_location?: string;
  };
  user: {
    name: string;
    links?: {
      html?: string;
    };
  };
};

type PexelsPhoto = {
  id: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    medium: string;
    large: string;
    large2x?: string;
    original: string;
  };
};

const viteEnv = (import.meta.env ?? {}) as ImportMetaEnv;
const unsplashAccessKey = viteEnv.VITE_UNSPLASH_ACCESS_KEY?.trim();
const pexelsApiKey = viteEnv.VITE_PEXELS_API_KEY?.trim();

export const hasImageSuggestionProvider = Boolean(unsplashAccessKey || pexelsApiKey);

export const getCityImageQuery = (cityName: string) => {
  const specialQueries: Record<string, string> = {
    Antalya: 'Antalya Turkey old town',
    İstanbul: 'İstanbul Turkey city',
    İzmir: 'İzmir Turkey city',
    Mardin: 'Mardin Turkey old town',
    Nevşehir: 'Cappadocia Nevşehir Turkey',
    Trabzon: 'Trabzon Turkey city',
  };

  return specialQueries[cityName] ?? `${cityName} Turkey city`;
};

async function searchUnsplash(query: string): Promise<ImageSuggestion[]> {
  if (!unsplashAccessKey) return [];

  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '12');
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('client_id', unsplashAccessKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Unsplash image search failed. Status: ${response.status}`);
  }

  const data = (await response.json()) as { results?: UnsplashPhoto[] };
  return (data.results ?? []).map((photo) => ({
    id: `unsplash-${photo.id}`,
    source: 'Unsplash',
    previewUrl: photo.urls.small,
    downloadUrl: photo.urls.regular,
    sourceUrl: photo.links.html,
    photographer: photo.user.name,
    creditUrl: photo.user.links?.html,
    downloadTrackingUrl: photo.links.download_location,
  }));
}

async function searchPexels(query: string): Promise<ImageSuggestion[]> {
  if (!pexelsApiKey) return [];

  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '12');
  url.searchParams.set('orientation', 'landscape');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: pexelsApiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Pexels image search failed. Status: ${response.status}`);
  }

  const data = (await response.json()) as { photos?: PexelsPhoto[] };
  return (data.photos ?? []).map((photo) => ({
    id: `pexels-${photo.id}`,
    source: 'Pexels',
    previewUrl: photo.src.medium,
    downloadUrl: photo.src.large2x ?? photo.src.large ?? photo.src.original,
    sourceUrl: photo.url,
    photographer: photo.photographer,
    creditUrl: photo.photographer_url,
  }));
}

export async function searchCityImageSuggestions(cityName: string) {
  const query = getCityImageQuery(cityName);
  const results = await Promise.allSettled([searchUnsplash(query), searchPexels(query)]);
  const suggestions = results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));

  if (suggestions.length === 0) {
    const rejected = results.find((result) => result.status === 'rejected');
    if (rejected?.status === 'rejected') {
      throw rejected.reason instanceof Error ? rejected.reason : new Error('Image search failed.');
    }
  }

  return suggestions.slice(0, 12);
}

export async function trackUnsplashDownload(suggestion: ImageSuggestion) {
  if (!unsplashAccessKey || !suggestion.downloadTrackingUrl) return;

  const url = new URL(suggestion.downloadTrackingUrl);
  url.searchParams.set('client_id', unsplashAccessKey);

  await fetch(url.toString()).catch(() => undefined);
}
