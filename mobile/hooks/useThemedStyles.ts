import { useTheme } from "../context/ThemeContext";
import { useAccessibility } from "../context/AccessibilityContext";

/**
 * Hook customizado que combina tema e acessibilidade
 * Retorna cores ajustadas para alto contraste e função de tamanho de fonte
 */
export const useThemedStyles = () => {
  const { isDarkMode, colors: baseColors, getColors } = useTheme();
  const { settings, getFontSize } = useAccessibility();

  // Pega as cores considerando alto contraste
  const colors = getColors(settings.highContrast);

  return {
    colors,
    isDarkMode,
    getFontSize,
    settings,
  };
};
