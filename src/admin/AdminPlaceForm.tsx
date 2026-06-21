import React, { FormEvent, useEffect, useState } from 'react';
import { getAdminPlace, mapRowToFormValues, saveAdminPlace } from './adminPlaceService';
import { AdminPlaceFormValues, categoryOptions, priceLevelOptions } from './adminTypes';
import MediaPicker from './MediaPicker';

interface AdminPlaceFormProps {
  placeId?: string;
}

const defaultValues: AdminPlaceFormValues = {
  name: '',
  city: 'İstanbul',
  district: '',
  category: 'Coffee',
  price_level: '₺₺',
  rating: '4.5',
  review_count: '0',
  design_score: '4.5',
  espresso_score: '4.0',
  quietness_score: '3.5',
  aesthetic_view_score: '4.0',
  tags: '',
  atmosphere_tags: '',
  features: '',
  mood: '',
  image_url: '',
  address: '',
  google_maps_url: '',
  instagram_url: '',
  website_url: '',
  phone: '',
  editorial_description: '',
  long_description: '',
  editor_review: '',
  best_for: '',
  lat: '39.0',
  lng: '35.0',
  map_x: '50',
  map_y: '50',
  published: false,
};

const inputClass =
  'w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400';

export default function AdminPlaceForm({ placeId }: AdminPlaceFormProps) {
  const isEditing = Boolean(placeId);
  const [values, setValues] = useState<AdminPlaceFormValues>(defaultValues);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) return;

    async function loadPlace() {
      try {
        setIsLoading(true);
        setError(null);
        const place = await getAdminPlace(placeId);
        setValues(mapRowToFormValues(place));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load place.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPlace();
  }, [placeId]);

  const updateValue = <Key extends keyof AdminPlaceFormValues>(
    key: Key,
    value: AdminPlaceFormValues[Key]
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError(null);
      const savedId = await saveAdminPlace(values);
      window.location.href = `/admin/places/${savedId}/edit`;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save place.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-sm text-slate-500">
        Loading place...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg shadow-sm">
      {error && (
        <div className="m-6 rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="p-6 space-y-8">
        <AdminSection title="Basic details">
          <TextField label="Name" required value={values.name} onChange={(value) => updateValue('name', value)} />

          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-slate-700">Category</span>
            <select
              value={values.category}
              onChange={(event) => updateValue('category', event.target.value as AdminPlaceFormValues['category'])}
              className={inputClass}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <TextField label="City" required value={values.city} onChange={(value) => updateValue('city', value)} />
          <TextField label="District" required value={values.district} onChange={(value) => updateValue('district', value)} />

          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-slate-700">Price level</span>
            <select
              value={values.price_level}
              onChange={(event) => updateValue('price_level', event.target.value as AdminPlaceFormValues['price_level'])}
              className={inputClass}
            >
              {priceLevelOptions.map((priceLevel) => (
                <option key={priceLevel} value={priceLevel}>
                  {priceLevel}
                </option>
              ))}
            </select>
          </label>

          <MediaPicker
            label="Image URL"
            required
            value={values.image_url}
            onChange={(value) => updateValue('image_url', value)}
            className="md:col-span-2"
          />
        </AdminSection>

        <AdminSection title="Rating / score fields">
          <TextField label="Rating" required type="number" min="0" max="5" step="0.1" value={values.rating} onChange={(value) => updateValue('rating', value)} />
          <TextField label="Review count" type="number" min="0" step="1" value={values.review_count} onChange={(value) => updateValue('review_count', value)} />
          <TextField label="Design score" type="number" min="0" max="5" step="0.1" value={values.design_score} onChange={(value) => updateValue('design_score', value)} />
          <TextField label="Espresso score" type="number" min="0" max="5" step="0.1" value={values.espresso_score} onChange={(value) => updateValue('espresso_score', value)} />
          <TextField label="Quietness score" type="number" min="0" max="5" step="0.1" value={values.quietness_score} onChange={(value) => updateValue('quietness_score', value)} />
          <TextField label="Aesthetic view score" type="number" min="0" max="5" step="0.1" value={values.aesthetic_view_score} onChange={(value) => updateValue('aesthetic_view_score', value)} />
        </AdminSection>

        <AdminSection title="Address and map">
          <TextAreaField label="Address" required rows={3} value={values.address} onChange={(value) => updateValue('address', value)} className="md:col-span-2" />
          <TextField label="Google Maps URL" type="url" value={values.google_maps_url} onChange={(value) => updateValue('google_maps_url', value)} className="md:col-span-2" />
          <TextField label="Latitude" required type="number" min="-90" max="90" step="0.000001" value={values.lat} onChange={(value) => updateValue('lat', value)} />
          <TextField label="Longitude" required type="number" min="-180" max="180" step="0.000001" value={values.lng} onChange={(value) => updateValue('lng', value)} />
          <TextField label="Map X legacy" required type="number" min="0" max="100" step="0.1" value={values.map_x} onChange={(value) => updateValue('map_x', value)} />
          <TextField label="Map Y legacy" required type="number" min="0" max="100" step="0.1" value={values.map_y} onChange={(value) => updateValue('map_y', value)} />
        </AdminSection>

        <AdminSection title="Contact">
          <TextField label="Instagram URL" type="url" value={values.instagram_url} onChange={(value) => updateValue('instagram_url', value)} />
          <TextField label="Website URL" type="url" value={values.website_url} onChange={(value) => updateValue('website_url', value)} />
          <TextField label="Phone" type="tel" value={values.phone} onChange={(value) => updateValue('phone', value)} />
        </AdminSection>

        <AdminSection title="Editorial">
          <TextAreaField label="Editorial description" required rows={4} value={values.editorial_description} onChange={(value) => updateValue('editorial_description', value)} className="md:col-span-2" />
          <TextAreaField label="Long description" rows={5} value={values.long_description} onChange={(value) => updateValue('long_description', value)} className="md:col-span-2" />
          <TextAreaField label="Editor review" rows={5} value={values.editor_review} onChange={(value) => updateValue('editor_review', value)} className="md:col-span-2" />
          <TextField label="Best for" value={values.best_for} onChange={(value) => updateValue('best_for', value)} className="md:col-span-2" hint="Separate values with commas, e.g. Date night, Laptop work, Long lunch." />
          <TextField label="Tags" value={values.tags} onChange={(value) => updateValue('tags', value)} className="md:col-span-2" hint="Legacy tag join. Separate values with commas." />
        </AdminSection>

        <AdminSection title="Atmosphere">
          <TextField label="Atmosphere tags" value={values.atmosphere_tags} onChange={(value) => updateValue('atmosphere_tags', value)} className="md:col-span-2" hint="Separate values with commas. These appear as public detail chips." />
          <TextField label="Features" value={values.features} onChange={(value) => updateValue('features', value)} className="md:col-span-2" hint="Separate values with commas. These appear in the public features list." />
          <TextField label="Mood" value={values.mood} onChange={(value) => updateValue('mood', value)} className="md:col-span-2" />
        </AdminSection>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(event) => updateValue('published', event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Published
        </label>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <a href="/admin/places" className="text-sm text-slate-500 hover:text-slate-950">
          Cancel
        </a>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-slate-950 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Create place'}
        </button>
      </div>
    </form>
  );
}

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </section>
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
  className = '',
  ...textareaProps
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'>) {
  return (
    <label className={`space-y-1.5 ${className}`}>
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        {...textareaProps}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}
