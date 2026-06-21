export type Category = 'Coffee' | 'Food' | 'Dessert' | 'Bar' | 'Breakfast' | 'Work-friendly' | 'Date' | 'Photogenic';

export interface Place {
  id: string;
  name: string;
  city: string;
  district: string;
  category: Category;
  priceLevel: '₺' | '₺₺' | '₺₺₺' | '₺₺₺₺';
  rating: number;
  reviewCount: number;
  designScore?: number;
  espressoScore?: number;
  quietnessScore?: number;
  aestheticViewScore?: number;
  atmosphereTags: string[];
  editorialDescription: string;
  longDescription: string;
  editorReview?: string;
  bestFor?: string[];
  mood?: string;
  image: string;
  address: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  phone?: string;
  coordinates: {
    lat: number;
    lng: number;
    x: number; // For elegant interactive svg visualization
    y: number; // For elegant interactive svg visualization
  };
  attributes: {
    coffeeRating?: number;
    designFactor?: number;
    quietScore?: number;
    seaView?: boolean;
    affordable?: boolean;
    premium?: boolean;
    workFriendly?: boolean;
    dateSpot?: boolean;
    photogenic?: boolean;
    aestheticViewScore?: number;
  };
  features: string[];
}

export interface UserStats {
  visitedCount: number;
  savedCount: number;
  listsCount: number;
}

export type SavedListName = 
  | 'Want to go'
  | 'Visited'
  | 'Favorites'
  | 'Date spots'
  | 'Coffee list'
  | 'Weekend route';

export interface UserPreferences {
  onboardingCompleted: boolean;
  selectedTastes: string[];
  savedMap: Record<string, SavedListName[]>; // placeId -> list names
}

export const TASTE_OPTIONS = [
  { id: 'specialty_coffee', label: 'Nitelikli Kahve', description: 'Üçüncü nesil kahveciler & özel demlemeler' },
  { id: 'minimal_design', label: 'Minimal Tasarım', description: 'Sade çizgiler, wabi-sabi havası, temiz estetik' },
  { id: 'quiet_places', label: 'Sakin Mekanlar', description: 'Düşünmek, okumak ve dinlenmek için ideal' },
  { id: 'sea_view', label: 'Deniz Manzarası', description: 'Güzel Ege Denizi\'ne doğrudan bakan manzaralar' },
  { id: 'affordable', label: 'Bütçe Dostu', description: 'Cebi yormayan harika atmosferler ve tatlar' },
  { id: 'premium', label: 'Premium Tarifler', description: 'Gurme restoranlar, butik barlar, özel menüler' },
  { id: 'photogenic', label: 'Fotojenik Açılar', description: 'Estetik köşeler ve harika ışık alan mekanlar' },
  { id: 'work_friendly', label: 'Çalışma Dostu', description: 'Güçlü Wi-Fi, elektrik prizleri, rahat koltuklar' },
  { id: 'date_spots', label: 'Buluşma Noktaları', description: 'Loş ışıklar, romantik tınılar, samimi masalar' }
];
