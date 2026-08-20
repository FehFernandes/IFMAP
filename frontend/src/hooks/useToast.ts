import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";
import type { ToastContextType } from "../contexts/ToastContext";

/**
 * Acessa o contexto de notificações (toasts).
 *
 * @throws Erro caso seja usado fora de um `<ToastProvider>`.
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }

  return context;
};
