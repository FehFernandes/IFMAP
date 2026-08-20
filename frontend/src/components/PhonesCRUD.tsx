import React, { useState, useEffect } from "react";
import { phoneService } from "../services/api";
import type { Phone, PhoneFormData } from "../types";

interface PhonesCRUDProps {
  shouldOpenCreate?: boolean;
  onModalOpened?: () => void;
}

const PhonesCRUD: React.FC<PhonesCRUDProps> = ({ shouldOpenCreate, onModalOpened }) => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);
  const [formData, setFormData] = useState<PhoneFormData>({
    contact_name: "",
    contact_position: "",
    contact_email: "",
    number: "",
    label: "",
    order: 0,
  });

  useEffect(() => {
    loadData();
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

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const phonesResponse = await phoneService.getPhones();

      if (phonesResponse.success && phonesResponse.data) {
        setPhones(phonesResponse.data);
      }
    } catch {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (phone?: Phone) => {
    if (phone) {
      setEditingPhone(phone);
      setFormData({
        contact_name: phone.contact_name || "",
        contact_position: phone.contact_position || "",
        contact_email: phone.contact_email || "",
        number: phone.number,
        label: phone.label || "",
        order: phone.order || 0,
      });
    } else {
      setEditingPhone(null);
      setFormData({
        contact_name: "",
        contact_position: "",
        contact_email: "",
        number: "",
        label: "",
        order: 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPhone(null);
    setFormData({
      contact_name: "",
      contact_position: "",
      contact_email: "",
      number: "",
      label: "",
      order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (editingPhone) {
        const response = await phoneService.updatePhone(
          editingPhone.id,
          formData
        );
        if (response.success) {
          await loadData();
          handleCloseModal();
        } else {
          setError(response.message || "Erro ao atualizar telefone");
        }
      } else {
        const response = await phoneService.createPhone(formData);
        if (response.success) {
          await loadData();
          handleCloseModal();
        } else {
          setError(response.message || "Erro ao criar telefone");
        }
      }
    } catch {
      setError("Erro de conexão com o servidor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este telefone?")) {
      return;
    }

    setError("");

    try {
      const response = await phoneService.deletePhone(id);
      if (response.success) {
        await loadData();
      } else {
        setError(response.message || "Erro ao excluir telefone");
      }
    } catch {
      setError("Erro de conexão com o servidor");
    }
  };

  const formatPhoneNumber = (number: string) => {
    // Remove tudo que não é número
    const cleaned = number.replace(/\D/g, "");
    
    // Formata: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return number;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Gerenciar Telefones
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Novo Telefone
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
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {phones.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Nenhum telefone cadastrado
                    </td>
                  </tr>
                ) : (
                  phones.map((phone) => (
                    <tr key={phone.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {phone.contact_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {phone.contact_position || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPhoneNumber(phone.number)}
                        </div>
                        {phone.label && (
                          <div className="text-xs text-gray-500">{phone.label}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {phone.contact_email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(phone)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(phone.id)}
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
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingPhone ? "Editar Telefone" : "Novo Telefone"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Responsável *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_name: e.target.value })
                    }
                    placeholder="João da Silva"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo/Função *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_position}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_position: e.target.value })
                    }
                    placeholder="Diretor Geral"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_email: e.target.value })
                    }
                    placeholder="contato@ifmg.edu.br"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    placeholder="(33) 3412-2900"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observação
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    placeholder="Ramal 100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    {editingPhone ? "Atualizar" : "Criar"}
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

export default PhonesCRUD;
