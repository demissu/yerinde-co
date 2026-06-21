import { Category, Place } from '../types';

export const priceLevelOptions = ['₺', '₺₺', '₺₺₺', '₺₺₺₺'] as const;
export type AdminPriceLevel = (typeof priceLevelOptions)[number];

export type AdminPlaceRow = {
  id: string;
  name: string;
  city: string;
  district: string;
  category: Category;
  price_level: AdminPriceLevel;
  rating: number | string;
  review_count: number | null;
  design_score: number | string | null;
  espresso_score: number | string | null;
  quietness_score: number | string | null;
  aesthetic_view_score: number | string | null;
  image_url: string;
  editorial_description: string;
  long_description: string;
  editor_review: string | null;
  best_for: string[] | null;
  atmosphere_tags: string[] | null;
  features: string[] | null;
  mood: string | null;
  attributes?: Partial<Place['attributes']> | null;
  address: string;
  google_maps_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
  phone: string | null;
  lat: number | string;
  lng: number | string;
  map_x: number | string;
  map_y: number | string;
  published: boolean;
  sort_order: number | null;
  place_tags?: { tags: { name: string } | null }[] | null;
};

export type AdminPlaceFormValues = {
  id?: string;
  name: string;
  city: string;
  district: string;
  category: Category;
  price_level: AdminPriceLevel;
  rating: string;
  review_count: string;
  design_score: string;
  espresso_score: string;
  quietness_score: string;
  aesthetic_view_score: string;
  tags: string;
  atmosphere_tags: string;
  features: string;
  mood: string;
  image_url: string;
  address: string;
  google_maps_url: string;
  instagram_url: string;
  website_url: string;
  phone: string;
  editorial_description: string;
  long_description: string;
  editor_review: string;
  best_for: string;
  lat: string;
  lng: string;
  map_x: string;
  map_y: string;
  published: boolean;
};

export const categoryOptions: Category[] = [
  'Coffee',
  'Food',
  'Dessert',
  'Bar',
  'Breakfast',
  'Work-friendly',
  'Date',
  'Photogenic',
];
