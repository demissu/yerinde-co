export const getBrowserPathname = () => {
  const url = new URL(window.location.href);
  const hashPath = url.hash.startsWith('#/') ? url.hash.slice(1) : '';
  return hashPath || url.pathname;
};

export const isAdminPath = (pathname: string) =>
  pathname === '/admin' || pathname === '/admin/' || pathname.startsWith('/admin/');

export const getEditPlaceId = (pathname: string) => {
  const match = pathname.match(/^\/admin\/places\/(.+)\/edit$/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};
