import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { LoginCredentials, AuthResponse, User } from "../types";
import { authService } from "../services/api";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado ao inicializar
    const currentUser = authService.getCurrentUser();
    const isAuth = authService.isAuthenticated();

    if (isAuth && currentUser) {
      setUser(currentUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        setUser(response.data);
      }

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
