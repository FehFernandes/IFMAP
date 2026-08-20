export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: User;
  token?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface Location {
  id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  type: string;
  opening_time: string;
  closing_time: string;
  created_at?: string;
  updated_at?: string;
}

export interface LocationFormData {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  type: string;
  opening_time: string;
  closing_time: string;
}

export interface Sector {
  id: number;
  name: string;
  description: string;
  location_id: number;
  floor: string;
  opening_time: string;
  closing_time: string;
  created_at?: string;
  updated_at?: string;
  location?: Location;
}

export interface SectorFormData {
  name: string;
  description: string;
  location_id: number;
  floor: string;
  opening_time: string;
  closing_time: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  sector_id: number;
  created_at?: string;
  updated_at?: string;
  sector?: Sector;
}

export interface ServiceFormData {
  name: string;
  description: string;
  sector_id: number;
}

export interface Phone {
  id: number;
  contact_name?: string;
  contact_position?: string;
  contact_email?: string;
  number: string;
  label?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PhoneFormData {
  contact_name?: string;
  contact_position?: string;
  contact_email?: string;
  number: string;
  label?: string;
  order?: number;
}

export interface Photo {
  id: number;
  path: string;
  url?: string; // URL completa da foto (accessor do backend)
  filename: string;
  mime_type: string;
  size: number;
  imageable_type: string;
  imageable_id: number;
  alt_text?: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface PhotoFormData {
  path: string;
  filename: string;
  mime_type: string;
  size: number;
  imageable_type: string;
  imageable_id: number;
  alt_text?: string;
  order: number;
}

export interface News {
  id: number;
  title: string;
  url: string;
  description?: string;
  published_at: string;
  category: 'noticia' | 'destaque' | 'manchete';
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface NewsFormData {
  title: string;
  url: string;
  description?: string;
  published_at: string;
  category: 'noticia' | 'destaque' | 'manchete';
  order: number;
}

export interface ScrapeResponse {
  message: string;
  data: {
    created: number;
    updated: number;
    errors: number;
    total: number;
    error_details: Array<{ url: string; error: string }>;
  };
}
