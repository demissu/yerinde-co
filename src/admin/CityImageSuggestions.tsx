import React, { useState } from 'react';
import {
  hasImageSuggestionProvider,
  ImageSuggestion,
  searchCityImageSuggestions,
  trackUnsplashDownload,
} from './imageSuggestionService';
import { uploadRemoteImageToMedia } from './mediaService';

interface CityImageSuggestionsProps {
  cityName: string;
  onSelect: (url: string) => void;
}

export default function CityImageSuggestions({ cityName, onSelect }: CityImageSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<ImageSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openSuggestions = async () => {
    setIsOpen(true);

    if (!hasImageSuggestionProvider || suggestions.length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuggestions(await searchCityImageSuggestions(cityName));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load image suggestions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = async (suggestion: ImageSuggestion) => {
    try {
      setSelectedId(suggestion.id);
      setError(null);
      await trackUnsplashDownload(suggestion);
      const asset = await uploadRemoteImageToMedia(
        suggestion.downloadUrl,
        `${cityName}-${suggestion.source}-${suggestion.id}`
      );
      onSelect(asset.url);
      setIsOpen(false);
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message} Current image URL was not changed.`
          : 'Could not save selected image. Current image URL was not changed.'
      );
    } finally {
      setSelectedId(null);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openSuggestions}
        className="border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
      >
        Fotoğraf Bul
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 p-4 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Fotoğraf Bul</h2>
                <p className="text-sm text-slate-500 mt-1">{cityName} için şehir fotoğrafı önerileri</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-4">
              {!hasImageSuggestionProvider && (
                <div className="rounded-md border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm">
                  Fotoğraf önerileri için Unsplash veya Pexels API anahtarı ekleyin.
                </div>
              )}

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="p-8 text-sm text-slate-500">Loading image suggestions...</div>
              ) : suggestions.length === 0 && hasImageSuggestionProvider ? (
                <div className="p-8 text-sm text-slate-500">No image suggestions found.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      <img
                        src={suggestion.previewUrl}
                        alt={`${cityName} suggestion by ${suggestion.photographer}`}
                        className="w-full aspect-16/10 object-cover bg-slate-100"
                      />
                      <div className="p-3 space-y-3">
                        <div className="text-xs text-slate-500 space-y-1">
                          <div>
                            Source:{' '}
                            <a href={suggestion.sourceUrl} target="_blank" rel="noreferrer" className="text-slate-800 underline">
                              {suggestion.source}
                            </a>
                          </div>
                          <div>
                            Credit:{' '}
                            {suggestion.creditUrl ? (
                              <a href={suggestion.creditUrl} target="_blank" rel="noreferrer" className="text-slate-800 underline">
                                {suggestion.photographer}
                              </a>
                            ) : (
                              suggestion.photographer
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelect(suggestion)}
                          disabled={selectedId === suggestion.id}
                          className="w-full bg-slate-950 text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50"
                        >
                          {selectedId === suggestion.id ? 'Saving...' : 'Select'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
