// src/layouts/TeacherLayout.jsx
// Wraps all teacher-facing pages with a dedicated sidebar/navbar.

import { Outlet, NavLink, Link } from "react-router-dom";
import { GraduationCap, LayoutDashboard, Users, PlusCircle, LogIn } from "lucide-react";

const teacherLinks = [
  { to: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/course/create", label: "Create Course", icon: PlusCircle },
  { to: "/teacher/students", label: "Students", icon: Users },
];

export default function TeacherLayout() {
  const linkBase =
    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeClass = "bg-emerald-700 text-white";
  const inactiveClass = "text-emerald-100 hover:bg-emerald-600 hover:text-white";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Teacher top bar */}
      <nav className="bg-emerald-800 shadow-lg" aria-label="Teacher navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/teacher/dashboard" className="flex items-center gap-2 text-white font-bold text-xl">
              <GraduationCap className="w-6 h-6 text-yellow-300" aria-hidden="true" />
              <span>Saral <span className="text-yellow-300">Shiksha</span> — Teacher</span>
            </Link>
            <div className="flex items-center gap-1">
              {teacherLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `${linkBase} hidden md:flex ${isActive ? activeClass : inactiveClass}`
                  }
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
              <NavLink
                to="/teacher/login"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : inactiveClass} border border-emerald-500 ml-3`
                }
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Login
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-emerald-900 text-emerald-300 text-center text-xs py-3">
        © 2025 Saral Shiksha — Teacher Portal
      </footer>
    </div>
  );
}
