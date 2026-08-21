import axios from "axios";
import type {
  LoginCredentials,
  AuthResponse,
  User,
  ApiResponse,
  Location,
  LocationFormData,
  Sector,
  SectorFormData,
  Service,
  ServiceFormData,
  Phone,
  PhoneFormData,
  Photo,
  PhotoFormData,
  News,
  NewsFormData,
  ScrapeResponse,
} from "../types";

/**
 * Formato padrão de resposta dos controllers do Laravel: `{ message, data }`.
 * Alguns endpoints também devolvem `success`.
 */
interface LaravelResource<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/** Corpo de erro devolvido pelo Laravel (inclui erros de validação 422). */
interface LaravelError {
  message?: string;
  errors?: Record<string, string[]>;
}

/** Extrai a mensagem de erro de uma exceção, com fallback amigável. */
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<LaravelError>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

/** Extrai os erros de validação (HTTP 422) de uma exceção do axios. */
const getValidationErrors = (
  error: unknown
): Record<string, string[]> | undefined => {
  if (axios.isAxiosError<LaravelError>(error)) {
    return error.response?.data?.errors;
  }

  return undefined;
};

/**
 * Normaliza a resposta `{ message, data }` do Laravel para o formato
 * `ApiResponse` usado pelo painel.
 */
const normalizeResource = <T>(
  payload: LaravelResource<T> | undefined,
  successMessage: string
): ApiResponse<T> => {
  if (payload?.data) {
    return {
      success: true,
      message: payload.message ?? successMessage,
      data: payload.data,
    };
  }

  return {
    success: payload?.success ?? false,
    message: payload?.message ?? "Resposta inesperada do servidor",
  };
};

// URL da API - usa variável de ambiente em produção
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 60000, // 60 segundos timeout para uploads grandes
  maxContentLength: 20 * 1024 * 1024, // 20MB máximo
  maxBodyLength: 20 * 1024 * 1024, // 20MB máximo
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Login com endpoint real do Laravel
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/login", credentials);

      if (response.data.success && response.data.data && response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));

        return response.data;
      }

      return {
        success: false,
        message: response.data.message || "Erro ao fazer login",
      };
    } catch (error) {
      console.error("Erro no login:", error);

      // Tratar erros de validação do Laravel
      const validationErrors = getValidationErrors(error);
      if (validationErrors?.email) {
        return {
          success: false,
          message: validationErrors.email[0],
        };
      }

      return {
        success: false,
        message: getErrorMessage(error, "Erro de conexão com o servidor"),
      };
    }
  },

  // Logout
  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  // Verificar se usuário está logado
  isAuthenticated(): boolean {
    const token = localStorage.getItem("auth_token");
    return !!token;
  },

  // Obter usuário atual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },
};

export const userService = {
  // Listar usuários
  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await api.get<ApiResponse<User[]>>("/users");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return {
        success: false,
        message: "Erro ao buscar usuários",
      };
    }
  },

  // Criar usuário
  async createUser(
    userData: Omit<User, "id" | "created_at" | "updated_at"> & {
      password: string;
    }
  ): Promise<ApiResponse<User>> {
    try {
      const response = await api.post<ApiResponse<User>>("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return {
        success: false,
        message: "Erro ao criar usuário",
      };
    }
  },

  // Atualizar usuário
  async updateUser(
    id: number,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    try {
      const response = await api.put<ApiResponse<User>>(
        `/users/${id}`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return {
        success: false,
        message: "Erro ao atualizar usuário",
      };
    }
  },

  // Deletar usuário
  async deleteUser(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return {
        success: false,
        message: "Erro ao deletar usuário",
      };
    }
  },
};

export const locationService = {
  // Listar locations
  async getLocations(): Promise<ApiResponse<Location[]>> {
    try {
      const response = await api.get("/locations");
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Erro ao buscar localizações:", error);
      return {
        success: false,
        message: "Erro ao buscar localizações",
      };
    }
  },

  // Criar location
  async createLocation(locationData: LocationFormData): Promise<ApiResponse<Location>> {
    try {
      const response = await api.post<ApiResponse<Location>>("/locations", locationData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar localização:", error);
      return {
        success: false,
        message: "Erro ao criar localização",
      };
    }
  },

  // Atualizar location
  async updateLocation(id: number, locationData: Partial<LocationFormData>): Promise<ApiResponse<Location>> {
    try {
      const response = await api.put<ApiResponse<Location>>(`/locations/${id}`, locationData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar localização:", error);
      return {
        success: false,
        message: "Erro ao atualizar localização",
      };
    }
  },

  // Deletar location
  async deleteLocation(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/locations/${id}`);
      // Backend retorna 204 No Content (sem body)
      if (response.status === 204 || !response.data) {
        return {
          success: true,
          message: "Local excluído com sucesso",
        };
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar localização:", error);
      return {
        success: false,
        message: "Erro ao deletar localização",
      };
    }
  },
};

export const sectorService = {
  // Listar setores
  async getSectors(): Promise<ApiResponse<Sector[]>> {
    try {
      const response = await api.get("/sectors");
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
      return {
        success: false,
        message: "Erro ao buscar setores",
      };
    }
  },

  // Criar setor
  async createSector(sectorData: SectorFormData): Promise<ApiResponse<Sector>> {
    try {
      const response = await api.post<LaravelResource<Sector>>("/sectors", sectorData);
      return normalizeResource(response.data, "Setor criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar setor:", error);
      return {
        success: false,
        message: "Erro ao criar setor",
      };
    }
  },

  // Atualizar setor
  async updateSector(id: number, sectorData: Partial<SectorFormData>): Promise<ApiResponse<Sector>> {
    try {
      const response = await api.put<LaravelResource<Sector>>(`/sectors/${id}`, sectorData);
      return normalizeResource(response.data, "Setor atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar setor:", error);
      return {
        success: false,
        message: "Erro ao atualizar setor",
      };
    }
  },

  // Deletar setor
  async deleteSector(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/sectors/${id}`);
      // Backend retorna 204 No Content (sem body)
      if (response.status === 204 || !response.data) {
        return {
          success: true,
          message: "Setor excluído com sucesso",
        };
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar setor:", error);
      return {
        success: false,
        message: "Erro ao deletar setor",
      };
    }
  },
};

export const serviceService = {
  // Listar serviços
  async getServices(): Promise<ApiResponse<Service[]>> {
    try {
      const response = await api.get("/services");
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      return {
        success: false,
        message: "Erro ao buscar serviços",
      };
    }
  },

  // Criar serviço
  async createService(serviceData: ServiceFormData): Promise<ApiResponse<Service>> {
    try {
      const response = await api.post<LaravelResource<Service>>("/services", serviceData);
      return normalizeResource(response.data, "Serviço criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      return {
        success: false,
        message: "Erro ao criar serviço",
      };
    }
  },

  // Atualizar serviço
  async updateService(id: number, serviceData: Partial<ServiceFormData>): Promise<ApiResponse<Service>> {
    try {
      const response = await api.put<LaravelResource<Service>>(`/services/${id}`, serviceData);
      return normalizeResource(response.data, "Serviço atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      return {
        success: false,
        message: "Erro ao atualizar serviço",
      };
    }
  },

  // Deletar serviço
  async deleteService(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/services/${id}`);
      // Backend retorna 204 No Content (sem body)
      if (response.status === 204 || !response.data) {
        return {
          success: true,
          message: "Serviço excluído com sucesso",
        };
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      return {
        success: false,
        message: "Erro ao deletar serviço",
      };
    }
  },
};

export const phoneService = {
  // Listar telefones
  async getPhones(): Promise<ApiResponse<Phone[]>> {
    try {
      const response = await api.get("/phones");
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Erro ao buscar telefones:", error);
      return {
        success: false,
        message: "Erro ao buscar telefones",
      };
    }
  },

  // Criar telefone
  async createPhone(phoneData: PhoneFormData): Promise<ApiResponse<Phone>> {
    try {
      const response = await api.post<LaravelResource<Phone>>("/phones", phoneData);
      return normalizeResource(response.data, "Telefone criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar telefone:", error);
      return {
        success: false,
        message: "Erro ao criar telefone",
      };
    }
  },

  // Atualizar telefone
  async updatePhone(id: number, phoneData: Partial<PhoneFormData>): Promise<ApiResponse<Phone>> {
    try {
      const response = await api.put<LaravelResource<Phone>>(`/phones/${id}`, phoneData);
      return normalizeResource(response.data, "Telefone atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar telefone:", error);
      return {
        success: false,
        message: "Erro ao atualizar telefone",
      };
    }
  },

  // Deletar telefone
  async deletePhone(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/phones/${id}`);
      // Backend retorna 204 No Content (sem body)
      if (response.status === 204 || !response.data) {
        return {
          success: true,
          message: "Telefone excluído com sucesso",
        };
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar telefone:", error);
      return {
        success: false,
        message: "Erro ao deletar telefone",
      };
    }
  },
};

export const photoService = {
  // Listar fotos
  async getPhotos(): Promise<ApiResponse<Photo[]>> {
    try {
      const response = await api.get("/photos");
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Erro ao buscar fotos:", error);
      return {
        success: false,
        message: "Erro ao buscar fotos",
      };
    }
  },

  // Upload de foto (multipart/form-data)
  async uploadPhoto(file: File, locationId: number, altText?: string, order?: number): Promise<ApiResponse<Photo>> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("imageable_type", "App\\Models\\Location");
      formData.append("imageable_id", locationId.toString());
      if (altText) formData.append("alt_text", altText);
      if (order) formData.append("order", order.toString());

      const response = await api.post<LaravelResource<Photo>>("/photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return normalizeResource(response.data, "Foto enviada com sucesso");
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);

      // Se houver erros de validação específicos, mostrá-los
      const validationErrors = getValidationErrors(error);
      if (validationErrors) {
        const details = Object.entries(validationErrors)
          .map(
            ([field, messages]) =>
              `${field}: ${
                Array.isArray(messages) ? messages.join(", ") : messages
              }`
          )
          .join(" | ");
        console.error("Erros de validação no upload:", details);
      }

      return {
        success: false,
        message: getErrorMessage(error, "Erro ao fazer upload da foto"),
      };
    }
  },

  // Criar foto (mantido para compatibilidade - via URL)
  async createPhoto(photoData: PhotoFormData): Promise<ApiResponse<Photo>> {
    try {
      const response = await api.post<LaravelResource<Photo>>("/photos", photoData);
      return normalizeResource(response.data, "Foto criada com sucesso");
    } catch (error) {
      console.error("Erro ao criar foto:", error);
      return {
        success: false,
        message: "Erro ao criar foto",
      };
    }
  },

  // Atualizar foto
  async updatePhoto(id: number, photoData: Partial<PhotoFormData>): Promise<ApiResponse<Photo>> {
    try {
      const response = await api.put<LaravelResource<Photo>>(`/photos/${id}`, photoData);
      return normalizeResource(response.data, "Foto atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar foto:", error);
      return {
        success: false,
        message: "Erro ao atualizar foto",
      };
    }
  },

  // Deletar foto
  async deletePhoto(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/photos/${id}`);
      // Backend retorna 204 No Content (sem body)
      if (response.status === 204 || !response.data) {
        return {
          success: true,
          message: "Foto excluída com sucesso",
        };
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar foto:", error);
      return {
        success: false,
        message: "Erro ao deletar foto",
      };
    }
  },
};

// Serviço de notícias
export const newsService = {
  async getAll(): Promise<ApiResponse<News[]>> {
    try {
      const response = await api.get<{ message: string; data: News[] }>("/news");
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      return {
        success: false,
        message: "Erro ao buscar notícias",
      };
    }
  },

  async getById(id: number): Promise<ApiResponse<News>> {
    try {
      const response = await api.get<{ message: string; data: News }>(`/news/${id}`);
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Erro ao buscar notícia:", error);
      return {
        success: false,
        message: "Erro ao buscar notícia",
      };
    }
  },

  async create(formData: NewsFormData): Promise<ApiResponse<News>> {
    try {
      const response = await api.post<{ message: string; data: News }>("/news", formData);
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Erro ao criar notícia:", error);
      return {
        success: false,
        message: "Erro ao criar notícia",
      };
    }
  },

  async update(id: number, formData: Partial<NewsFormData>): Promise<ApiResponse<News>> {
    try {
      const response = await api.put<{ message: string; data: News }>(`/news/${id}`, formData);
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      return {
        success: false,
        message: "Erro ao atualizar notícia",
      };
    }
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/news/${id}`);
      // Laravel retorna 204 No Content em caso de sucesso
      if (response.status === 204) {
        return {
          success: true,
          message: "Notícia deletada com sucesso",
        };
      }
      return {
        success: true,
        message: "Notícia deletada com sucesso",
      };
    } catch (error) {
      console.error("Erro ao deletar notícia:", error);
      return {
        success: false,
        message: "Erro ao deletar notícia",
      };
    }
  },

  async scrapePortal(): Promise<ApiResponse<ScrapeResponse['data']>> {
    try {
      const response = await api.post<ScrapeResponse>("/news/scrape");
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Erro ao sincronizar as notícias:", error);
      return {
        success: false,
        message: "Erro ao fazer scraping do portal",
      };
    }
  },
};
