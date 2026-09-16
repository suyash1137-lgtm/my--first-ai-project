// src/layouts/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  TrendingUp,
  GraduationCap,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAccessibility } from "../context/AccessibilityContext";

const navLinks = [
  { to: "/", label: "Home", icon: BookOpen },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: Library },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/teacher/dashboard", label: "Teacher", icon: GraduationCap },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useAccessibility();

  const linkBase =
    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeClass = "bg-indigo-700 text-white";
  const inactiveClass = "text-indigo-100 hover:bg-indigo-600 hover:text-white";

  return (
    <nav
      className="bg-indigo-800 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-bold text-xl tracking-tight"
          >
            <BookOpen className="w-6 h-6 text-yellow-300" aria-hidden="true" />
            <span>
              Saral <span className="text-yellow-300">Shiksha</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}

            {/* Accessibility shortcut */}
            <NavLink
              to="/accessibility"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeClass : inactiveClass} ml-3 border border-indigo-500`
              }
              aria-label="Accessibility settings"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">A11y</span>
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-indigo-100 hover:text-white p-2 rounded-md"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden bg-indigo-900 px-4 pb-4 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `${linkBase} w-full ${isActive ? activeClass : inactiveClass}`
              }
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/accessibility"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `${linkBase} w-full ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            Accessibility Settings
          </NavLink>
        </div>
      )}
    </nav>
  );
}
