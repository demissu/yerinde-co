import React from 'react';
import AdminLayout from './AdminLayout';
import AdminPlaceForm from './AdminPlaceForm';

interface AdminPlaceEditorPageProps {
  placeId?: string;
}

export default function AdminPlaceEditorPage({ placeId }: AdminPlaceEditorPageProps) {
  return (
    <AdminLayout title={placeId ? 'Edit place' : 'New place'}>
      <AdminPlaceForm placeId={placeId} />
    </AdminLayout>
  );
}
