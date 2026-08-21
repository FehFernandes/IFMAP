import React, { memo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Sector } from "./types";
import { useThemedStyles } from "../../hooks/useThemedStyles";

interface SectorCardProps {
  sector: Sector;
}

const SectorCard = memo(({ sector }: SectorCardProps) => {
  const { colors, getFontSize } = useThemedStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasServices = sector.services && sector.services.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.mainInfo}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="business" size={20} color={colors.primary} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.text, fontSize: getFontSize(16) }]}>{sector.name}</Text>
            {sector.floor && sector.floor !== "N/A" && sector.floor.trim() !== "" && (
              <View style={styles.floorBadge}>
                <Ionicons name="layers-outline" size={12} color={colors.textSecondary} />
                <Text style={[styles.floor, { color: colors.textSecondary, fontSize: getFontSize(12) }]}>{sector.floor}</Text>
              </View>
            )}
          </View>
        </View>

        {sector.opening_time && sector.closing_time && (
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.timeText, { color: colors.textSecondary, fontSize: getFontSize(12) }]}>
              {sector.opening_time} - {sector.closing_time}
            </Text>
          </View>
        )}
      </View>

      {sector.description && (
        <Text style={[styles.description, { color: colors.textSecondary, fontSize: getFontSize(14) }]}>{sector.description}</Text>
      )}

      {hasServices && (
        <>
          <TouchableOpacity
            style={[styles.expandButton, { backgroundColor: colors.primaryLight }]}
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.7}
          >
            <View style={styles.expandButtonContent}>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.primary}
              />
              <Text style={[styles.expandButtonText, { color: colors.primary, fontSize: getFontSize(14) }]}>
                {isExpanded ? "Ocultar" : "Ver"} {sector.services?.length} serviço
                {(sector.services?.length || 0) > 1 ? "s" : ""}
              </Text>
            </View>
          </TouchableOpacity>

          {isExpanded && (
            <View style={[styles.servicesList, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {sector.services?.map((service) => (
                <View key={service.id} style={[styles.serviceItem, { borderBottomColor: colors.border }]}>
                  <View style={[styles.serviceBullet, { backgroundColor: colors.primary }]} />
                  <View style={styles.serviceContent}>
                    <Text style={[styles.serviceName, { color: colors.text, fontSize: getFontSize(14) }]}>{service.name}</Text>
                    {service.description && (
                      <Text style={[styles.serviceDescription, { color: colors.textSecondary, fontSize: getFontSize(12) }]}>
                        {service.description}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
});

SectorCard.displayName = "SectorCard";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  mainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  floorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  floor: {
    fontSize: 12,
    color: "#666",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    lineHeight: 20,
  },
  expandButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    alignItems: "center",
  },
  expandButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
  },
  servicesList: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  serviceBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2E7D32",
    marginTop: 6,
    marginRight: 10,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  serviceDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});

export default SectorCard;
