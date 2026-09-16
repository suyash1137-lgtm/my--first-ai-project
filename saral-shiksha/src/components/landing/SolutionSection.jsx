// src/components/landing/SolutionSection.jsx
import { CheckCircle, Layers, UserCog } from "lucide-react";

const pillars = [
  {
    icon: <UserCog className="w-6 h-6 text-green-600" aria-hidden="true" />,
    iconBg: "bg-green-100",
    title: "Accessibility Profile",
    description:
      "Every student builds a one-time profile — font size, contrast, captions, read-aloud, simple language. The platform remembers and applies it everywhere, instantly.",
  },
  {
    icon: <Layers className="w-6 h-6 text-indigo-600" aria-hidden="true" />,
    iconBg: "bg-indigo-100",
    title: "Adaptive Interface",
    description:
      "The UI itself morphs — larger controls, high-contrast colours, reduced motion — based on the student's profile. No extra plugins, no manual settings per page.",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-yellow-600" aria-hidden="true" />,
    iconBg: "bg-yellow-100",
    title: "Adaptive Content",
    description:
      "Lessons are rewritten in simple language when needed, broken into small sections, paired with captions and transcripts, and read aloud on demand.",
  },
];

export default function SolutionSection() {
  return (
    <section className="bg-white py-20 px-4" aria-labelledby="solution-heading">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-widest text-green-600">
            Our Solution
          </span>
        </div>

        <h2
          id="solution-heading"
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 max-w-2xl mb-4 leading-tight"
        >
          One platform.{" "}
          <span className="text-green-600">Infinitely personalised.</span>
        </h2>
        <p className="text-gray-500 max-w-2xl text-base sm:text-lg mb-12 leading-relaxed">
          Saral Shiksha combines an Accessibility Profile with an adaptive
          interface and adaptive content — so every lesson works for every
          student, automatically.
        </p>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon, iconBg, title, description }, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-7 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                {icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
