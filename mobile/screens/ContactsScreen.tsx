import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { getPhones, convertPhoneToContact, Phone } from "../services/phoneService";

// Tipo para contatos
interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  label?: string;
}

export default function ContactsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, getFontSize } = useThemedStyles();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setError(null);
      const phones = await getPhones();
      const contactsList = phones.map(convertPhoneToContact);
      setContacts(contactsList);
    } catch (err) {
      setError("Não foi possível carregar os contatos. Tente novamente.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadContacts();
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\D/g, "")}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { backgroundColor: colors.headerBackground }]}
      >
        <Text
          style={[
            styles.headerTitle,
            { color: colors.text, fontSize: getFontSize(32) },
          ]}
        >
          Contatos
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { color: colors.textSecondary, fontSize: getFontSize(15) },
          ]}
        >
          Telefones e e-mails do IFMAP
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
          style={[
            styles.searchInput,
            { color: colors.text, fontSize: getFontSize(16) },
          ]}
          placeholder="Buscar contato ou setor..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.contactsList}
        contentContainerStyle={styles.contactsListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={[
                styles.loadingText,
                { color: colors.textSecondary, fontSize: getFontSize(16) },
              ]}
            >
              Carregando contatos...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
            <Text
              style={[
                styles.errorText,
                { color: colors.error, fontSize: getFontSize(16) },
              ]}
            >
              {error}
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={loadContacts}
            >
              <Text style={[styles.retryButtonText, { fontSize: getFontSize(16) }]}>
                Tentar novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredContacts.length === 0 && searchQuery ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.border} />
            <Text
              style={[
                styles.emptyText,
                { color: colors.textSecondary, fontSize: getFontSize(16) },
              ]}
            >
              Nenhum contato encontrado
            </Text>
          </View>
        ) : (
          filteredContacts.map((contact) => (
          <View
            key={contact.id}
            style={[styles.contactCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.contactHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.iconBackground },
                ]}
              >
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text
                  style={[
                    styles.contactName,
                    { color: colors.text, fontSize: getFontSize(18) },
                  ]}
                >
                  {contact.name}
                </Text>
                <Text
                  style={[
                    styles.contactDepartment,
                    { color: colors.textSecondary, fontSize: getFontSize(14) },
                  ]}
                >
                  {contact.department}
                </Text>
              </View>
            </View>

            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCall(contact.phone)}
              >
                <Ionicons name="call" size={18} color={colors.primary} />
                <Text
                  style={[
                    styles.actionText,
                    { color: colors.primary, fontSize: getFontSize(15) },
                  ]}
                >
                  {contact.phone}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEmail(contact.email)}
              >
                <Ionicons name="mail" size={18} color={colors.primary} />
                <Text
                  style={[
                    styles.actionText,
                    { color: colors.primary, fontSize: getFontSize(15) },
                  ]}
                >
                  {contact.email}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
        )}

        {!loading && !error && filteredContacts.length === 0 && !searchQuery && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.border} />
            <Text
              style={[
                styles.emptyText,
                { color: colors.textSecondary, fontSize: getFontSize(16) },
              ]}
            >
              Nenhum contato cadastrado
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
  contactsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contactsListContent: {
    paddingBottom: 80, // Espaço para a tab bar
  },
  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  contactDepartment: {
    fontSize: 14,
    color: "#666",
  },
  contactActions: {
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  actionText: {
    fontSize: 15,
    color: "#2E7D32",
    marginLeft: 12,
    fontWeight: "500",
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#C62828",
    marginTop: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});
