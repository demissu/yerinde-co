import { SavedListName } from '../types';

export const DEFAULT_COLLECTIONS: { name: SavedListName; label: string; desc: string; icon: string }[] = [
  { name: 'Want to go', label: 'Gitmek İstiyorum', desc: 'Gelecek hafta sonları için yapılacaklar listesi', icon: '📍' },
  { name: 'Visited', label: 'Gittiğim Yerler', desc: 'Bizzat ziyaret edip onayladığım yerler', icon: '✓' },
  { name: 'Favorites', label: 'Süper Favorilerim', desc: 'Eşsiz lezzet ve tasarım sığınakları', icon: '★' },
  { name: 'Date spots', label: 'Buluşma Noktaları', desc: 'Loş ışıklar, mumlar ve samimi köşeler', icon: '♥' },
  { name: 'Coffee list', label: 'Kahve Defteri', desc: 'Üçüncü dalga estetik nitelikli kahveciler', icon: '☕' },
  { name: 'Weekend route', label: 'Haftasonu Kaçamağı', desc: 'Özenle seçilmiş hafta sonu rotası', icon: '↗' },
];

export const SAVED_LIST_NAMES = DEFAULT_COLLECTIONS.map((collection) => collection.name);
