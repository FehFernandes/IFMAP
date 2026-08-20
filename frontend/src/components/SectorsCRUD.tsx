import React, { useState, useEffect } from "react";
import { sectorService, locationService } from "../services/api";
import type { Sector, SectorFormData, Location } from "../types";

interface SectorsCRUDProps {
  shouldOpenCreate?: boolean;
  onModalOpened?: () => void;
}

const SectorsCRUD: React.FC<SectorsCRUDProps> = ({ shouldOpenCreate, onModalOpened }) => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState<SectorFormData>({
    name: "",
    description: "",
    location_id: 0,
    floor: "",
    opening_time: "08:00",
    closing_time: "18:00",
  });

  useEffect(() => {
    loadData();
  }, []);

  // Abre modal automaticamente quando solicitado pelos botões de Ações Rápidas
  useEffect(() => {
    if (shouldOpenCreate === true && !showModal && locations.length > 0) {
      handleOpenModal();
      if (onModalOpened) {
        onModalOpened();
      }
    }
  }, [shouldOpenCreate, showModal, locations.length]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [sectorsResponse, locationsResponse] = await Promise.all([
        sectorService.getSectors(),
        locationService.getLocations(),
      ]);

      if (sectorsResponse.success && sectorsResponse.data) {
        setSectors(sectorsResponse.data);
      }

      if (locationsResponse.success && locationsResponse.data) {
        setLocations(locationsResponse.data);
      }
    } catch {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (sector?: Sector) => {
    if (sector) {
      setEditingSector(sector);
      setFormData({
        name: sector.name,
        description: sector.description,
        location_id: sector.location_id,
        floor: sector.floor,
        opening_time: sector.opening_time,
        closing_time: sector.closing_time,
      });
    } else {
      setEditingSector(null);
      setFormData({
        name: "",
        description: "",
        location_id: locations.length > 0 ? locations[0].id : 0,
        floor: "",
        opening_time: "08:00",
        closing_time: "18:00",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSector(null);
    setFormData({
      name: "",
      description: "",
      location_id: 0,
      floor: "",
      opening_time: "08:00",
      closing_time: "18:00",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.location_id) {
      setError("Selecione uma localização");
      return;
    }

    try {
      if (editingSector) {
        const response = await sectorService.updateSector(
          editingSector.id,
          formData
        );
        if (response.success) {
          await loadData();
          handleCloseModal();
        } else {
          setError(response.message || "Erro ao atualizar setor");
        }
      } else {
        const response = await sectorService.createSector(formData);
        if (response.success) {
          await loadData();
          handleCloseModal();
        } else {
          setError(response.message || "Erro ao criar setor");
        }
      }
    } catch {
      setError("Erro de conexão com o servidor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este setor?")) {
      return;
    }

    setError("");

    try {
      const response = await sectorService.deleteSector(id);
      if (response.success) {
        await loadData();
      } else {
        setError(response.message || "Erro ao excluir setor");
      }
    } catch {
      setError("Erro de conexão com o servidor");
    }
  };

  const getLocationName = (locationId: number) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.name : "N/A";
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Setores</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Novo Setor
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Andar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sectors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Nenhum setor cadastrado
                    </td>
                  </tr>
                ) : (
                  sectors.map((sector) => (
                    <tr key={sector.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {sector.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sector.description.length > 50
                            ? sector.description.substring(0, 50) + "..."
                            : sector.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getLocationName(sector.location_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {sector.floor}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sector.opening_time} - {sector.closing_time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(sector)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(sector.id)}
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
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingSector ? "Editar Setor" : "Novo Setor"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização *
                  </label>
                  <select
                    required
                    value={formData.location_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location_id: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione uma localização</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Andar *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.floor}
                    onChange={(e) =>
                      setFormData({ ...formData, floor: e.target.value })
                    }
                    placeholder="Ex: 1º andar, Térreo, 2º andar..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário Abertura *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.opening_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          opening_time: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário Fechamento *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.closing_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          closing_time: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingSector ? "Atualizar" : "Criar"}
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

export default SectorsCRUD;
