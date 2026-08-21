import api from "./api";

export interface Photo {
  id: number;
  path: string;
  url?: string; // URL completa da foto (accessor do backend)
  filename: string;
  mime_type: string;
  size: number;
  imageable_type: string;
  imageable_id: number;
  alt_text: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Phone {
  id: number;
  contact_name?: string;
  contact_position?: string;
  contact_email?: string;
  number: string;
  label?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  sector_id: number;
  created_at: string;
  updated_at: string;
}

export interface Sector {
  id: number;
  name: string;
  description: string;
  location_id: number;
  floor: string;
  opening_time: string | null;
  closing_time: string | null;
  created_at: string;
  updated_at: string;
  services: Service[];
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
  created_at: string;
  updated_at: string;
  sectors: Sector[];
  photos: Photo[];
  phones: Phone[];
}

export interface LocationsResponse {
  current_page: number;
  data: Location[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const getLocations = async (
  page: number = 1,
  perPage: number = 100
): Promise<LocationsResponse> => {
  try {
    const response = await api.get<LocationsResponse>("/locations", {
      params: { page, per_page: perPage },
    });
    
    if (!response || !response.data) {
      throw new Error("Resposta vazia da API");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLocation = async (id: number): Promise<Location> => {
  try {
    const response = await api.get<{ data: Location }>(`/locations/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getLocationsByType = async (
  type: string,
  page: number = 1,
  perPage: number = 100
): Promise<LocationsResponse> => {
  try {
    const response = await api.get<LocationsResponse>("/locations", {
      params: { type, page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchLocations = async (
  searchTerm: string,
  page: number = 1,
  perPage: number = 100
): Promise<LocationsResponse> => {
  try {
    const response = await api.get<LocationsResponse>("/locations", {
      params: { search: searchTerm, page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const convertLocationToPlace = (location: Location): any => {
  const firstPhoto =
    location.photos && location.photos.length > 0
      ? (location.photos[0].url || location.photos[0].path)
      : undefined;

  return {
    id: location.id.toString(),
    name: location.name,
    category: location.type,
    description: location.description,
    floor:
      location.sectors && location.sectors.length > 0
        ? location.sectors[0].floor
        : "N/A",
    building: location.name,
    coordinates: {
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
    },
    icon: getIconFromType(location.type),
    color: getColorFromType(location.type),
    details: buildDetailsText(location),
    imageUrl: firstPhoto,
    sectors: location.sectors,
    photos: location.photos,
    phones: location.phones,
  };
};

const getIconFromType = (type: string): string => {
  const iconMap: { [key: string]: string } = {
    academico: "school-outline",
    administrativo: "clipboard-outline",
    agricola: "leaf-outline",
    alimentacao: "fast-food-outline",
    alojamento: "bed-outline",
    animais: "paw-outline",
    biblioteca: "library-outline",
    comercio: "storefront-outline",
    cultural: "color-palette-outline",
    esporte: "basketball-outline",
    hospedagem: "home-outline",
    lazer: "happy-outline",
    paisagem: "image-outline",
    restaurante: "restaurant-outline",
    saude: "medical-outline",
    seguranca: "shield-checkmark-outline",
    servico: "construct-outline",
    teatro: "film-outline",
  };
  return iconMap[type.toLowerCase()] || "location-outline";
};

// Mapear tipo para cor
const getColorFromType = (type: string): string => {
  const colorMap: { [key: string]: string } = {
    academico: "#7B1FA2",
    administrativo: "#1976D2",
    agricola: "#4CAF50",
    alimentacao: "#FF6F00",
    alojamento: "#455A64",
    animais: "#FF9800",
    biblioteca: "#8D6E63",
    comercio: "#F57C00",
    cultural: "#E91E63",
    esporte: "#2E7D32",
    hospedagem: "#5E35B1",
    lazer: "#00897B",
    paisagem: "#009688",
    restaurante: "#D84315",
    saude: "#C62828",
    seguranca: "#1565C0",
    servico: "#616161",
    teatro: "#9C27B0",
  };
  return colorMap[type.toLowerCase()] || "#757575";
};

// Construir texto de detalhes
const buildDetailsText = (location: Location): string => {
  let details = location.description;

  if (location.sectors && location.sectors.length > 0) {
    details += "\n\nSetores:";
    location.sectors.forEach((sector) => {
      details += `\n- ${sector.name} (${sector.floor})`;
      if (sector.services && sector.services.length > 0) {
        details += "\n  Serviços:";
        sector.services.forEach((service) => {
          details += `\n  • ${service.name}`;
        });
      }
    });
  }

  return details;
};
