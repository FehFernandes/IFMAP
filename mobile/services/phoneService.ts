import api from "./api";

export interface Phone {
  id: number;
  contact_name: string;
  contact_position: string;
  contact_email: string;
  number: string;
  label: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface PhonesResponse {
  data: Phone[];
}

export const getPhones = async (): Promise<Phone[]> => {
  try {
    const response = await api.get<PhonesResponse>("/phones");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getPhone = async (id: number): Promise<Phone> => {
  try {
    const response = await api.get<{ data: Phone }>(`/phones/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Converter Phone da API para o formato usado na tela
export const convertPhoneToContact = (phone: Phone) => {
  return {
    id: phone.id.toString(),
    name: phone.contact_name || "Sem nome",
    phone: phone.number,
    email: phone.contact_email || "",
    department: phone.contact_position || "Sem cargo",
    label: phone.label || undefined,
  };
};
