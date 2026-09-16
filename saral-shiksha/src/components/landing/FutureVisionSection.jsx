// src/components/landing/FutureVisionSection.jsx
import { Sparkles, Globe, Hand, WifiOff } from "lucide-react";

const roadmap = [
  {
    icon: <Sparkles className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
    iconBg: "bg-yellow-50 border-yellow-200",
    label: "Coming Next",
    title: "AI Personalisation",
    description:
      "An AI tutor that reads each student's pace, struggles, and strengths — and adapts content in real time, not just on first setup.",
  },
  {
    icon: <Globe className="w-6 h-6 text-blue-500" aria-hidden="true" />,
    iconBg: "bg-blue-50 border-blue-200",
    label: "Planned",
    title: "Multiple Indian Languages",
    description:
      "Full support for Hindi, Tamil, Telugu, Marathi, Bengali, and more — so language is never a barrier to learning.",
  },
  {
    icon: <Hand className="w-6 h-6 text-purple-500" aria-hidden="true" />,
    iconBg: "bg-purple-50 border-purple-200",
    label: "Planned",
    title: "Sign Language Support",
    description:
      "Integrated ISL (Indian Sign Language) video explanations alongside every lesson for deaf and hard-of-hearing students.",
  },
  {
    icon: <WifiOff className="w-6 h-6 text-green-600" aria-hidden="true" />,
    iconBg: "bg-green-50 border-green-200",
    label: "Future",
    title: "Offline Learning",
    description:
      "Download lessons for areas with poor connectivity. Saral Shiksha works in Tier 2 cities, villages, and everywhere in between.",
  },
];

export default function FutureVisionSection() {
  return (
    <section
      className="bg-indigo-900 py-20 px-4"
      aria-labelledby="future-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-yellow-400" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Future Vision
          </span>
        </div>

        <h2
          id="future-heading"
          className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight"
        >
          This is just the beginning.
        </h2>
        <p className="text-indigo-300 max-w-2xl text-base sm:text-lg mb-12 leading-relaxed">
          Our roadmap is built around one question:{" "}
          <em className="text-indigo-200">
            what does it take for every student in India to have a truly accessible education?
          </em>
        </p>

        {/* Roadmap cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {roadmap.map(({ icon, iconBg, label, title, description }, i) => (
            <div
              key={i}
              className="bg-indigo-800 rounded-2xl border border-indigo-700 p-6 flex flex-col gap-3 hover:bg-indigo-700 transition-colors"
            >
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl border ${iconBg} flex items-center justify-center`}
              >
                {icon}
              </div>

              {/* Label pill */}
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                {label}
              </span>

              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-indigo-300 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
