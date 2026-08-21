import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { useTheme } from "../context/ThemeContext";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
  isDark?: boolean;
}

const SettingItem = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightComponent,
  isDark = false,
}: SettingItemProps) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={!onPress}
  >
    <View
      style={[
        styles.settingIconContainer,
        isDark && styles.settingIconContainerDark,
      ]}
    >
      <Ionicons name={icon} size={22} color={isDark ? "#81C784" : "#2E7D32"} />
    </View>
    <View style={styles.settingContent}>
      <Text style={[styles.settingTitle, isDark && styles.settingTitleDark]}>
        {title}
      </Text>
      {subtitle && (
        <Text
          style={[styles.settingSubtitle, isDark && styles.settingSubtitleDark]}
        >
          {subtitle}
        </Text>
      )}
    </View>
    {rightComponent ||
      (showArrow && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? "#666" : "#ccc"}
        />
      ))}
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }: any) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const { colors, getFontSize, settings } = useThemedStyles();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { backgroundColor: colors.headerBackground }]}
      >
        <Text
          style={[
            styles.headerTitle,
            { color: colors.text, fontSize: getFontSize(28) },
          ]}
        >
          Configurações
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { color: colors.textSecondary, fontSize: getFontSize(15) },
          ]}
        >
          Personalize seu aplicativo
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de Preferências */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
          >
            Preferências
          </Text>
          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <SettingItem
              icon="notifications-outline"
              title="Notificações"
              subtitle="Receba alertas sobre novidades"
              showArrow={false}
              isDark={isDarkMode}
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={(value) => {
                    setNotificationsEnabled(value);
                  }}
                  trackColor={{ false: "#ccc", true: colors.primary }}
                  thumbColor={notificationsEnabled ? colors.primary : "#f4f3f4"}
                />
              }
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingItem
              icon="moon-outline"
              title="Modo Escuro"
              subtitle="Aparência do aplicativo"
              showArrow={false}
              isDark={isDarkMode}
              rightComponent={
                <Switch
                  value={isDarkMode}
                  onValueChange={() => {
                    toggleTheme();
                  }}
                  trackColor={{ false: "#ccc", true: colors.primary }}
                  thumbColor={isDarkMode ? colors.primary : "#f4f3f4"}
                />
              }
            />
            <View style={[styles.divider, isDarkMode && styles.dividerDark]} />
            <SettingItem
              icon="language-outline"
              title="Idioma"
              subtitle="Português (Brasil)"
              onPress={() => {}}
              isDark={isDarkMode}
            />
          </View>
        </View>

        {/* Seção de Acessibilidade */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
          >
            Acessibilidade
          </Text>
          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <SettingItem
              icon="accessibility-outline"
              title="Acessibilidade"
              subtitle="Ajustes de fonte, contraste e mais"
              onPress={() => {
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate("Accessibility");
                }
              }}
              isDark={isDarkMode}
            />
          </View>
        </View>

        {/* Seção de Suporte */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
          >
            Suporte
          </Text>
          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <SettingItem
              icon="chatbubble-outline"
              title="Fale Conosco"
              subtitle="Entre em contato"
              onPress={() => {
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate("ContactUs");
                }
              }}
              isDark={isDarkMode}
            />
          </View>
        </View>

        {/* Seção Sobre */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
          >
            Sobre
          </Text>
          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <SettingItem
              icon="information-circle-outline"
              title="Sobre o IFMAP"
              subtitle="Conheça nossa instituição"
              onPress={() => {}}
              isDark={isDarkMode}
            />
            <View style={[styles.divider, isDarkMode && styles.dividerDark]} />
            <SettingItem
              icon="star-outline"
              title="Avaliar App"
              subtitle="Sua opinião é importante"
              onPress={() => {}}
              isDark={isDarkMode}
            />
          </View>
        </View>

        {/* Versão do App */}
        <View style={styles.versionContainer}>
          <Text
            style={[styles.versionText, isDarkMode && styles.versionTextDark]}
          >
            Versão 1.0.0
          </Text>
          <Text
            style={[
              styles.versionSubtext,
              isDarkMode && styles.versionSubtextDark,
            ]}
          >
            IFMAP Mobile © 2025
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  headerDark: {
    backgroundColor: "#1E1E1E",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  headerTitleDark: {
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
  },
  headerSubtitleDark: {
    color: "#AAAAAA",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80, // Espaço para a tab bar
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: "#777",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
    shadowOpacity: 0.3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingIconContainerDark: {
    backgroundColor: "#1B3A1F",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  settingTitleDark: {
    color: "#FFFFFF",
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#999",
  },
  settingSubtitleDark: {
    color: "#AAAAAA",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 68,
  },
  dividerDark: {
    backgroundColor: "#2A2A2A",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  versionTextDark: {
    color: "#777",
  },
  versionSubtext: {
    fontSize: 12,
    color: "#ccc",
  },
  versionSubtextDark: {
    color: "#555",
  },
});
