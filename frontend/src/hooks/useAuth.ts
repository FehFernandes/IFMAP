import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthContextType } from "../contexts/AuthContext";

/**
 * Acessa o contexto de autenticação.
 *
 * @throws Erro caso seja usado fora de um `<AuthProvider>`.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
