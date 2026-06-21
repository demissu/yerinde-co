import React from 'react';
import AdminPlaceEditorPage from './AdminPlaceEditorPage';
import AdminPlacesPage from './AdminPlacesPage';
import { getBrowserPathname, getEditPlaceId } from './adminRoutes';

export default function AdminApp() {
  const pathname = getBrowserPathname();

  if (pathname === '/admin' || pathname === '/admin/') {
    window.history.replaceState(null, '', '/admin/places');
    return <AdminPlacesPage />;
  }

  if (pathname === '/admin/places/new') {
    return <AdminPlaceEditorPage />;
  }

  const editPlaceId = getEditPlaceId(pathname);
  if (editPlaceId) {
    return <AdminPlaceEditorPage placeId={editPlaceId} />;
  }

  return <AdminPlacesPage />;
}
