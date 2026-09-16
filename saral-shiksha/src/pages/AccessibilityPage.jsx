// src/pages/AccessibilityPage.jsx
// Phase 1: Shows current accessibility settings and allows toggling them.
// Fully wired to AccessibilityContext — not a placeholder!

import { useAccessibility } from "../context/AccessibilityContext";
import {
  Eye,
  Volume2,
  Captions,
  Brain,
  Zap,
  Type,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

function Toggle({ label, description, icon: Icon, checked, onChange }) {
  return (
    <label className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors">
      <div className="mt-1 text-indigo-500">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={label}
        />
        <div
          className={`w-11 h-6 rounded-full relative transition-colors ${
            checked ? "bg-indigo-600" : "bg-gray-300"
          }`}
          role="switch"
          aria-checked={checked}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              checked ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </div>
      </div>
    </label>
  );
}

export default function AccessibilityPage() {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Accessibility Settings
        </h1>
        <p className="text-gray-500">
          Personalise your learning experience. All settings are saved
          automatically.
        </p>
        <code className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
          Route: /accessibility
        </code>
      </div>

      {/* Font size selector */}
      <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <Type className="w-5 h-5 text-indigo-500" aria-hidden="true" />
          <p className="font-semibold text-gray-800">Font Size</p>
        </div>
        <div className="flex gap-3">
          {["normal", "large"].map((size) => (
            <button
              key={size}
              onClick={() => updateSetting({ fontSize: size })}
              className={`px-5 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                settings.fontSize === size
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
              }`}
              aria-pressed={settings.fontSize === size}
            >
              {size === "normal" ? "Normal" : "Large (125%)"}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 mb-6">
        <Toggle
          label="High Contrast"
          description="Increases visual contrast for easier reading."
          icon={Eye}
          checked={settings.highContrast}
          onChange={(v) => updateSetting({ highContrast: v })}
        />
        <Toggle
          label="Read Aloud"
          description="Enables text-to-speech for lessons and instructions."
          icon={Volume2}
          checked={settings.readAloud}
          onChange={(v) => updateSetting({ readAloud: v })}
        />
        <Toggle
          label="Captions"
          description="Shows captions for all audio and video content."
          icon={Captions}
          checked={settings.captions}
          onChange={(v) => updateSetting({ captions: v })}
        />
        <Toggle
          label="Simple Language"
          description="Rewrites instructions in plain, easy-to-understand language."
          icon={Brain}
          checked={settings.simpleLanguage}
          onChange={(v) => updateSetting({ simpleLanguage: v })}
        />
        <Toggle
          label="Reduced Motion"
          description="Removes animations and transitions across the platform."
          icon={Zap}
          checked={settings.reducedMotion}
          onChange={(v) => updateSetting({ reducedMotion: v })}
        />
      </div>

      {/* Saved indicator + reset */}
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle className="w-4 h-4" aria-hidden="true" />
          Settings are saved automatically to your browser.
        </div>
        <button
          onClick={resetSettings}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Reset defaults
        </button>
      </div>
    </div>
    </div>
  );
}
