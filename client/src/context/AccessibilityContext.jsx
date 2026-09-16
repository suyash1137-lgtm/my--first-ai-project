import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const AccessibilityContext = createContext(null);

const DEFAULT_SETTINGS = {
  profileType: 'general',
  fontSize: 'normal',       // 'normal' | 'large' | 'xlarge'
  contrast: 'standard',     // 'standard' | 'high-contrast' | 'dyslexia-friendly' | 'dark'
  ttsSpeed: 1.0,
  ttsVoice: 'default',
  ttsAutoPlay: false,
  captionsEnabled: false,
  simplifyLanguage: false,
  focusMode: false,
  soundEffects: true
};

// Apply settings to the <html> element as data-attributes and classes
const applySettingsToDOM = (settings) => {
  const root = document.documentElement;
  root.setAttribute('data-font-size', settings.fontSize || 'normal');
  root.setAttribute('data-contrast', settings.contrast || 'standard');
};

export const AccessibilityProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const saveTimeoutRef = useRef(null);

  // Load settings from DB on login
  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/profile')
      .then((res) => {
        if (res.data.profile) {
          const loaded = { ...DEFAULT_SETTINGS, ...res.data.profile };
          setSettings(loaded);
          applySettingsToDOM(loaded);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  // Apply DOM changes whenever settings update
  useEffect(() => {
    applySettingsToDOM(settings);
  }, [settings.fontSize, settings.contrast]);

  // Debounced save to backend
  const persistSettings = useCallback((newSettings) => {
    if (!isAuthenticated) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await api.put('/profile', newSettings);
      } catch {
        // silent fail — settings applied locally regardless
      } finally {
        setSaving(false);
      }
    }, 700);
  }, [isAuthenticated]);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      persistSettings(next);
      return next;
    });
  }, [persistSettings]);

  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => {
      const next = { ...prev, ...newSettings };
      persistSettings(next);
      return next;
    });
  }, [persistSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    persistSettings(DEFAULT_SETTINGS);
  }, [persistSettings]);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, updateSettings, resetSettings, saving }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used inside AccessibilityProvider');
  return ctx;
};
