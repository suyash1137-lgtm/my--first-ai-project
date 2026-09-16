// src/context/AccessibilityContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "saral_shiksha_accessibility";

const defaultSettings = {
  fontSize: "normal",       // "normal" | "large"
  highContrast: false,
  readAloud: false,
  captions: false,
  simpleLanguage: false,
  reducedMotion: false,
};

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply accessibility classes to the root <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("high-contrast", settings.highContrast);
    root.classList.toggle("reduced-motion", settings.reducedMotion);
    root.classList.remove("font-normal-size", "font-large-size");
    root.classList.add(settings.fontSize === "large" ? "font-large-size" : "font-normal-size");
  }, [settings.highContrast, settings.reducedMotion, settings.fontSize]);

  /**
   * Update one or more settings keys.
   * @param {Partial<typeof defaultSettings>} patch
   */
  const updateSetting = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const resetSettings = () => setSettings(defaultSettings);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

/**
 * Hook to consume AccessibilityContext.
 * Must be used inside <AccessibilityProvider>.
 */
export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return ctx;
}

export default AccessibilityContext;
