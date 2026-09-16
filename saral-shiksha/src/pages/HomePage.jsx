// src/pages/HomePage.jsx
// Phase 2: Full landing page — assembles all landing section components.
// Sections: Hero → Problem → Solution → A11y Features → How It Works
//           → For Students → For Teachers → Future Vision → Footer

import HeroSection from "../components/landing/HeroSection";
import ProblemSection from "../components/landing/ProblemSection";
import SolutionSection from "../components/landing/SolutionSection";
import AccessibilityFeaturesSection from "../components/landing/AccessibilityFeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ForStudentsSection from "../components/landing/ForStudentsSection";
import ForTeachersSection from "../components/landing/ForTeachersSection";
import FutureVisionSection from "../components/landing/FutureVisionSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function HomePage() {
  return (
    // The outer div takes full width (MainLayout <main> is now unconstrained).
    // Each section controls its own max-width and bg colour for full-bleed designs.
    <div className="flex flex-col w-full">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <AccessibilityFeaturesSection />
      <HowItWorksSection />
      <ForStudentsSection />
      <ForTeachersSection />
      <FutureVisionSection />
      <LandingFooter />
    </div>
  );
}
