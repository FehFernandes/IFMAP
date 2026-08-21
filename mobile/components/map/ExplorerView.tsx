import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { Place, SearchResult } from "./types";
import PlaceDetailsModal from "./PlaceDetailsModal";
import { useThemedStyles } from "../../hooks/useThemedStyles";

const CATEGORIES = [
  { id: "all", name: "Todas", icon: "grid-outline" },
  { id: "academico", name: "Acadêmico", icon: "school-outline" },
  { id: "administrativo", name: "Administrativo", icon: "business-outline" },
  { id: "agricola", name: "Agrícola", icon: "leaf-outline" },
  { id: "alimentacao", name: "Alimentação", icon: "restaurant-outline" },
  { id: "alojamento", name: "Alojamento", icon: "bed-outline" },
  { id: "animais", name: "Animais", icon: "paw-outline" },
  { id: "biblioteca", name: "Biblioteca", icon: "library-outline" },
  { id: "comercio", name: "Comércio", icon: "storefront-outline" },
  { id: "esporte", name: "Esporte", icon: "basketball-outline" },
  { id: "hospedagem", name: "Hospedagem", icon: "home-outline" },
  { id: "lazer", name: "Lazer", icon: "happy-outline" },
  { id: "saude", name: "Saúde", icon: "medical-outline" },
  { id: "seguranca", name: "Segurança", icon: "shield-outline" },
  { id: "servico", name: "Serviço", icon: "construct-outline" },
  { id: "teatro", name: "Teatro", icon: "film-outline" },
];

interface ExplorerViewProps {
  onClose: () => void;
  initialPlace?: Place | null;
  places: Place[];
  refreshing: boolean;
  onRefresh: () => void;
  onNavigate: (destination: { latitude: number; longitude: number }, name: string) => void;
}

interface ResultItemProps {
  result: SearchResult;
  onPress: () => void;
  colors: any;
  getFontSize: (size: number) => number;
}

const ResultItem = memo(({ 
  result, 
  onPress,
  colors,
  getFontSize,
}: ResultItemProps) => (
  <TouchableOpacity 
    style={[styles.placeCard, { backgroundColor: colors.card, borderColor: colors.border }]} 
    activeOpacity={0.85} 
    onPress={onPress}
  >
    {result.type === "location" && result.location?.photos && result.location.photos.length > 0 ? (
      <Image
        source={{ uri: result.location.photos[0].url }}
        style={styles.placeImage}
        resizeMode="cover"
      />
    ) : (
      <View style={[styles.placeIconContainer, { backgroundColor: result.color }]}>
        <Ionicons name={result.icon as any} size={28} color="#fff" />
      </View>
    )}

    <View style={styles.placeInfo}>
      <View style={styles.placeHeader}>
        <View style={[
          styles.resultTypeBadge,
          result.type === "location" && { backgroundColor: colors.primaryLight },
          result.type === "sector" && styles.resultTypeSector,
          result.type === "service" && styles.resultTypeService,
        ]}>
          <Text style={[styles.resultTypeBadgeText, { color: colors.textSecondary, fontSize: getFontSize(10) }]}>
            {result.type === "location" ? "Local" : result.type === "sector" ? "Setor" : "Serviço"}
          </Text>
        </View>
        <Text style={[styles.placeName, { color: colors.text, fontSize: getFontSize(16) }]} numberOfLines={1}>
          {result.name}
        </Text>
      </View>
      <Text style={[styles.placeDescription, { color: colors.textSecondary, fontSize: getFontSize(13) }]} numberOfLines={2}>
        {result.description}
      </Text>
      {result.parent && (
        <View style={styles.placeLocation}>
          <Ionicons name="location" size={14} color={colors.primary} />
          <Text style={[styles.placeLocationText, { color: colors.primary, fontSize: getFontSize(12) }]}>
            {result.parent}
          </Text>
        </View>
      )}
    </View>

    <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
  </TouchableOpacity>
));

ResultItem.displayName = "ResultItem";

const ExplorerView = memo(({
  onClose,
  initialPlace,
  places,
  refreshing,
  onRefresh,
  onNavigate,
}: ExplorerViewProps) => {
  const { colors, getFontSize, isDarkMode } = useThemedStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showPlaceModal, setShowPlaceModal] = useState(false);

  useEffect(() => {
    if (initialPlace) {
      setSelectedPlace(initialPlace);
      setShowPlaceModal(true);
    }
  }, [initialPlace]);

  const allResults = useMemo(() => {
    const results: SearchResult[] = [];

    places.forEach((place) => {
      results.push({
        id: `location-${place.id}`,
        type: "location",
        name: place.name,
        description: place.description,
        icon: place.icon,
        color: place.color,
        location: place,
        coordinates: place.coordinates,
      });

      if (place.sectors) {
        place.sectors.forEach((sector) => {
          results.push({
            id: `sector-${sector.id}`,
            type: "sector",
            name: sector.name,
            description: sector.description || "Setor",
            icon: "layers",
            color: "#2E7D32",
            parent: place.name,
            location: place,
            coordinates: place.coordinates,
          });

          if (sector.services) {
            sector.services.forEach((service) => {
              results.push({
                id: `service-${service.id}`,
                type: "service",
                name: service.name,
                description: service.description || "Serviço disponível",
                icon: "checkmark-circle",
                color: "#4CAF50",
                parent: `${place.name} • ${sector.name}`,
                location: place,
                coordinates: place.coordinates,
              });
            });
          }
        });
      }
    });

    return results;
  }, [places]);

  const filteredResults = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    return allResults
      .filter((result) => {
        const matchesSearch = !query ||
          result.name.toLowerCase().includes(query) ||
          result.description.toLowerCase().includes(query) ||
          result.parent?.toLowerCase().includes(query);

        const matchesCategory = selectedCategory === "all" ||
          (result.type === "location" && result.location?.category === selectedCategory);

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const order = { location: 1, sector: 2, service: 3 };
        return order[a.type] - order[b.type];
      });
  }, [allResults, searchQuery, selectedCategory]);

  const handleResultPress = useCallback((result: SearchResult) => {
    if (result.location) {
      setSelectedPlace(result.location);
      setShowPlaceModal(true);
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: SearchResult }) => (
    <ResultItem 
      result={item} 
      onPress={() => handleResultPress(item)} 
      colors={colors}
      getFontSize={getFontSize}
    />
  ), [handleResultPress, colors, getFontSize]);

  const keyExtractor = useCallback((item: SearchResult) => item.id, []);

  const ListEmptyComponent = useMemo(() => (
    <View style={styles.empty}>
      <Ionicons name="search-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: getFontSize(18) }]}>
        Nenhum resultado encontrado
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textSecondary, fontSize: getFontSize(14) }]}>
        Tente buscar por locais, setores ou serviços
      </Text>
    </View>
  ), [colors, getFontSize]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <View style={[styles.closeButtonCircle, { backgroundColor: colors.card }]}>
              <Ionicons name="close" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
          <View style={[styles.headerBadge, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="search" size={18} color={colors.primary} />
            <Text style={[styles.headerBadgeText, { color: colors.primary, fontSize: getFontSize(13) }]}>
              {filteredResults.length} resultados
            </Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text, fontSize: getFontSize(16) }]}
          placeholder="Buscar locais, setores, serviços..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              { backgroundColor: colors.primaryLight },
              selectedCategory === category.id && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={18}
              color={selectedCategory === category.id ? "#fff" : colors.primary}
            />
            <Text style={[
              styles.categoryText,
              { color: colors.primary, fontSize: getFontSize(13) },
              selectedCategory === category.id && styles.categoryTextActive,
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results - Using FlatList for virtualization */}
      <FlatList
        data={filteredResults}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={[styles.list, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
      />

      <PlaceDetailsModal
        place={selectedPlace}
        visible={showPlaceModal}
        onClose={() => setShowPlaceModal(false)}
        onNavigate={onNavigate}
      />
    </SafeAreaView>
  );
});

ExplorerView.displayName = "ExplorerView";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  headerBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
  },
  categoriesContainer: {
    maxHeight: 50,
    marginTop: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: "#2E7D32",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2E7D32",
  },
  categoryTextActive: {
    color: "#fff",
  },
  list: {
    flex: 1,
    marginTop: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  placeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  placeImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  placeIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  placeInfo: {
    flex: 1,
    marginLeft: 14,
  },
  placeHeader: {
    marginBottom: 4,
  },
  resultTypeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  resultTypeLocation: {
    backgroundColor: "#E8F5E9",
  },
  resultTypeSector: {
    backgroundColor: "#E3F2FD",
  },
  resultTypeService: {
    backgroundColor: "#FFF3E0",
  },
  resultTypeBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#666",
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  placeDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  placeLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  placeLocationText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 8,
  },
});

export default ExplorerView;
