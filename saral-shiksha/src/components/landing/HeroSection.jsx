// src/components/landing/HeroSection.jsx
import { Link } from "react-router-dom";
import { ArrowRight, Settings, LayoutDashboard, BookOpen } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative bg-indigo-900 overflow-hidden"
      aria-label="Hero"
    >
      {/* Subtle geometric background shapes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-700 rounded-full opacity-30" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 bg-indigo-800 rounded-full opacity-40" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-yellow-400 rounded-full opacity-5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-800 border border-indigo-600 text-yellow-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            Accessible · Personalised · Inclusive
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Saral{" "}
            <span className="text-yellow-300">Shiksha</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl font-semibold text-indigo-200 mb-4">
            Learning that adapts to every student.
          </p>

          {/* Supporting text */}
          <p className="text-base sm:text-lg text-indigo-300 max-w-2xl leading-relaxed mb-10">
            An accessible, personalised learning platform that adapts lessons
            according to every student's learning and accessibility needs —
            whether they face visual, hearing, or cognitive challenges. Every
            learner deserves an education that works for <em>them</em>.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/accessibility"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-7 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-yellow-900/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
              Start Learning
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-indigo-400 hover:border-white text-indigo-200 hover:text-white font-bold px-7 py-3.5 rounded-xl text-base transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
              Explore Platform
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-indigo-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full" aria-hidden="true" />
              Visual Support
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-400 rounded-full" aria-hidden="true" />
              Hearing Support
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-yellow-400 rounded-full" aria-hidden="true" />
              Cognitive Support
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-pink-400 rounded-full" aria-hidden="true" />
              Teacher Analytics
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
