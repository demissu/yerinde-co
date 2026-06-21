import React, { FormEvent, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import {
  getAtlasItem,
  mapAtlasRowToFormValues,
  saveAtlasItem,
} from './atlasAdminService';
import { AtlasAdminFormValues, AtlasKind, atlasKindSingularLabels } from './atlasAdminTypes';
import CityImageSuggestions from './CityImageSuggestions';
import MediaPicker from './MediaPicker';

interface AdminAtlasEditorPageProps {
  kind: AtlasKind;
  itemId?: string;
}

const inputClass =
  'w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400';

const defaultValues = (kind: AtlasKind): AtlasAdminFormValues => ({
  title: '',
  plate_code: '',
  type: kind === 'routes' ? 'route' : kind.slice(0, -1),
  region: '',
  city: '',
  description: '',
  cover_image_url: '',
  duration: '',
  stop_count: '0',
  place_ids: '',
  tags: '',
  sort_order: '0',
  published: false,
});

export default function AdminAtlasEditorPage({ kind, itemId }: AdminAtlasEditorPageProps) {
  const isEditing = Boolean(itemId);
  const [values, setValues] = useState<AtlasAdminFormValues>(defaultValues(kind));
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const singularLabel = atlasKindSingularLabels[kind];

  useEffect(() => {
    if (!itemId) {
      setValues(defaultValues(kind));
      return;
    }

    async function loadItem() {
      try {
        setIsLoading(true);
        setError(null);
        const item = await getAtlasItem(kind, itemId);
        setValues(mapAtlasRowToFormValues(item));
      } catch (e) {
        setError(e instanceof Error ? e.message : `Could not load ${singularLabel.toLowerCase()}.`);
      } finally {
        setIsLoading(false);
      }
    }

    loadItem();
  }, [itemId, kind, singularLabel]);

  const updateValue = <Key extends keyof AtlasAdminFormValues>(
    key: Key,
    value: AtlasAdminFormValues[Key]
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError(null);
      const savedId = await saveAtlasItem(kind, values);
      window.location.href = `/admin/atlas/${kind}/${savedId}/edit`;
    } catch (e) {
      setError(e instanceof Error ? e.message : `Could not save ${singularLabel.toLowerCase()}.`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title={isEditing ? `Edit ${singularLabel.toLowerCase()}` : `New ${singularLabel.toLowerCase()}`} action={<span />}>
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-sm text-slate-500">
          Loading {singularLabel.toLowerCase()}...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? `Edit ${singularLabel.toLowerCase()}` : `New ${singularLabel.toLowerCase()}`} action={<span />}>
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg shadow-sm">
        {error && (
          <div className="m-6 rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="p-6 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                label={kind === 'routes' ? 'Title' : 'Name'}
                required
                value={values.title}
                onChange={(value) => updateValue('title', value)}
              />
              {kind === 'cities' && (
                <TextField
                  label="Plate code"
                  value={values.plate_code}
                  onChange={(value) => updateValue('plate_code', value)}
                  hint="Example: 35 for İzmir, 34 for İstanbul."
                />
              )}
              <TextField label="Type" value={values.type} onChange={(value) => updateValue('type', value)} />
              <TextField label="Region" value={values.region} onChange={(value) => updateValue('region', value)} />
              <TextField label="City" value={values.city} onChange={(value) => updateValue('city', value)} />
              <TextAreaField
                label="Description"
                required
                rows={4}
                value={values.description}
                onChange={(value) => updateValue('description', value)}
                className="md:col-span-2"
              />
              <div className="md:col-span-2 space-y-2">
                <MediaPicker
                  label="Cover image URL"
                  value={values.cover_image_url}
                  onChange={(value) => updateValue('cover_image_url', value)}
                />
                {kind === 'cities' && (
                  <CityImageSuggestions
                    cityName={values.title || values.city || 'Türkiye'}
                    onSelect={(value) => updateValue('cover_image_url', value)}
                  />
                )}
              </div>
              <TextField
                label="Tags"
                value={values.tags}
                onChange={(value) => updateValue('tags', value)}
                className="md:col-span-2"
                hint="Separate values with commas."
              />
            </div>
          </section>

          {kind === 'routes' && (
            <section className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Route details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField label="Duration" value={values.duration} onChange={(value) => updateValue('duration', value)} />
                <TextField label="Number of stops" type="number" min="0" step="1" value={values.stop_count} onChange={(value) => updateValue('stop_count', value)} />
                <TextField
                  label="Related place ids"
                  value={values.place_ids}
                  onChange={(value) => updateValue('place_ids', value)}
                  className="md:col-span-2"
                  hint="Separate place ids with commas. These connect the route to existing public places."
                />
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Publishing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField label="Sort order" type="number" step="1" value={values.sort_order} onChange={(value) => updateValue('sort_order', value)} />
              <label className="flex items-center gap-2 text-sm text-slate-700 pt-8">
                <input
                  type="checkbox"
                  checked={values.published}
                  onChange={(event) => updateValue('published', event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Published
              </label>
            </div>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <a href={`/admin/atlas/${kind}`} className="text-sm text-slate-500 hover:text-slate-950">
            Cancel
          </a>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-slate-950 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save changes' : `Create ${singularLabel.toLowerCase()}`}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

function TextField({
  label,
  value,
  onChange,
  className = '',
  hint,
  ...inputProps
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <label className={`space-y-1.5 ${className}`}>
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <input
        {...inputProps}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  className = '',
  ...textAreaProps
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'>) {
  return (
    <label className={`space-y-1.5 ${className}`}>
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        {...textAreaProps}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} resize-y`}
      />
    </label>
  );
}
