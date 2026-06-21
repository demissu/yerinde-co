import { supabase } from '../lib/supabase';

export type MediaAsset = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  file_name: string;
  content_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

type SupabaseErrorLike = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

const bucketName = 'media';

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

const sanitizeFileName = (fileName: string) =>
  fileName
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-|-$/g, '');

export const createSafeMediaFileName = sanitizeFileName;

export async function listMediaAssets() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('media_assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw formatSupabaseError('Could not load media library', error);
  return (data ?? []) as MediaAsset[];
}

export async function uploadMediaAsset(file: File) {
  const client = requireSupabase();
  const safeName = sanitizeFileName(file.name) || 'image';
  const path = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await client.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) throw formatSupabaseError('Could not upload image', uploadError);

  const { data: publicUrlData } = client.storage.from(bucketName).getPublicUrl(path);
  const url = publicUrlData.publicUrl;

  const { data, error } = await client
    .from('media_assets')
    .insert({
      bucket: bucketName,
      path,
      url,
      file_name: file.name,
      content_type: file.type || null,
      size_bytes: file.size,
    })
    .select('*')
    .single();

  if (error) throw formatSupabaseError('Could not save media asset', error);
  return data as MediaAsset;
}

export async function uploadRemoteImageToMedia(imageUrl: string, fileName: string) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Could not download selected image. Status: ${response.status}`);
  }

  const blob = await response.blob();
  const contentType = blob.type || 'image/jpeg';
  const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const safeName = sanitizeFileName(fileName).replace(/\.(jpg|jpeg|png|webp)$/i, '') || 'city-image';
  const file = new File([blob], `${safeName}.${extension}`, { type: contentType });

  return uploadMediaAsset(file);
}

export async function deleteMediaAsset(asset: MediaAsset) {
  const client = requireSupabase();
  const { error: storageError } = await client.storage
    .from(asset.bucket || bucketName)
    .remove([asset.path]);

  if (storageError) throw formatSupabaseError('Could not delete media file', storageError);

  const { error } = await client
    .from('media_assets')
    .delete()
    .eq('id', asset.id);

  if (error) throw formatSupabaseError('Could not delete media asset', error);
}
