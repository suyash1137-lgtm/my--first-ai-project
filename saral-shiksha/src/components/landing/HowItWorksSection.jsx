// src/components/landing/HowItWorksSection.jsx
import { UserPlus, SlidersHorizontal, GraduationCap, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <UserPlus className="w-7 h-7 text-indigo-600" aria-hidden="true" />,
    title: "Sign Up",
    description:
      "Create a free student account in under 60 seconds. No credit card, no barriers.",
  },
  {
    step: "02",
    icon: <SlidersHorizontal className="w-7 h-7 text-green-600" aria-hidden="true" />,
    title: "Set Your Preferences",
    description:
      "Tell us how you learn best. Font size, contrast, captions, simple language — one profile, applied everywhere.",
  },
  {
    step: "03",
    icon: <GraduationCap className="w-7 h-7 text-yellow-600" aria-hidden="true" />,
    title: "Learn Your Way",
    description:
      "Dive into courses that automatically adapt to your profile. Every lesson, quiz, and explanation works for you.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      className="bg-white py-20 px-4"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            How It Works
          </span>
        </div>

        <h2
          id="how-it-works-heading"
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight"
        >
          Three steps to accessible learning.
        </h2>
        <p className="text-gray-500 max-w-2xl text-base sm:text-lg mb-14 leading-relaxed">
          Getting started takes less than 2 minutes. No technical knowledge required.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map(({ step, icon, title, description }, i) => (
            <div key={step} className="relative flex flex-col gap-4">
              {/* Connector arrow — desktop only, between cards */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-8 -right-4 z-10 items-center justify-center w-8">
                  <ArrowRight className="w-5 h-5 text-gray-300" aria-hidden="true" />
                </div>
              )}

              {/* Step number + icon */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-gray-300 tracking-widest mb-1">
                    STEP {step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center shadow-sm">
                    {icon}
                  </div>
                </div>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
