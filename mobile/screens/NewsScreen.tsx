import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "../hooks/useThemedStyles";
import newsService, { News } from "../services/newsService";

export default function NewsScreen() {
  const { colors, getFontSize } = useThemedStyles();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await newsService.getAll();
      setNews(data);
    } catch (err) {
      setError("Não foi possível carregar as notícias");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const handleNewsPress = (newsUrl: string) => {
    Linking.openURL(newsUrl).catch(() => {});
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[styles.header, { backgroundColor: colors.headerBackground }]}
        >
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: getFontSize(32) }]}>
            Notícias
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: getFontSize(15) }]}>
            Fique por dentro do IFMG
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary, fontSize: getFontSize(15) }]}>
            Carregando notícias...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[styles.header, { backgroundColor: colors.headerBackground }]}
        >
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: getFontSize(32) }]}>
            Notícias
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: getFontSize(15) }]}>
            Fique por dentro do IFMG
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error, fontSize: getFontSize(15) }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={loadNews}>
            <Text style={[styles.retryButtonText, { fontSize: getFontSize(15) }]}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (news.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[styles.header, { backgroundColor: colors.headerBackground }]}
        >
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: getFontSize(32) }]}>
            Notícias
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: getFontSize(15) }]}>
            Fique por dentro do IFMG
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="newspaper-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: getFontSize(15) }]}>
            Nenhuma notícia disponível no momento
          </Text>
        </View>
      </View>
    );
  }

  const featuredNews = news.find((n) => n.category === "manchete") || news[0];
  const otherNews = news.filter((n) => n.id !== featuredNews.id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { backgroundColor: colors.headerBackground }]}
      >
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: getFontSize(32) }]}>
          Notícias
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: getFontSize(15) }]}>
          Fique por dentro do IFMG
        </Text>
      </View>

      <ScrollView
        style={styles.newsList}
        contentContainerStyle={styles.newsListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Notícia em destaque */}
        <TouchableOpacity
          style={[styles.featuredCard, { backgroundColor: colors.card }]}
          onPress={() => handleNewsPress(featuredNews.url)}
        >
          <View style={styles.featuredContent}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: newsService.getCategoryColor(
                    featuredNews.category
                  ),
                },
              ]}
            >
              <Text style={[styles.categoryText, { fontSize: getFontSize(12) }]}>
                {newsService.getCategoryLabel(featuredNews.category)}
              </Text>
            </View>
            <Text style={[styles.featuredTitle, { color: colors.text, fontSize: getFontSize(22) }]}>
              {featuredNews.title}
            </Text>
            {featuredNews.description && (
              <Text
                style={[
                  styles.featuredSummary,
                  { color: colors.textSecondary, fontSize: getFontSize(15) },
                ]}
                numberOfLines={3}
              >
                {featuredNews.description}
              </Text>
            )}
            <View style={styles.newsFooter}>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={[styles.dateText, { color: colors.textSecondary, fontSize: getFontSize(13) }]}>
                {newsService.formatDate(featuredNews.published_at)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Lista de notícias */}
        {otherNews.length > 0 && (
          <View style={styles.newsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: getFontSize(20) }]}>
              Mais notícias
            </Text>
            {otherNews.map((newsItem) => (
              <TouchableOpacity
                key={newsItem.id}
                style={[styles.newsCard, { backgroundColor: colors.card }]}
                onPress={() => handleNewsPress(newsItem.url)}
              >
                <View style={styles.newsContent}>
                  <View
                    style={[
                      styles.smallCategoryBadge,
                      {
                        backgroundColor: newsService.getCategoryColor(
                          newsItem.category
                        ),
                      },
                    ]}
                  >
                    <Text style={[styles.smallCategoryText, { fontSize: getFontSize(10) }]}>
                      {newsService.getCategoryLabel(newsItem.category)}
                    </Text>
                  </View>
                  <Text
                    style={[styles.newsTitle, { color: colors.text, fontSize: getFontSize(15) }]}
                    numberOfLines={2}
                  >
                    {newsItem.title}
                  </Text>
                  {newsItem.description && (
                    <Text
                      style={[
                        styles.newsSummary,
                        { color: colors.textSecondary, fontSize: getFontSize(13) },
                      ]}
                      numberOfLines={2}
                    >
                      {newsItem.description}
                    </Text>
                  )}
                  <View style={styles.newsFooter}>
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.newsDate, { color: colors.textSecondary, fontSize: getFontSize(11) }]}
                    >
                      {newsService.formatDate(newsItem.published_at)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
  newsList: {
    flex: 1,
  },
  newsListContent: {
    paddingBottom: 80, // Espaço para a tab bar
  },
  featuredCard: {
    backgroundColor: "#fff",
    margin: 24,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  featuredContent: {
    padding: 20,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 28,
  },
  featuredSummary: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#999",
  },
  newsSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  newsCard: {
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
  newsContent: {
    flex: 1,
  },
  smallCategoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  smallCategoryText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 20,
    marginBottom: 4,
  },
  newsSummary: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  newsDate: {
    fontSize: 11,
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    marginTop: 12,
    fontSize: 15,
    color: "#C62828",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#2E7D32",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
});
