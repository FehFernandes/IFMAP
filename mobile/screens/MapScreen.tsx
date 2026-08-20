import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { GOOGLE_MAPS_API_KEY } from "../config/env.config";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { 
  getDirections, 
  decodePolyline, 
  openGoogleMapsNavigation 
} from "../services/googleMapsService";
import { Ionicons } from "@expo/vector-icons";
import { useLocations } from "../hooks/useLocations";
import { 
  CustomMarker, 
  ExplorerView, 
  type Place, 
  type RouteCoordinates,
  type Destination 
} from "../components/map";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Componente de mapa otimizado
const MapComponent = memo(({
  region,
  onMarkerPress,
  places,
  routeCoordinates,
  destination,
}: {
  region: any;
  onMarkerPress: (place: Place) => void;
  places: Place[];
  routeCoordinates: RouteCoordinates[];
  destination: Destination | null;
}) => {
  if (Platform.OS === "web") {
    const zoom = Math.round(Math.log2(360 / region.latitudeDelta));
    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${region.latitude},${region.longitude}&zoom=${zoom}&maptype=satellite`;

    return (
      <View style={styles.webMapContainer}>
        <iframe
          src={mapUrl}
          style={{ width: "100%", height: "100%", border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </View>
    );
  }

  try {
    const MapView = require("react-native-maps").default;
    const { Marker, Polyline } = require("react-native-maps");

    return (
      <MapView
        style={styles.map}
        initialRegion={region}
        mapType="satellite"
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        showsBuildings={true}
      >
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#1E88E5"
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}

        {destination && (
          <Marker
            coordinate={destination.coordinates}
            title={destination.name}
            pinColor="#2E7D32"
          />
        )}

        {!destination && places.map((place) => (
          <Marker
            key={place.id}
            coordinate={place.coordinates}
            title={place.name}
            description={place.description}
            onPress={() => onMarkerPress(place)}
            stopPropagation={true}
          >
            <CustomMarker place={place} />
          </Marker>
        ))}
      </MapView>
    );
  } catch (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar o mapa</Text>
      </View>
    );
  }
});

MapComponent.displayName = "MapComponent";

export default function MapScreen() {
  const { locations, loading, error, refreshing, refresh } = useLocations();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showExplorer, setShowExplorer] = useState(false);
  const [placeToShowInExplorer, setPlaceToShowInExplorer] = useState<Place | null>(null);
  const [navigationMode, setNavigationMode] = useState(false);
  const [preparingNavigation, setPreparingNavigation] = useState(false);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinates[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar localização foi negada");
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(loc);
      } catch {}
    })();
  }, []);

  const currentRegion = useMemo(() => {
    if (navigationMode && location && destination) {
      const originLat = location.coords.latitude;
      const originLng = location.coords.longitude;
      const destLat = destination.coordinates.latitude;
      const destLng = destination.coordinates.longitude;

      const midLat = (originLat + destLat) / 2;
      const midLng = (originLng + destLng) / 2;
      const deltaLat = Math.abs(originLat - destLat) * 1.5;
      const deltaLng = Math.abs(originLng - destLng) * 1.5;

      return {
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.max(deltaLat, 0.01),
        longitudeDelta: Math.max(deltaLng, 0.01),
      };
    }

    return {
      latitude: -18.548067722197644,
      longitude: -42.76383089585402,
      latitudeDelta: 0.0015,
      longitudeDelta: 0.0015,
    };
  }, [navigationMode, location, destination]);

  const handleMarkerPress = useCallback((place: Place) => {
    setPlaceToShowInExplorer(place);
    setShowExplorer(true);
  }, []);

  const handleCancelNavigation = useCallback(() => {
    setNavigationMode(false);
    setDestination(null);
    setRouteCoordinates([]);
  }, []);

  const handleNavigate = useCallback((destinationCoords: { latitude: number; longitude: number }, placeName: string) => {
    Alert.alert(
      "Como deseja navegar?",
      `Escolha como chegar até ${placeName}`,
      [
        {
          text: "Google Maps",
          onPress: () => openGoogleMapsNavigation(destinationCoords, placeName),
        },
        {
          text: "Mostrar Rota",
          onPress: async () => {
            setPreparingNavigation(true);
            
            if (location) {
              try {
                const origin = {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                };
                
                const directions = await getDirections(origin, destinationCoords, "walking");
                
                if (directions.routes.length > 0) {
                  const route = directions.routes[0];
                  const leg = route.legs[0];
                  const routeCoords = decodePolyline(route.overview_polyline.points);
                  
                  setRouteCoordinates(routeCoords);
                  setDestination({ 
                    coordinates: destinationCoords, 
                    name: placeName,
                    distance: leg.distance.text,
                    estimatedTime: leg.duration.text
                  });
                  setShowExplorer(false);
                  
                  setTimeout(() => {
                    setNavigationMode(true);
                    setPreparingNavigation(false);
                  }, 300);
                } else {
                  throw new Error("Nenhuma rota encontrada");
                }
              } catch {
                setPreparingNavigation(false);
                Alert.alert("Erro", "Não foi possível calcular a rota.");
              }
            } else {
              setPreparingNavigation(false);
              Alert.alert("Localização não disponível", "Ative o GPS para usar a navegação.");
            }
          }
        }
      ]
    );
  }, [location]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{ marginTop: 16, color: "#666" }}>Carregando mapa...</Text>
      </View>
    );
  }

  if (error && locations.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={48} color="#D84315" />
        <Text style={{ marginTop: 10, color: "#D84315", textAlign: "center", paddingHorizontal: 20 }}>
          {error}
        </Text>
        <TouchableOpacity
          style={{ marginTop: 20, padding: 10, backgroundColor: "#2E7D32", borderRadius: 8 }}
          onPress={refresh}
        >
          <Text style={{ color: "#fff" }}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapComponent
        region={currentRegion}
        onMarkerPress={handleMarkerPress}
        places={locations}
        routeCoordinates={routeCoordinates}
        destination={destination}
      />

      {preparingNavigation && (
        <View style={styles.preparingOverlay}>
          <View style={styles.preparingCard}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.preparingText}>Preparando navegação...</Text>
          </View>
        </View>
      )}

      {navigationMode && destination && !preparingNavigation && (
        <>
          <View style={styles.navigationBar}>
            <View style={styles.navigationInfo}>
              <View style={styles.navigationIcon}>
                <Ionicons name="navigate" size={28} color="#fff" />
              </View>
              <View style={styles.navigationText}>
                <Text style={styles.navigationDestination}>{destination.name}</Text>
                <View style={styles.navigationDetails}>
                  <View style={styles.navigationDetail}>
                    <Ionicons name="walk" size={14} color="#E8F5E9" />
                    <Text style={styles.navigationDetailText}>{destination.distance || "..."}</Text>
                  </View>
                  <Text style={styles.navigationSeparator}>•</Text>
                  <View style={styles.navigationDetail}>
                    <Ionicons name="time-outline" size={14} color="#E8F5E9" />
                    <Text style={styles.navigationDetailText}>{destination.estimatedTime || "..."}</Text>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelNavigation}>
              <Ionicons name="close-circle" size={32} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                const { latitude, longitude } = destination.coordinates;
                const url = Platform.select({
                  ios: `maps:0,0?q=${destination.name}@${latitude},${longitude}`,
                  android: `geo:0,0?q=${latitude},${longitude}(${destination.name})`,
                  default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
                });
                if (url) Linking.openURL(url);
              }}
            >
              <Ionicons name="map" size={24} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {!navigationMode && (
        <TouchableOpacity style={styles.explorerButton} onPress={() => setShowExplorer(true)}>
          <Ionicons name="search" size={20} color="#fff" />
          <Text style={styles.explorerButtonText}>Buscar</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showExplorer}
        animationType="slide"
        presentationStyle="fullScreen"
        onDismiss={() => setPlaceToShowInExplorer(null)}
      >
        <ExplorerView
          onClose={() => {
            setShowExplorer(false);
            setPlaceToShowInExplorer(null);
          }}
          initialPlace={placeToShowInExplorer}
          places={locations}
          refreshing={refreshing}
          onRefresh={refresh}
          onNavigate={handleNavigate}
        />
      </Modal>

      {errorMsg && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  webMapContainer: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
  },
  errorBanner: {
    backgroundColor: "#ffebee",
    padding: 15,
    position: "absolute",
    bottom: Platform.OS === "ios" ? 88 : 65,
    left: 0,
    right: 0,
  },
  errorBannerText: {
    color: "#d32f2f",
    textAlign: "center",
  },
  explorerButton: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 80,
    alignSelf: "center",
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    gap: 8,
  },
  explorerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  preparingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  preparingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  preparingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  navigationBar: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "#2E7D32",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navigationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  navigationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  navigationText: {
    flex: 1,
  },
  navigationDestination: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  navigationDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  navigationDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navigationDetailText: {
    fontSize: 13,
    color: "#E8F5E9",
    fontWeight: "500",
  },
  navigationSeparator: {
    fontSize: 12,
    color: "#E8F5E9",
  },
  cancelButton: {
    padding: 4,
  },
  actionsContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    gap: 12,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
