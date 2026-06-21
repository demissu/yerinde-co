import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import {
  deleteAtlasItem,
  getAtlasRowTitle,
  listAtlasItems,
  setAtlasItemPublished,
} from './atlasAdminService';
import { AtlasAdminRow, AtlasKind, atlasKindLabels, atlasKindSingularLabels } from './atlasAdminTypes';

interface AdminAtlasListPageProps {
  kind: AtlasKind;
}

export default function AdminAtlasListPage({ kind }: AdminAtlasListPageProps) {
  const [items, setItems] = useState<AtlasAdminRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setItems(await listAtlasItems(kind));
    } catch (e) {
      setError(e instanceof Error ? e.message : `Could not load ${kind}.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [kind]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      [getAtlasRowTitle(item), item.region, item.city, item.description, item.tags?.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [items, searchQuery]);

  const handleTogglePublished = async (item: AtlasAdminRow) => {
    try {
      setBusyId(item.id);
      await setAtlasItemPublished(kind, item.id, !item.published);
      await loadItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update publish state.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item: AtlasAdminRow) => {
    if (!window.confirm(`Delete "${getAtlasRowTitle(item)}"? This cannot be undone.`)) {
      return;
    }

    try {
      setBusyId(item.id);
      await deleteAtlasItem(kind, item.id);
      await loadItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete item.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout
      title={`Atlas ${atlasKindLabels[kind]}`}
      action={
        <a
          href={`/admin/atlas/${kind}/new`}
          className="bg-slate-950 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800"
        >
          New {atlasKindSingularLabels[kind].toLowerCase()}
        </a>
      }
    >
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={`Search ${atlasKindLabels[kind].toLowerCase()}...`}
            className="w-full sm:max-w-md border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <span className="text-sm text-slate-500">
            {filteredItems.length} of {items.length} items
          </span>
        </div>

        {error && (
          <div className="m-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-sm text-slate-500">Loading {atlasKindLabels[kind].toLowerCase()}...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Area</th>
                  <th className="px-4 py-3 font-semibold">Tags</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-950">{getAtlasRowTitle(item)}</div>
                      <div className="text-xs text-slate-500">{item.id}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {[item.city, item.region].filter(Boolean).join(', ') || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.tags?.join(', ') || '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          item.published
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/admin/atlas/${kind}/${item.id}/edit`}
                          className="border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => handleTogglePublished(item)}
                          disabled={busyId === item.id}
                          className="border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                          {item.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={busyId === item.id}
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

            {filteredItems.length === 0 && (
              <div className="p-8 text-sm text-slate-500">No Atlas items match your search.</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
