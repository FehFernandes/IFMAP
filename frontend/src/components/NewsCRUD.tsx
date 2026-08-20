import React, { useState, useEffect } from "react";
import { newsService } from "../services/api";
import type { News, NewsFormData } from "../types";
import { useToast } from "../hooks/useToast";

interface NewsCRUDProps {
  shouldOpenCreate?: boolean;
  onModalOpened?: () => void;
}

const NewsCRUD: React.FC<NewsCRUDProps> = ({ shouldOpenCreate, onModalOpened }) => {
  const { showToast } = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isScrapingPortal, setIsScrapingPortal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    url: "",
    description: "",
    published_at: new Date().toISOString().split("T")[0],
    category: "noticia",
    order: 0,
  });

  useEffect(() => {
    loadNews();
  }, []);

  // Abre modal automaticamente quando solicitado pelos botões de Ações Rápidas
  useEffect(() => {
    if (shouldOpenCreate === true && !showModal) {
      handleOpenModal();
      if (onModalOpened) {
        onModalOpened();
      }
    }
  }, [shouldOpenCreate, showModal]);

  const loadNews = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await newsService.getAll();
      if (response.success && response.data) {
        setNews(response.data);
      } else {
        setError(response.message || "Erro ao carregar notícias");
      }
    } catch {
      setError("Erro ao carregar notícias");
    } finally {
      setLoading(false);
    }
  };

  const handleScrapePortal = async () => {
    setIsScrapingPortal(true);
    setError("");
    try {
      const response = await newsService.scrapePortal();
      if (response.success && response.data) {
        showToast(
          `Sincronização concluída: ${response.data.created} criada(s), ${response.data.updated} atualizada(s)`,
          "success"
        );
        await loadNews();
      } else {
        setError(response.message || "Erro ao fazer scraping");
        showToast("Erro ao fazer scraping do portal", "error");
      }
    } catch {
      setError("Erro ao fazer scraping");
      showToast("Erro ao fazer scraping do portal", "error");
    } finally {
      setIsScrapingPortal(false);
    }
  };

  const handleOpenModal = (newsItem?: News) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title: newsItem.title,
        url: newsItem.url,
        description: newsItem.description || "",
        published_at: newsItem.published_at,
        category: newsItem.category,
        order: newsItem.order,
      });
    } else {
      setEditingNews(null);
      setFormData({
        title: "",
        url: "",
        description: "",
        published_at: new Date().toISOString().split("T")[0],
        category: "noticia",
        order: 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNews(null);
    setFormData({
      title: "",
      url: "",
      description: "",
      published_at: new Date().toISOString().split("T")[0],
      category: "noticia",
      order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let response;
      if (editingNews) {
        response = await newsService.update(editingNews.id, formData);
      } else {
        response = await newsService.create(formData);
      }

      if (response.success) {
        showToast(
          editingNews ? "Notícia atualizada com sucesso!" : "Notícia criada com sucesso!",
          "success"
        );
        handleCloseModal();
        await loadNews();
      } else {
        setError(response.message || "Erro ao salvar notícia");
        showToast("Erro ao salvar notícia", "error");
      }
    } catch {
      setError("Erro ao salvar notícia");
      showToast("Erro ao salvar notícia", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta notícia?")) {
      return;
    }

    try {
      const response = await newsService.delete(id);
      if (response.success) {
        showToast("Notícia excluída com sucesso!", "success");
        await loadNews();
      } else {
        showToast("Erro ao excluir notícia", "error");
      }
    } catch {
      showToast("Erro ao excluir notícia", "error");
    }
  };

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    const badges = {
      manchete: "bg-red-100 text-red-800 border-red-300",
      destaque: "bg-yellow-100 text-yellow-800 border-yellow-300",
      noticia: "bg-blue-100 text-blue-800 border-blue-300",
    };
    const labels = {
      manchete: "Manchete",
      destaque: "Destaque",
      noticia: "Notícia",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full border ${badges[category as keyof typeof badges]}`}
      >
        {labels[category as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando notícias...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Notícias</h1>
        <div className="flex gap-3">
          <button
            onClick={handleScrapePortal}
            disabled={isScrapingPortal}
            className={`flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${
              isScrapingPortal ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isScrapingPortal ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Atualizando...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Atualizar do Portal</span>
              </>
            )}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Nova Notícia</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <input
            type="text"
            placeholder="Buscar notícias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas as categorias</option>
            <option value="manchete">Manchetes</option>
            <option value="destaque">Destaques</option>
            <option value="noticia">Notícias</option>
          </select>
        </div>
      </div>

      {/* Lista de notícias */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Publicação
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredNews.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Nenhuma notícia encontrada. Clique em "Atualizar do Portal" para importar notícias.
                </td>
              </tr>
            ) : (
              filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                      >
                        Ver no portal →
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCategoryBadge(item.category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.published_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de criar/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingNews ? "Editar Notícia" : "Nova Notícia"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as "noticia" | "destaque" | "manchete",
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="noticia">Notícia</option>
                      <option value="destaque">Destaque</option>
                      <option value="manchete">Manchete</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Publicação *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.published_at}
                      onChange={(e) =>
                        setFormData({ ...formData, published_at: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingNews ? "Atualizar" : "Criar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCRUD;
