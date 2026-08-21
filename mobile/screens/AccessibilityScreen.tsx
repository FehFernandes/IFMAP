import React from "react";
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
import {
  useAccessibility,
  FontSizeScale,
} from "../context/AccessibilityContext";

export default function AccessibilityScreen({ navigation }: any) {
  const { colors, getFontSize } = useThemedStyles();
  const { settings, updateSetting } = useAccessibility();

  const fontSizeOptions: { value: FontSizeScale; label: string }[] = [
    { value: "small", label: "Pequeno" },
    { value: "medium", label: "Médio" },
    { value: "large", label: "Grande" },
    { value: "extra-large", label: "Extra Grande" },
  ];

  const handleSettingChange = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    updateSetting(key, value);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[styles.header, { backgroundColor: colors.headerBackground }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: colors.text, fontSize: getFontSize(20) },
          ]}
        >
          Acessibilidade
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Intro */}
          <View style={[styles.introCard, { backgroundColor: colors.card }]}>
            <Ionicons
              name="accessibility-outline"
              size={48}
              color={colors.primary}
            />
            <Text
              style={[
                styles.introTitle,
                { color: colors.text, fontSize: getFontSize(18) },
              ]}
            >
              Personalize sua Experiência
            </Text>
            <Text
              style={[
                styles.introText,
                { color: colors.textSecondary, fontSize: getFontSize(14) },
              ]}
            >
              Ajuste as configurações de acessibilidade para melhorar sua
              experiência no aplicativo.
            </Text>
          </View>

          {/* Tamanho de Fonte */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textSecondary, fontSize: getFontSize(13) },
              ]}
            >
              VISUAL
            </Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.settingHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Ionicons
                    name="text-outline"
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: colors.text, fontSize: getFontSize(16) },
                    ]}
                  >
                    Tamanho da Fonte
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      {
                        color: colors.textSecondary,
                        fontSize: getFontSize(13),
                      },
                    ]}
                  >
                    Ajuste o tamanho do texto
                  </Text>
                </View>
              </View>

              {/* Opções de tamanho */}
              <View style={styles.fontSizeOptions}>
                {fontSizeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.fontSizeButton,
                      { borderColor: colors.border },
                      settings.fontSizeScale === option.value && {
                        backgroundColor: colors.primaryLight,
                        borderColor: colors.primary,
                      },
                    ]}
                    onPress={() =>
                      handleSettingChange("fontSizeScale", option.value)
                    }
                    accessibilityLabel={`Tamanho de fonte ${option.label}`}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: settings.fontSizeScale === option.value,
                    }}
                  >
                    <Text
                      style={[
                        styles.fontSizeButtonText,
                        { color: colors.text },
                        settings.fontSizeScale === option.value && {
                          color: colors.primary,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Preview */}
              <View
                style={[
                  styles.previewBox,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text
                  style={[
                    styles.previewText,
                    { color: colors.text, fontSize: getFontSize(16) },
                  ]}
                >
                  Exemplo de texto com o tamanho selecionado
                </Text>
              </View>
            </View>

            {/* Alto Contraste */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.settingRow}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Ionicons
                    name="contrast-outline"
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: colors.text, fontSize: getFontSize(16) },
                    ]}
                  >
                    Alto Contraste
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      {
                        color: colors.textSecondary,
                        fontSize: getFontSize(13),
                      },
                    ]}
                  >
                    Aumenta o contraste das cores
                  </Text>
                </View>
                <Switch
                  value={settings.highContrast}
                  onValueChange={(value) =>
                    handleSettingChange("highContrast", value)
                  }
                  trackColor={{ false: "#ccc", true: colors.primary }}
                  thumbColor={settings.highContrast ? "#fff" : "#f4f3f4"}
                  accessibilityLabel="Alto contraste"
                />
              </View>
            </View>
          </View>

          {/* Info */}
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.textSecondary}
            />
            <Text
              style={[
                styles.infoText,
                { color: colors.textSecondary, fontSize: getFontSize(13) },
              ]}
            >
              Essas configurações afetam apenas este aplicativo. Para ajustes do
              sistema, acesse as Configurações do seu dispositivo.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontWeight: "700",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 20,
  },
  introCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  introTitle: {
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    textAlign: "center",
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  settingSubtitle: {
    lineHeight: 18,
  },
  fontSizeOptions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  fontSizeButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  previewBox: {
    padding: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  previewText: {
    textAlign: "center",
    lineHeight: 22,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
});
