import React, { ChangeEvent, useEffect, useState } from 'react';
import { deleteMediaAsset, listMediaAssets, MediaAsset, uploadMediaAsset } from './mediaService';

interface MediaPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const inputClass =
  'w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400';

export default function MediaPicker({
  label,
  value,
  onChange,
  required = false,
  className = '',
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setAssets(await listMediaAssets());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load media library.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    }
  }, [isOpen]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      const asset = await uploadMediaAsset(file);
      onChange(asset.url);
      setAssets((current) => [asset, ...current]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not upload image.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!window.confirm(`Delete "${asset.file_name}" from the media library?`)) {
      return;
    }

    try {
      setError(null);
      await deleteMediaAsset(asset);
      setAssets((current) => current.filter((item) => item.id !== asset.id));
      if (value === asset.url) {
        onChange('');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete image.');
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard?.writeText(url);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="space-y-1.5 block">
        <span className="block text-sm font-medium text-slate-700">{label}</span>
        <input
          required={required}
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          placeholder="Paste image URL or choose from media library"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
        >
          {isOpen ? 'Hide media library' : 'Choose from media library'}
        </button>
        <label className="border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer">
          {isUploading ? 'Uploading...' : 'Upload new image'}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} className="hidden" />
        </label>
      </div>

      {value && (
        <img
          src={value}
          alt=""
          className="w-28 h-20 rounded-md object-cover border border-slate-200 bg-slate-100"
        />
      )}

      {isOpen && (
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-3">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-xs">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-sm text-slate-500">Loading media...</div>
          ) : assets.length === 0 ? (
            <div className="text-sm text-slate-500">No uploaded images yet.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {assets.map((asset) => (
                <div key={asset.id} className="bg-white border border-slate-200 rounded-md overflow-hidden">
                  <button type="button" onClick={() => onChange(asset.url)} className="block w-full text-left">
                    <img src={asset.url} alt={asset.file_name} className="w-full aspect-4/3 object-cover bg-slate-100" />
                  </button>
                  <div className="p-2 space-y-2">
                    <p className="text-xs text-slate-600 truncate" title={asset.file_name}>
                      {asset.file_name}
                    </p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => onChange(asset.url)}
                        className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs hover:bg-slate-100"
                      >
                        Select
                      </button>
                      <button
                        type="button"
                        onClick={() => copyUrl(asset.url)}
                        className="border border-slate-300 rounded px-2 py-1 text-xs hover:bg-slate-100"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(asset)}
                        className="border border-red-200 text-red-700 rounded px-2 py-1 text-xs hover:bg-red-50"
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
      )}
    </div>
  );
}
