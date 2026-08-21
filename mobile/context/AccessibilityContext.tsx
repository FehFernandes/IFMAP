import React, { createContext, useState, useContext, ReactNode } from "react";

export type FontSizeScale = "small" | "medium" | "large" | "extra-large";

interface AccessibilitySettings {
  // Tamanho de fonte
  fontSizeScale: FontSizeScale;

  // Alto contraste
  highContrast: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  getFontSize: (baseSize: number) => number;
}

const defaultSettings: AccessibilitySettings = {
  fontSizeScale: "medium",
  highContrast: false,
};

// Multiplicadores de tamanho de fonte
const fontScaleMultipliers: Record<FontSizeScale, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.15,
  "extra-large": 1.3,
};

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const AccessibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultSettings);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getFontSize = (baseSize: number): number => {
    const multiplier = fontScaleMultipliers[settings.fontSizeScale];
    return baseSize * multiplier;
  };

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSetting, getFontSize }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};
