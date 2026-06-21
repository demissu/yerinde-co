import { useCallback, useEffect, useMemo, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { DEFAULT_COLLECTIONS } from '../lib/savedCollections';
import { SavedListName } from '../types';

type CollectionRow = {
  id: string;
  name: SavedListName;
  sort_order: number;
  collection_items?: { place_id: string }[] | null;
};

type SupabaseErrorLike = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

const LOCAL_STORAGE_KEY = 'yerinde_saves';

const getLocalSavedMap = () => {
  try {
    const storedSaves = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedSaves ? (JSON.parse(storedSaves) as Record<string, SavedListName[]>) : {};
  } catch {
    return {};
  }
};

const writeLocalSavedMap = (savedMap: Record<string, SavedListName[]>) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedMap));
};

const mapCollectionsToSavedMap = (collections: CollectionRow[]) => {
  const nextMap: Record<string, SavedListName[]> = {};

  collections.forEach((collection) => {
    collection.collection_items?.forEach((item) => {
      nextMap[item.place_id] = [...(nextMap[item.place_id] ?? []), collection.name];
    });
  });

  return nextMap;
};

const formatSupabaseError = (context: string, error: SupabaseErrorLike) => {
  const message = [
    `${context}: ${error.message ?? 'Supabase error'}`,
    error.code ? `Code: ${error.code}` : null,
    error.details ? `Details: ${error.details}` : null,
    error.hint ? `Hint: ${error.hint}` : null,
  ].filter(Boolean).join(' | ');

  console.error(message);
  return message;
};

export function useSavedCollections(user: User | null, initialLocalSavedMap: Record<string, SavedListName[]>) {
  const [savedMap, setSavedMap] = useState<Record<string, SavedListName[]>>(initialLocalSavedMap);
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authPrompt, setAuthPrompt] = useState<string | null>(null);

  const isLoggedIn = Boolean(user && supabase);

  const collectionByName = useMemo(() => {
    return new Map(collections.map((collection) => [collection.name, collection]));
  }, [collections]);

  useEffect(() => {
    if (!isLoggedIn) {
      setSavedMap(getLocalSavedMap());
      setCollections([]);
    }
  }, [isLoggedIn]);

  const ensureCollections = useCallback(async () => {
    if (!supabase || !user) return [];

    const rows = DEFAULT_COLLECTIONS.map((collection, index) => ({
      user_id: user.id,
      name: collection.name,
      sort_order: index,
    }));

    const { error: upsertError } = await supabase
      .from('collections')
      .upsert(rows, { onConflict: 'user_id,name' });

    if (upsertError) throw upsertError;

    const { data, error: loadError } = await supabase
      .from('collections')
      .select('id, name, sort_order, collection_items(place_id)')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true });

    if (loadError) throw loadError;
    return (data ?? []) as CollectionRow[];
  }, [user]);

  const migrateLocalSaves = useCallback(async (nextCollections: CollectionRow[]) => {
    if (!supabase || !user) return;

    const localSavedMap = getLocalSavedMap();
    const localPlaceIds = Object.keys(localSavedMap);
    if (localPlaceIds.length === 0) return;

    const { data: validPlaces, error: placesError } = await supabase
      .from('places')
      .select('id')
      .in('id', localPlaceIds);

    if (placesError) {
      throw new Error(formatSupabaseError('Could not validate local saved places', placesError));
    }

    const validPlaceIds = new Set((validPlaces ?? []).map((place) => place.id));
    const collectionLookup = new Map(nextCollections.map((collection) => [collection.name, collection.id]));
    const rows = Object.entries(localSavedMap).flatMap(([placeId, listNames]) =>
      validPlaceIds.has(placeId)
        ? listNames
            .map((listName) => {
              const collectionId = collectionLookup.get(listName);
              if (!collectionId) return null;
              return {
                collection_id: collectionId,
                user_id: user.id,
                place_id: placeId,
              };
            })
            .filter((row): row is { collection_id: string; user_id: string; place_id: string } => Boolean(row))
        : [],
    );

    if (rows.length === 0) return;

    const { error: insertError } = await supabase
      .from('collection_items')
      .upsert(rows, { onConflict: 'collection_id,place_id', ignoreDuplicates: true });

    if (insertError) {
      throw new Error(formatSupabaseError('Could not migrate local saved places', insertError));
    }
  }, [user]);

  const getCollectionForSave = useCallback(async (listName: SavedListName) => {
    const existingCollection = collectionByName.get(listName);
    if (existingCollection) return existingCollection;

    if (!supabase || !user) return null;

    const ensuredCollections = await ensureCollections();
    setCollections(ensuredCollections);
    return ensuredCollections.find((collection) => collection.name === listName) ?? null;
  }, [collectionByName, ensureCollections, user]);

  const loadCollections = useCallback(async () => {
    if (!supabase || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const ensuredCollections = await ensureCollections();
      setCollections(ensuredCollections);

      try {
        await migrateLocalSaves(ensuredCollections);
      } catch (migrationError) {
        setError(migrationError instanceof Error ? migrationError.message : 'Yerel kayıtlar taşınamadı.');
      }

      const loadedCollections = await ensureCollections();
      setCollections(loadedCollections);
      const nextSavedMap = mapCollectionsToSavedMap(loadedCollections);
      setSavedMap(nextSavedMap);
      writeLocalSavedMap(nextSavedMap);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Defter eşitlemesi tamamlanamadı.');
    } finally {
      setIsLoading(false);
    }
  }, [ensureCollections, migrateLocalSaves, user]);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadCollections();
  }, [isLoggedIn, loadCollections]);

  const toggleSave = useCallback(async (placeId: string, listName: SavedListName) => {
    if (!supabase || !user) {
      setAuthPrompt('Defterini kaybetmemek için giriş yap.');
      setSavedMap((current) => {
        const currentLists = current[placeId] || [];
        const updatedLists = currentLists.includes(listName)
          ? currentLists.filter((list) => list !== listName)
          : [...currentLists, listName];
        const nextMap = { ...current, [placeId]: updatedLists };
        writeLocalSavedMap(nextMap);
        return nextMap;
      });
      return;
    }

    setError(null);
    const collection = await getCollectionForSave(listName);
    if (!collection) {
      setError('Defter koleksiyonu bulunamadı. Lütfen tekrar deneyin.');
      return;
    }

    const isSaved = savedMap[placeId]?.includes(listName);

    setSavedMap((current) => {
      const currentLists = current[placeId] || [];
      const updatedLists = isSaved
        ? currentLists.filter((list) => list !== listName)
        : [...currentLists, listName];
      const nextMap = { ...current, [placeId]: updatedLists };
      writeLocalSavedMap(nextMap);
      return nextMap;
    });

    if (isSaved) {
      const { error: deleteError } = await supabase
        .from('collection_items')
        .delete()
        .eq('user_id', user.id)
        .eq('collection_id', collection.id)
        .eq('place_id', placeId);

      if (deleteError) {
        setError(formatSupabaseError('Could not unsave place', deleteError));
        await loadCollections();
      }
      return;
    }

    const { error: insertError } = await supabase
      .from('collection_items')
      .upsert(
        {
          collection_id: collection.id,
          user_id: user.id,
          place_id: placeId,
        },
        { onConflict: 'collection_id,place_id', ignoreDuplicates: true },
      );

    if (insertError) {
      setError(formatSupabaseError('Could not save place', insertError));
      await loadCollections();
    }
  }, [getCollectionForSave, loadCollections, savedMap, user]);

  return {
    savedMap,
    collections,
    isLoading,
    error,
    authPrompt,
    clearAuthPrompt: () => setAuthPrompt(null),
    toggleSave,
    refresh: loadCollections,
  };
}
