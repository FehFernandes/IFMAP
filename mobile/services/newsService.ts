import api from "./api";

export interface News {
  id: number;
  title: string;
  url: string;
  description?: string;
  published_at: string;
  category: "noticia" | "destaque" | "manchete";
  order: number;
  created_at?: string;
  updated_at?: string;
}

interface NewsResponse {
  message: string;
  data: News[];
}

export const newsService = {
  async getAll(): Promise<News[]> {
    try {
      const response = await api.get<NewsResponse>("/news");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number): Promise<News> {
    try {
      const response = await api.get<{ message: string; data: News }>(
        `/news/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Mapeia a categoria do backend para uma categoria mais amigável
  getCategoryLabel(category: string): string {
    switch (category) {
      case "manchete":
        return "Manchete";
      case "destaque":
        return "Destaque";
      case "noticia":
        return "Notícia";
      default:
        return "Geral";
    }
  },

  // Define cor baseada na categoria
  getCategoryColor(category: string): string {
    switch (category) {
      case "manchete":
        return "#C62828"; // Vermelho para manchetes
      case "destaque":
        return "#F57C00"; // Laranja para destaques
      case "noticia":
        return "#1976D2"; // Azul para notícias
      default:
        return "#666";
    }
  },

  // Formata a data para exibição
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  },
};

export default newsService;
