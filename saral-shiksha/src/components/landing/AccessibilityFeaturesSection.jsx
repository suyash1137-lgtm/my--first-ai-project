// src/components/landing/AccessibilityFeaturesSection.jsx
import { Eye, Ear, Brain } from "lucide-react";
import FeatureCard from "../FeatureCard";

const features = [
  {
    icon: <Eye className="w-6 h-6 text-blue-600" aria-hidden="true" />,
    iconBg: "bg-blue-100",
    accentColor: "text-blue-500",
    title: "Visual Support",
    items: [
      "Larger text — adjustable font size up to 125%",
      "High contrast mode — strong foreground/background separation",
      "Read aloud — every lesson and instruction narrated via text-to-speech",
      "Screen-reader-friendly markup throughout",
    ],
  },
  {
    icon: <Ear className="w-6 h-6 text-purple-600" aria-hidden="true" />,
    iconBg: "bg-purple-100",
    accentColor: "text-purple-500",
    title: "Hearing Support",
    items: [
      "Captions on all video and audio content",
      "Full transcripts available for every lesson",
      "Text-based explanations as primary content — no audio dependency",
      "Visual cues replace audio alerts",
    ],
  },
  {
    icon: <Brain className="w-6 h-6 text-orange-600" aria-hidden="true" />,
    iconBg: "bg-orange-100",
    accentColor: "text-orange-500",
    title: "Cognitive Support",
    items: [
      "Simple language mode — complex sentences rewritten for clarity",
      "Short sections — content chunked into digestible pieces",
      "Step-by-step learning — one concept at a time, never overwhelmed",
      "Reduced motion — animations removed for distraction-free focus",
    ],
  },
];

export default function AccessibilityFeaturesSection() {
  return (
    <section
      className="bg-gray-50 py-20 px-4"
      aria-labelledby="a11y-features-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            ♿ Accessibility Features
          </span>
        </div>

        <h2
          id="a11y-features-heading"
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 max-w-2xl mb-4 leading-tight"
        >
          Built for every type of learner.
        </h2>
        <p className="text-gray-500 max-w-2xl text-base sm:text-lg mb-12 leading-relaxed">
          Three dedicated accessibility pillars — visual, hearing, and cognitive —
          each with real, working features, not just checkbox compliance.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
