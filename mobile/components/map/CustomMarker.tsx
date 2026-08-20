import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Place } from "./types";

interface CustomMarkerProps {
  place: Place;
}

const CustomMarker = memo(({ place }: CustomMarkerProps) => {
  return (
    <View style={styles.container}>
      <View style={[styles.marker, { backgroundColor: place.color }]}>
        <Ionicons name={place.icon as any} size={16} color="#fff" />
      </View>
      <View style={styles.pointer} />
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.place.id === nextProps.place.id &&
    prevProps.place.color === nextProps.place.color &&
    prevProps.place.icon === nextProps.place.icon
  );
});

CustomMarker.displayName = "CustomMarker";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
    marginTop: -2,
  },
});

export default CustomMarker;
