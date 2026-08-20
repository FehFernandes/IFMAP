import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import { ToastProvider } from "./contexts/ToastProvider";
import ToastContainer from "./components/ToastContainer";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-gray-600 text-base flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          Carregando...
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-gray-600 text-base flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          Carregando...
        </div>
      </div>
    );
  }

  return !isAuthenticated ? (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ToastContainer />
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
