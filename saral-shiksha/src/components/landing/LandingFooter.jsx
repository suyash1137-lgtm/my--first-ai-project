// src/components/landing/LandingFooter.jsx
import { Link } from "react-router-dom";
import { BookOpen, Heart } from "lucide-react";

const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "Home", to: "/" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Courses", to: "/courses" },
      { label: "Progress", to: "/progress" },
    ],
  },
  {
    heading: "Accessibility",
    links: [
      { label: "Settings", to: "/accessibility" },
      { label: "Visual Support", to: "/accessibility" },
      { label: "Hearing Support", to: "/accessibility" },
      { label: "Cognitive Support", to: "/accessibility" },
    ],
  },
  {
    heading: "Teachers",
    links: [
      { label: "Teacher Login", to: "/teacher/login" },
      { label: "Dashboard", to: "/teacher/dashboard" },
      { label: "Create Course", to: "/teacher/course/create" },
      { label: "Students", to: "/teacher/students" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign Up", to: "/signup" },
      { label: "Login", to: "/login" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300" aria-label="Site footer">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold text-xl mb-4"
            >
              <BookOpen className="w-6 h-6 text-yellow-400" aria-hidden="true" />
              <span>
                Saral{" "}
                <span className="text-yellow-400">Shiksha</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Learning that adapts to every student. Accessible education for
              students with visual, hearing, and cognitive needs.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Saral Shiksha. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with{" "}
            <Heart className="w-3 h-3 text-red-400 inline" aria-hidden="true" />{" "}
            for inclusive education.
          </p>
        </div>
      </div>
    </footer>
  );
}
