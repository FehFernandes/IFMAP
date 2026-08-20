import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Place } from "./types";
import SectorCard from "./SectorCard";
import { useThemedStyles } from "../../hooks/useThemedStyles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PlaceDetailsModalProps {
  place: Place | null;
  visible: boolean;
  onClose: () => void;
  onNavigate: (destination: { latitude: number; longitude: number }, name: string) => void;
}

const PlaceDetailsModal = memo(({
  place,
  visible,
  onClose,
  onNavigate,
}: PlaceDetailsModalProps) => {
  const { colors, getFontSize, isDarkMode } = useThemedStyles();

  const handlePhonePress = useCallback((phoneNumber: string, isWhatsApp?: boolean) => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    if (isWhatsApp) {
      Linking.openURL(`whatsapp://send?phone=55${cleanNumber}`);
    } else {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }, []);

  const handleNavigate = useCallback(() => {
    if (place?.coordinates) {
      onClose();
      setTimeout(() => {
        onNavigate(place.coordinates, place.name);
      }, 100);
    }
  }, [place, onClose, onNavigate]);

  if (!place || !place.name || !place.description) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.modal, { backgroundColor: colors.background }]}>
        {/* Header com imagem ou gradiente */}
        <View style={styles.header}>
          {place.photos && place.photos.length > 0 ? (
            <Image
              source={{ uri: place.photos[0].url || place.photos[0].path }}
              style={styles.headerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.headerGradient, { backgroundColor: place.color }]}>
              <View style={styles.headerIconContainer}>
                <Ionicons name={place.icon as any} size={64} color="rgba(255, 255, 255, 0.9)" />
              </View>
            </View>
          )}
          
          <View style={styles.headerOverlay} />
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.9}>
            <View style={[styles.closeButtonCircle, { backgroundColor: colors.card }]}>
              <Ionicons name="close" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.categoryBadge}>
              <Ionicons name={place.icon as any} size={16} color="#fff" />
              <Text style={[styles.categoryText, { fontSize: getFontSize(12) }]}>{place.category}</Text>
            </View>
            <Text style={[styles.title, { fontSize: getFontSize(26) }]}>{place.name}</Text>
          </View>
        </View>

        <ScrollView style={[styles.content, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false} bounces={true}>
          {/* Botão Como Chegar */}
          {place.coordinates && (
            <TouchableOpacity style={[styles.navigateButton, { backgroundColor: colors.primary }]} onPress={handleNavigate} activeOpacity={0.9}>
              <View style={styles.navigateButtonGlow} />
              <Ionicons name="navigate-circle" size={28} color="#fff" />
              <Text style={[styles.navigateButtonText, { fontSize: getFontSize(18) }]}>Como chegar</Text>
              <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          )}

          <View style={styles.cardsContainer}>
            {/* Card: Descrição */}
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <View style={[styles.infoCardIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="location" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={[styles.infoCardLabel, { color: colors.textSecondary, fontSize: getFontSize(12) }]}>Localização</Text>
                {place.building && place.building !== "N/A" && (
                  <Text style={[styles.infoCardValue, { color: colors.text, fontSize: getFontSize(16) }]}>{place.building}</Text>
                )}
                {place.description && (
                  <Text style={[styles.infoCardDescription, { color: colors.textSecondary, fontSize: getFontSize(14) }]}>{place.description}</Text>
                )}
              </View>
            </View>

            {/* Galeria */}
            {place.photos && place.photos.length > 1 && (
              <View style={styles.photoGallery}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontSize: getFontSize(18) }]}>Galeria</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {place.photos.slice(1).map((photo, index) => (
                    <View key={index} style={styles.photoItem}>
                      <Image
                        source={{ uri: photo.url || photo.path }}
                        style={styles.photoImage}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Setores */}
            {place.sectors && place.sectors.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="layers" size={24} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.text, fontSize: getFontSize(18) }]}>Setores</Text>
                  <View style={[styles.sectionBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.sectionBadgeText, { color: colors.primary, fontSize: getFontSize(12) }]}>{place.sectors.length}</Text>
                  </View>
                </View>
                {place.sectors.map((sector, index) => (
                  <SectorCard key={index} sector={sector} />
                ))}
              </View>
            )}

            {/* Telefones */}
            {place.phones && place.phones.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="call" size={24} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.text, fontSize: getFontSize(18) }]}>Contatos</Text>
                  <View style={[styles.sectionBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.sectionBadgeText, { color: colors.primary, fontSize: getFontSize(12) }]}>{place.phones.length}</Text>
                  </View>
                </View>
                {place.phones.map((phone, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.phoneCard, { backgroundColor: colors.card }]}
                    onPress={() => handlePhonePress(phone.number, phone.is_whatsapp)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.phoneIcon, { backgroundColor: phone.is_whatsapp ? "#DCF8C6" : colors.primaryLight }]}>
                      <Ionicons
                        name={phone.is_whatsapp ? "logo-whatsapp" : "call"}
                        size={26}
                        color={phone.is_whatsapp ? "#25D366" : colors.primary}
                      />
                    </View>
                    <View style={styles.phoneContent}>
                      <Text style={[styles.phoneNumber, { color: colors.text, fontSize: getFontSize(16) }]}>{phone.number || "Sem número"}</Text>
                      <Text style={[styles.phoneLabel, { color: colors.textSecondary, fontSize: getFontSize(13) }]}>
                        {phone.label || "Contato"}
                        {phone.is_primary && " • Principal"}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    </Modal>
  );
});

PlaceDetailsModal.displayName = "PlaceDetailsModal";

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 280,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerIconContainer: {
    opacity: 0.9,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 8,
    gap: 6,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  navigateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 12,
    overflow: "hidden",
  },
  navigateButtonGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  navigateButtonText: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  cardsContainer: {
    padding: 16,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  infoCardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  photoGallery: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
    marginLeft: 8,
  },
  photoItem: {
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  photoImage: {
    width: 140,
    height: 100,
    borderRadius: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: "auto",
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
  },
  phoneCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  phoneIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  phoneContent: {
    flex: 1,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  phoneLabel: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
});

export default PlaceDetailsModal;
