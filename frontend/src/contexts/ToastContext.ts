import { createContext } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

/**
 * Contexto de notificações. Consuma através do hook `useToast`
 * e forneça o valor através de `<ToastProvider>`.
 */
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
