// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <SearchX className="w-16 h-16 text-gray-400 mb-4" aria-hidden="true" />
      <h1 className="text-5xl font-extrabold text-gray-800 mb-2">404</h1>
      <p className="text-lg text-gray-500 mb-6">
        Oops! This page doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
