import { createContext } from "react";
import type { User, LoginCredentials, AuthResponse } from "../types";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
}

/**
 * Contexto de autenticação. Consuma através do hook `useAuth`
 * e forneça o valor através de `<AuthProvider>`.
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
