// src/App.jsx
// Central router configuration for SARAL SHIKSHA.
// Phase 1: All routes defined, placeholder pages wired up.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "./context/AccessibilityContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import TeacherLayout from "./layouts/TeacherLayout";

// Student pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import LessonPage from "./pages/LessonPage";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/ProgressPage";
import NotFoundPage from "./pages/NotFoundPage";

// Teacher pages
import TeacherLoginPage from "./pages/teacher/TeacherLoginPage";
import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import CreateCoursePage from "./pages/teacher/CreateCoursePage";
import StudentsPage from "./pages/teacher/StudentsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <Routes>
          {/* ── Student routes (inside MainLayout with Navbar) ── */}
          <Route element={<MainLayout />}>
            <Route path="/"              element={<HomePage />} />
            <Route path="/login"         element={<LoginPage />} />
            <Route path="/signup"        element={<SignupPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/dashboard"     element={<DashboardPage />} />
            <Route path="/courses"       element={<CoursesPage />} />
            <Route path="/lesson/:id"    element={<LessonPage />} />
            <Route path="/quiz/:id"      element={<QuizPage />} />
            <Route path="/progress"      element={<ProgressPage />} />
          </Route>

          {/* ── Teacher routes (inside TeacherLayout) ── */}
          <Route element={<TeacherLayout />}>
            <Route path="/teacher/login"           element={<TeacherLoginPage />} />
            <Route path="/teacher/dashboard"       element={<TeacherDashboardPage />} />
            <Route path="/teacher/course/create"   element={<CreateCoursePage />} />
            <Route path="/teacher/students"        element={<StudentsPage />} />
          </Route>

          {/* ── 404 catch-all ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AccessibilityProvider>
    </BrowserRouter>
  );
}
