import { Platform, Linking } from "react-native";

import { GOOGLE_MAPS_API_KEY } from "../config/env.config";

export interface RouteStep {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  start_location: {
    lat: number;
    lng: number;
  };
  end_location: {
    lat: number;
    lng: number;
  };
  html_instructions: string;
  polyline: {
    points: string;
  };
}

export interface DirectionsRoute {
  legs: Array<{
    distance: {
      text: string;
      value: number;
    };
    duration: {
      text: string;
      value: number;
    };
    start_address: string;
    end_address: string;
    start_location: {
      lat: number;
      lng: number;
    };
    end_location: {
      lat: number;
      lng: number;
    };
    steps: RouteStep[];
  }>;
  overview_polyline: {
    points: string;
  };
  summary: string;
}

export interface DirectionsResponse {
  routes: DirectionsRoute[];
  status: string;
}

// Função para obter rota do Google Maps Directions API
export const getDirections = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
  mode: "walking" | "driving" = "walking"
): Promise<DirectionsResponse> => {
  const originStr = `${origin.latitude},${origin.longitude}`;
  const destStr = `${destination.latitude},${destination.longitude}`;

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&mode=${mode}&key=${GOOGLE_MAPS_API_KEY}&language=pt-BR`;

  try {
    const response = await fetch(url);
    const data: DirectionsResponse = await response.json();

    if (data.status === "OK") {
      return data;
    } else {
      throw new Error(`Erro ao buscar rota: ${data.status}`);
    }
  } catch (error) {
    throw error;
  }
};

// Decodificar polyline do Google Maps
export const decodePolyline = (encoded: string): Array<{ latitude: number; longitude: number }> => {
  const poly = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return poly;
};

// Abrir navegação no Google Maps (app nativo ou browser)
export const openGoogleMapsNavigation = async (
  destination: { latitude: number; longitude: number },
  destinationName?: string
) => {
  const { latitude, longitude } = destination;
  const label = destinationName ? encodeURIComponent(destinationName) : "";

  let url: string;

  if (Platform.OS === "ios") {
    // iOS - abre o Apple Maps ou Google Maps se instalado
    url = `maps:0,0?q=${latitude},${longitude}${label ? `(${label})` : ""}`;
    
    // Alternativa: forçar Google Maps no iOS
    const googleMapsUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=walking`;
    
    try {
      const supported = await Linking.canOpenURL(googleMapsUrl);
      if (supported) {
        url = googleMapsUrl;
      }
    } catch (error) {
    }
  } else {
    // Android - abre o Google Maps
    url = `google.navigation:q=${latitude},${longitude}&mode=w`; // mode=w para walking
  }

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      // Fallback para browser
      const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=walking`;
      await Linking.openURL(browserUrl);
    }
  } catch (error) {
    // Fallback final
    const browserUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    await Linking.openURL(browserUrl);
  }
};
