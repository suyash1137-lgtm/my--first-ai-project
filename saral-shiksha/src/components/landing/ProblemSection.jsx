// src/components/landing/ProblemSection.jsx
import { AlertTriangle } from "lucide-react";

const problems = [
  {
    emoji: "🔡",
    text: "Text too small to read comfortably",
  },
  {
    emoji: "🌑",
    text: "Low contrast — hard to distinguish for visually impaired students",
  },
  {
    emoji: "🔇",
    text: "Audio-only content with no visual alternative",
  },
  {
    emoji: "🎬",
    text: "Videos without captions — inaccessible to deaf learners",
  },
  {
    emoji: "📜",
    text: "Complicated language and dense, long paragraphs",
  },
  {
    emoji: "🧠",
    text: "Information overload with no step-by-step structure",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-gray-50 py-20 px-4" aria-labelledby="problem-heading">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-widest text-red-500">
            The Problem
          </span>
        </div>

        <h2
          id="problem-heading"
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 max-w-2xl mb-4 leading-tight"
        >
          Most platforms give{" "}
          <span className="text-red-500">everyone the same experience.</span>
        </h2>
        <p className="text-gray-500 max-w-2xl text-base sm:text-lg mb-12 leading-relaxed">
          But students aren't the same. Learning differences, disabilities, and
          accessibility needs are common — and almost universally ignored by
          mainstream educational platforms.
        </p>

        {/* Problem grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map(({ emoji, text }, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white border border-red-100 rounded-xl p-5 shadow-sm"
            >
              <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
                {emoji}
              </span>
              <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Bridge statement */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-2xl px-8 py-6 text-center">
          <p className="text-red-800 font-semibold text-base sm:text-lg">
            The result? Students disengage, fall behind, and lose confidence — not
            because they can't learn, but because the platform can't teach{" "}
            <em>them</em>.
          </p>
        </div>
      </div>
    </section>
  );
}
