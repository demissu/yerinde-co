import React, { ChangeEvent, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { deleteMediaAsset, listMediaAssets, MediaAsset, uploadMediaAsset } from './mediaService';

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setAssets(await listMediaAssets());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load media.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      await uploadMediaAsset(file);
      await loadAssets();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not upload image.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!window.confirm(`Delete "${asset.file_name}"?`)) {
      return;
    }

    try {
      setError(null);
      await deleteMediaAsset(asset);
      await loadAssets();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete image.');
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard?.writeText(url);
  };

  return (
    <AdminLayout
      title="Media Library"
      action={
        <label className="bg-slate-950 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800 cursor-pointer">
          {isUploading ? 'Uploading...' : 'Upload image'}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} className="hidden" />
        </label>
      }
    >
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        {error && (
          <div className="m-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-sm text-slate-500">Loading media...</div>
        ) : assets.length === 0 ? (
          <div className="p-8 text-sm text-slate-500">No uploaded images yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {assets.map((asset) => (
              <div key={asset.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <img src={asset.url} alt={asset.file_name} className="w-full aspect-16/10 object-cover bg-slate-100" />
                <div className="p-3 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-950 truncate">{asset.file_name}</p>
                    <p className="text-xs text-slate-500 truncate">{asset.path}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyUrl(asset.url)}
                      className="border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDelete(asset)}
                      className="border border-red-200 rounded-md px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
