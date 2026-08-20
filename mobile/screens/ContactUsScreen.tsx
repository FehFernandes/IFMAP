import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "../hooks/useThemedStyles";

export default function ContactUsScreen({ navigation }: any) {
  const { colors, getFontSize } = useThemedStyles();

  const contacts = [
    {
      id: "1",
      role: "Desenvolvedor",
      name: "Felipe Fernandes",
      email: "contatofelipef7@gmail.com",
    },
    {
      id: "2",
      role: "Professor",
      name: "Rosinei Figueiredo",
      email: "rosinei.figueiredo@ifmg.edu.br",
    },
  ];

  const handleEmailPress = (email: string, name: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o aplicativo de e-mail.", [
        { text: "OK" },
      ]);
    });
  };

  const handleCopyEmail = (email: string) => {
    // Para copiar, você pode usar @react-native-clipboard/clipboard
    // Por enquanto, apenas mostramos um alerta
    Alert.alert("E-mail", email, [{ text: "OK" }]);
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
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: getFontSize(20) }]}>
          Fale Conosco
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Contacts */}
          {contacts.map((contact) => (
            <View
              key={contact.id}
              style={[styles.contactCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.contactHeader}>
                <View
                  style={[
                    styles.avatarCircle,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Ionicons name="person" size={24} color={colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text
                    style={[styles.roleText, { color: colors.textSecondary, fontSize: getFontSize(13) }]}
                  >
                    {contact.role}
                  </Text>
                  <Text style={[styles.nameText, { color: colors.text, fontSize: getFontSize(18) }]}>
                    {contact.name}
                  </Text>
                </View>
              </View>

              {/* Email Button */}
              <TouchableOpacity
                style={[
                  styles.emailButton,
                  { backgroundColor: colors.primaryLight },
                ]}
                onPress={() => handleEmailPress(contact.email, contact.name)}
                activeOpacity={0.7}
              >
                <Ionicons name="mail" size={20} color={colors.primary} />
                <Text style={[styles.emailText, { color: colors.primary, fontSize: getFontSize(14) }]}>
                  {contact.email}
                </Text>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => handleEmailPress(contact.email, contact.name)}
                >
                  <Ionicons name="send" size={18} color="#FFF" />
                  <Text style={[styles.actionButtonText, { fontSize: getFontSize(15) }]}>Enviar E-mail</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          
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
    fontSize: 20,
    fontWeight: "700",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    padding: 20,
  },
  introCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  contactCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  roleText: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
  },
  emailButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  emailText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  footerCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  footerText: {
    fontSize: 13,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
});
