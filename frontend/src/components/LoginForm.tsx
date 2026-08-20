import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../types";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login(credentials);

      if (response.success) {
        onLoginSuccess?.();
        navigate("/dashboard");
      } else {
        setError(response.message || "Erro ao fazer login");
      }
    } catch {
      setError("Erro de conexão com o servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <div className="text-center mb-8">
        <div className="mx-auto mb-6 w-62 h-24 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-55 h-55 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao IFMap</h1>
        <p className="text-gray-600 text-sm">
          Entre com suas credenciais para acessar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-white font-medium text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70"
          style={{
            backgroundColor: "#15ce7b",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#12b86a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#15ce7b")
          }
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Entrando...
            </div>
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
