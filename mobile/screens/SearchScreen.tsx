import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { PLACES_DATA, CATEGORIES, getCategoryIcon } from "../data/placesData";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { colors } = useTheme();

  const filteredPlaces = PLACES_DATA.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.building.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || place.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { backgroundColor: colors.headerBackground }]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Explorar
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Encontre lugares no campus
        </Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar laboratórios, salas, prédios..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

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
              selectedCategory === category.id && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={18}
              color={selectedCategory === category.id ? "#fff" : colors.primary}
            />
            <Text
              style={[
                styles.categoryText,
                { color: colors.primary },
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.placesList}
        contentContainerStyle={styles.placesListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredPlaces.map((place) => (
          <TouchableOpacity
            key={place.id}
            style={[styles.placeCard, { backgroundColor: colors.card }]}
          >
            <View
              style={[
                styles.placeIconContainer,
                { backgroundColor: colors.iconBackground },
              ]}
            >
              <Ionicons
                name={getCategoryIcon(place.category) as any}
                size={28}
                color={colors.primary}
              />
            </View>

            <View style={styles.placeInfo}>
              <Text style={[styles.placeName, { color: colors.text }]}>
                {place.name}
              </Text>
              <Text
                style={[
                  styles.placeDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {place.description}
              </Text>
              <View style={styles.placeLocation}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.placeLocationText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {place.building} • {place.floor}
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </TouchableOpacity>
        ))}

        {filteredPlaces.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum lugar encontrado
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
  },
  categoriesContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: "#2E7D32",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
  },
  categoryTextActive: {
    color: "#fff",
  },
  placesList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  placesListContent: {
    paddingBottom: 80, // Espaço para a tab bar
  },
  placeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  placeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  placeLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  placeLocationText: {
    fontSize: 13,
    color: "#999",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
  },
});
