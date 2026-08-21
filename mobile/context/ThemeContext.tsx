import React, { createContext, useState, useContext, ReactNode } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryLight: string;
    iconBackground: string;
    headerBackground: string;
    tabBar: string;
    error: string;
  };
  getColors: (highContrast: boolean) => typeof lightColors;
}

const lightColors = {
  background: "#f8f9fa",
  card: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#666666",
  border: "#f0f0f0",
  primary: "#2E7D32",
  primaryLight: "#E8F5E9",
  iconBackground: "#E8F5E9",
  headerBackground: "#ffffff",
  tabBar: "#ffffff",
  error: "#C62828",
};

const darkColors = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  border: "#2A2A2A",
  primary: "#81C784",
  primaryLight: "#1B3A1F",
  iconBackground: "#1B3A1F",
  headerBackground: "#1E1E1E",
  tabBar: "#1E1E1E",
  error: "#EF5350",
};

// Cores de alto contraste (light)
const highContrastLightColors = {
  background: "#FFFFFF",
  card: "#FFFFFF",
  text: "#000000",
  textSecondary: "#000000",
  border: "#000000",
  primary: "#006400", // Verde escuro
  primaryLight: "#C8E6C9",
  iconBackground: "#C8E6C9",
  headerBackground: "#FFFFFF",
  tabBar: "#FFFFFF",
  error: "#8B0000", // Vermelho escuro
};

// Cores de alto contraste (dark)
const highContrastDarkColors = {
  background: "#000000",
  card: "#0A0A0A",
  text: "#FFFFFF",
  textSecondary: "#FFFFFF",
  border: "#FFFFFF",
  primary: "#00FF00", // Verde brilhante
  primaryLight: "#003300",
  iconBackground: "#003300",
  headerBackground: "#0A0A0A",
  tabBar: "#0A0A0A",
  error: "#FF6B6B", // Vermelho claro brilhante
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  const getColors = (highContrast: boolean) => {
    if (highContrast) {
      return isDarkMode ? highContrastDarkColors : highContrastLightColors;
    }
    return isDarkMode ? darkColors : lightColors;
  };

  const colors = getColors(false); // Padrão sem alto contraste

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleTheme, colors, getColors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
