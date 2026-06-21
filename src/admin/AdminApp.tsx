import React from 'react';
import AdminAtlasDashboardPage from './AdminAtlasDashboardPage';
import AdminAtlasEditorPage from './AdminAtlasEditorPage';
import AdminAtlasListPage from './AdminAtlasListPage';
import AdminPlaceEditorPage from './AdminPlaceEditorPage';
import AdminPlacesPage from './AdminPlacesPage';
import AdminMediaPage from './AdminMediaPage';
import { getBrowserPathname, getEditPlaceId } from './adminRoutes';
import { AtlasKind, atlasKinds } from './atlasAdminTypes';

const isAtlasKind = (value: string | undefined): value is AtlasKind =>
  Boolean(value && atlasKinds.includes(value as AtlasKind));

export default function AdminApp() {
  const pathname = getBrowserPathname();

  if (pathname === '/admin' || pathname === '/admin/') {
    window.history.replaceState(null, '', '/admin/places');
    return <AdminPlacesPage />;
  }

  if (pathname === '/admin/media') {
    return <AdminMediaPage />;
  }

  if (pathname === '/admin/atlas') {
    return <AdminAtlasDashboardPage />;
  }

  const atlasMatch = pathname.match(/^\/admin\/atlas\/([^/]+)(?:\/([^/]+))?(?:\/(edit))?$/);
  if (atlasMatch) {
    const [, rawKind, rawId, editSegment] = atlasMatch;
    if (isAtlasKind(rawKind)) {
      if (!rawId) {
        return <AdminAtlasListPage kind={rawKind} />;
      }

      if (rawId === 'new') {
        return <AdminAtlasEditorPage kind={rawKind} />;
      }

      if (editSegment === 'edit') {
        return <AdminAtlasEditorPage kind={rawKind} itemId={rawId} />;
      }
    }
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
