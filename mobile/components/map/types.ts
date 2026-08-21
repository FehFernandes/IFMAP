export interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  floor: string;
  building: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  icon: string;
  color: string;
  details?: string;
  imageUrl?: string;
  sectors?: Sector[];
  photos?: Photo[];
  phones?: Phone[];
}

export interface Sector {
  id: number;
  name: string;
  description?: string;
  floor?: string;
  opening_time?: string;
  closing_time?: string;
  services?: Service[];
}

export interface Service {
  id: number;
  name: string;
  description?: string;
}

export interface Photo {
  id: number;
  url?: string;
  path?: string;
}

export interface Phone {
  id: number;
  number: string;
  label?: string;
  is_whatsapp?: boolean;
  is_primary?: boolean;
  contact_name?: string;
  contact_position?: string;
}

export interface RouteCoordinates {
  latitude: number;
  longitude: number;
}

export interface Destination {
  coordinates: { latitude: number; longitude: number };
  name: string;
  distance?: string;
  estimatedTime?: string;
}

export type SearchResultType = "location" | "sector" | "service";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  name: string;
  description: string;
  icon: string;
  color: string;
  parent?: string;
  location?: Place;
  coordinates?: { latitude: number; longitude: number };
}
