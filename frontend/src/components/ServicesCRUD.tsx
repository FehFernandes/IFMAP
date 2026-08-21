import React, { useState, useEffect } from "react";
import { serviceService, sectorService } from "../services/api";
import type { Service, ServiceFormData, Sector } from "../types";

interface ServicesCRUDProps {
  shouldOpenCreate?: boolean;
  onModalOpened?: () => void;
}

const ServicesCRUD: React.FC<ServicesCRUDProps> = ({ shouldOpenCreate, onModalOpened }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    sector_id: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  // Abre modal automaticamente quando solicitado pelos botões de Ações Rápidas
  useEffect(() => {
    if (shouldOpenCreate === true && !showModal && sectors.length > 0) {
      handleOpenModal();
      if (onModalOpened) {
        onModalOpened();
      }
    }
  }, [shouldOpenCreate, showModal, sectors.length]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [servicesResponse, sectorsResponse] = await Promise.all([
        serviceService.getServices(),
        sectorService.getSectors(),
      ]);

      if (servicesResponse.success && servicesResponse.data) {
        setServices(servicesResponse.data);
      }

      if (sectorsResponse.success && sectorsResponse.data) {
        setSectors(sectorsResponse.data);
      }
    } catch {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        sector_id: service.sector_id,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        sector_id: sectors.length > 0 ? sectors[0].id : 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      sector_id: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.sector_id) {
      setError("Selecione um setor");
      return;
    }

    try {
      if (editingService) {
        const response = await serviceService.updateService(
          editingService.id,
          formData
        );
        if (response.success) {
          await loadData();
          handleCloseModal();
        } else {
          setError(response.message || "Erro ao atualizar serviço");
        }
      } else {
        const response = await serviceService.createService(formData);
        if (response.success) {
          await loadData();
          handleCloseModal();
        } else {
          setError(response.message || "Erro ao criar serviço");
        }
      }
    } catch {
      setError("Erro de conexão com o servidor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) {
      return;
    }

    setError("");

    try {
      const response = await serviceService.deleteService(id);
      if (response.success) {
        await loadData();
      } else {
        setError(response.message || "Erro ao excluir serviço");
      }
    } catch {
      setError("Erro de conexão com o servidor");
    }
  };

  const getSectorInfo = (sectorId: number) => {
    const sector = sectors.find((s) => s.id === sectorId);
    if (!sector) return { name: "N/A", location: "N/A" };
    
    return {
      name: sector.name,
      location: sector.location?.name || "N/A",
    };
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Serviços</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Novo Serviço
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
                    Nome do Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Setor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Nenhum serviço cadastrado
                    </td>
                  </tr>
                ) : (
                  services.map((service) => {
                    const sectorInfo = getSectorInfo(service.sector_id);
                    return (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {service.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {service.description.length > 60
                              ? service.description.substring(0, 60) + "..."
                              : service.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {sectorInfo.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sectorInfo.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal(service)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
                {editingService ? "Editar Serviço" : "Novo Serviço"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Abertura de Matrícula, Atendimento ao Aluno..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descreva detalhadamente o serviço oferecido..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Setor *
                  </label>
                  <select
                    required
                    value={formData.sector_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sector_id: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um setor</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name} ({sector.location?.name || "Sem localização"})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Selecione o setor onde este serviço é prestado
                  </p>
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
                    {editingService ? "Atualizar" : "Criar"}
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

export default ServicesCRUD;
