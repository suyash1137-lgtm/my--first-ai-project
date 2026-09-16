// src/components/landing/ForStudentsSection.jsx
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  TrendingUp,
  Headphones,
  Languages,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: <LayoutGrid className="w-5 h-5 text-indigo-500" aria-hidden="true" />,
    text: "A personalised dashboard that shows your progress at a glance",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />,
    text: "Quizzes designed to test understanding — not memory under pressure",
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-blue-500" aria-hidden="true" />,
    text: "Visual progress tracking for every course",
  },
  {
    icon: <Headphones className="w-5 h-5 text-purple-500" aria-hidden="true" />,
    text: "Read-aloud and captions for every lesson, on demand",
  },
  {
    icon: <Languages className="w-5 h-5 text-yellow-600" aria-hidden="true" />,
    text: "Simple language mode — no more jargon-heavy explanations",
  },
  {
    icon: <BookOpen className="w-5 h-5 text-orange-500" aria-hidden="true" />,
    text: "Courses structured in short, focused sections — not long lectures",
  },
];

export default function ForStudentsSection() {
  return (
    <section
      className="bg-indigo-50 py-20 px-4"
      aria-labelledby="for-students-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                For Students
              </span>
            </div>
            <h2
              id="for-students-heading"
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight"
            >
              Your learning,{" "}
              <span className="text-indigo-600">your rules.</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
              Saral Shiksha puts you in control. Set your preferences once — the
              platform handles the rest, so you can focus entirely on learning.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map(({ icon, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4"
              >
                <div className="flex-shrink-0 mt-0.5">{icon}</div>
                <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
