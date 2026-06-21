import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { deleteAdminPlace, listAdminPlaces, setAdminPlacePublished } from './adminPlaceService';
import { AdminPlaceRow } from './adminTypes';

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState<AdminPlaceRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadPlaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPlaces(await listAdminPlaces());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load places.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const filteredPlaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return places;

    return places.filter((place) =>
      [place.name, place.city, place.district, place.category]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [places, searchQuery]);

  const handleTogglePublished = async (place: AdminPlaceRow) => {
    try {
      setBusyId(place.id);
      await setAdminPlacePublished(place.id, !place.published);
      await loadPlaces();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update publish state.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (place: AdminPlaceRow) => {
    if (!window.confirm(`Delete "${place.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      setBusyId(place.id);
      await deleteAdminPlace(place.id);
      await loadPlaces();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete place.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout title="Places">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, city, district, category..."
            className="w-full sm:max-w-md border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <span className="text-sm text-slate-500">
            {filteredPlaces.length} of {places.length} places
          </span>
        </div>

        {error && (
          <div className="m-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-sm text-slate-500">Loading places...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Place</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlaces.map((place) => (
                  <tr key={place.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-950">{place.name}</div>
                      <div className="text-xs text-slate-500">{place.id}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {place.district}, {place.city}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{place.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          place.published
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {place.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/admin/places/${place.id}/edit`}
                          className="border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => handleTogglePublished(place)}
                          disabled={busyId === place.id}
                          className="border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                          {place.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(place)}
                          disabled={busyId === place.id}
                          className="border border-red-200 rounded-md px-3 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPlaces.length === 0 && (
              <div className="p-8 text-sm text-slate-500">No places match your search.</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
