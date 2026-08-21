import React, { useState, useEffect, useMemo } from "react";
import { locationService } from "../services/api";
import { useToast } from "../hooks/useToast";
import type { Location, LocationFormData } from "../types";

interface LocationsCRUDProps {
  shouldOpenCreate?: boolean;
  onModalOpened?: () => void;
}

const LocationsCRUD: React.FC<LocationsCRUDProps> = ({ shouldOpenCreate, onModalOpened }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { showToast } = useToast();

  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    type: "academico",
    opening_time: "07:00",
    closing_time: "22:00",
  });

  useEffect(() => {
    loadLocations();
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

  const loadLocations = async () => {
    setLoading(true);
    try {
      const response = await locationService.getLocations();
      if (response.success && response.data) {
        setLocations(response.data);
      } else {
        showToast(response.message || "Erro ao carregar localizações", "error");
      }
    } catch {
      showToast("Erro de conexão com o servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filtros e busca
  const filteredLocations = useMemo(() => {
    let filtered = locations;

    if (searchTerm) {
      filtered = filtered.filter(
        (loc) =>
          loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((loc) => loc.type === filterType);
    }

    return filtered;
  }, [locations, searchTerm, filterType]);

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        name: location.name,
        description: location.description,
        latitude: location.latitude,
        longitude: location.longitude,
        type: location.type,
        opening_time: location.opening_time,
        closing_time: location.closing_time,
      });
    } else {
      setEditingLocation(null);
      setFormData({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        type: "academico",
        opening_time: "07:00",
        closing_time: "22:00",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLocation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingLocation) {
        const response = await locationService.updateLocation(editingLocation.id, formData);
        if (response.success) {
          await loadLocations();
          handleCloseModal();
          showToast("Localização atualizada!", "success");
        } else {
          showToast(response.message || "Erro ao atualizar", "error");
        }
      } else {
        const response = await locationService.createLocation(formData);
        if (response.success) {
          await loadLocations();
          handleCloseModal();
          showToast("Localização criada!", "success");
        } else {
          showToast(response.message || "Erro ao criar", "error");
        }
      }
    } catch {
      showToast("Erro de conexão", "error");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Excluir "${name}"?`)) return;

    try {
      const response = await locationService.deleteLocation(id);
      if (response.success) {
        await loadLocations();
        showToast("Localização excluída!", "success");
      } else {
        showToast(response.message || "Erro ao excluir", "error");
      }
    } catch {
      showToast("Erro de conexão", "error");
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      academico: "Acadêmico",
      administrativo: "Administrativo",
      biblioteca: "Biblioteca",
      laboratorio: "Laboratório",
      restaurante: "Restaurante",
      alimentacao: "Alimentação",
      servico: "Serviço",
      alojamento: "Alojamento",
      hospedagem: "Hospedagem",
      esporte: "Esporte",
      lazer: "Lazer",
      cultural: "Cultural",
      teatro: "Teatro",
      paisagem: "Paisagem",
      agricola: "Agrícola",
      animais: "Animais",
      seguranca: "Segurança",
      comercio: "Comércio",
      saude: "Saúde",
      outro: "Outro",
    };
    return types[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      academico: "bg-blue-100 text-blue-800",
      administrativo: "bg-purple-100 text-purple-800",
      biblioteca: "bg-indigo-100 text-indigo-800",
      restaurante: "bg-orange-100 text-orange-800",
      alimentacao: "bg-yellow-100 text-yellow-800",
      esporte: "bg-green-100 text-green-800",
      saude: "bg-red-100 text-red-800",
      agricola: "bg-lime-100 text-lime-800",
      animais: "bg-amber-100 text-amber-800",
      paisagem: "bg-teal-100 text-teal-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const uniqueTypes = useMemo(() => {
    const types = new Set(locations.map((loc) => loc.type));
    return Array.from(types).sort();
  }, [locations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Localizações</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredLocations.length} localização{filteredLocations.length !== 1 ? "ões" : ""}
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
          >
            + Nova Localização
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Tipos</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {getTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-lg font-medium text-gray-900">Nenhuma localização encontrada</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Coordenadas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLocations.map((location) => (
                  <tr key={location.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{location.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(location.type)}`}>
                        {getTypeLabel(location.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseFloat(location.latitude).toFixed(6)}, {parseFloat(location.longitude).toFixed(6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.opening_time} - {location.closing_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleOpenModal(location)}
                        className="text-blue-600 font-medium mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(location.id, location.name)}
                        className="text-red-600 font-medium"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingLocation ? "Editar Localização" : "Nova Localização"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Prédio I"
                  />
                </div>

                {/* Descrição */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrição breve da localização"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="academico">Acadêmico</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="biblioteca">Biblioteca</option>
                    <option value="laboratorio">Laboratório</option>
                    <option value="restaurante">Restaurante</option>
                    <option value="alimentacao">Alimentação</option>
                    <option value="servico">Serviço</option>
                    <option value="alojamento">Alojamento</option>
                    <option value="hospedagem">Hospedagem</option>
                    <option value="esporte">Esporte</option>
                    <option value="lazer">Lazer</option>
                    <option value="cultural">Cultural</option>
                    <option value="teatro">Teatro</option>
                    <option value="paisagem">Paisagem</option>
                    <option value="agricola">Agrícola</option>
                    <option value="animais">Animais</option>
                    <option value="seguranca">Segurança</option>
                    <option value="comercio">Comércio</option>
                    <option value="saude">Saúde</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                {/* Latitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="-18.548599"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="-42.764199"
                  />
                </div>

                {/* Horário Abertura */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Abertura <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.opening_time}
                    onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Horário Fechamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fechamento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.closing_time}
                    onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
                >
                  {editingLocation ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsCRUD;
