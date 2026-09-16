// src/components/PlaceholderPage.jsx
// Generic placeholder used by every route in Phase 1.
// Replace/remove in later phases as real content is built.

import { Construction } from "lucide-react";

/**
 * @param {object} props
 * @param {string}  props.title       - Page title displayed prominently
 * @param {string}  props.route       - The URL route of this page
 * @param {string}  [props.subtitle]  - Optional extra description
 */
export default function PlaceholderPage({ title, route, subtitle }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Construction
          className="w-16 h-16 text-indigo-400 mb-4"
          aria-hidden="true"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <code className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full mb-4">
          {route}
        </code>
        {subtitle && (
          <p className="text-gray-500 max-w-md text-sm">{subtitle}</p>
        )}
        <p className="mt-6 text-xs text-gray-400 italic">
          Full content coming in a later phase — Phase 1 scaffold only.
        </p>
      </div>
    </div>
  );
}
