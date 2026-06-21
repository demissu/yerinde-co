import React from 'react';
import AdminLayout from './AdminLayout';
import { atlasKinds, atlasKindLabels } from './atlasAdminTypes';

export default function AdminAtlasDashboardPage() {
  return (
    <AdminLayout title="Atlas" action={<span />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {atlasKinds.map((kind) => (
          <a
            key={kind}
            href={`/admin/atlas/${kind}`}
            className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:border-slate-400"
          >
            <h2 className="text-lg font-semibold text-slate-950">{atlasKindLabels[kind]}</h2>
            <p className="text-sm text-slate-500 mt-2">
              Create, edit, publish, and sort Atlas {atlasKindLabels[kind].toLowerCase()}.
            </p>
          </a>
        ))}
      </div>
    </AdminLayout>
  );
}
