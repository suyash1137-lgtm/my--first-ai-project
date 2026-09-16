// src/pages/teacher/TeacherLoginPage.jsx
// Phase 3: Teacher login — separate from student auth.
// Mock teacher credentials: any email + password stored under saralShiksha_teacherUser.
// If no teacher account exists yet, shows a "first-time setup" path.
// On success: opens saralShiksha_teacherSession, redirects to /teacher/dashboard.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, LogIn, Eye, EyeOff, UserPlus } from "lucide-react";
import FormField from "../../components/forms/FormField";
import {
  getTeacherUser,
  saveTeacherUser,
  openTeacherSession,
} from "../../utils/auth";

/* ── Validation ───────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(fields) {
  const errors = {};
  if (!fields.email.trim())
    errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(fields.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!fields.password)
    errors.password = "Password is required.";
  return errors;
}

function validateSetup(fields) {
  const errors = {};
  if (!fields.name.trim())
    errors.name = "Full name is required.";
  if (!fields.email.trim())
    errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(fields.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!fields.password)
    errors.password = "Password is required.";
  else if (fields.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  return errors;
}

/* ── Component ────────────────────────────────────────────────── */
export default function TeacherLoginPage() {
  const navigate    = useNavigate();
  const storedTeacher = getTeacherUser();

  // If no teacher exists yet, show the first-time setup form
  const [mode, setMode] = useState(storedTeacher ? "login" : "setup");

  // Login form state
  const [loginFields, setLoginFields] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginGlobal, setLoginGlobal] = useState("");

  // Setup form state
  const [setupFields, setSetupFields] = useState({ name: "", email: "", password: "" });
  const [setupErrors, setSetupErrors] = useState({});

  const [showPass, setShowPass]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ─ Login handler ─ */
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginGlobal("");
    const errs = validateLogin(loginFields);
    if (Object.keys(errs).length > 0) { setLoginErrors(errs); return; }
    setLoginErrors({});
    setSubmitting(true);

    setTimeout(() => {
      const teacher = getTeacherUser();
      if (
        !teacher ||
        teacher.email.toLowerCase() !== loginFields.email.trim().toLowerCase() ||
        teacher.password !== loginFields.password
      ) {
        setLoginGlobal("Invalid email or password. Please check your credentials.");
        setSubmitting(false);
        return;
      }
      openTeacherSession(teacher.email);
      navigate("/teacher/dashboard");
    }, 400);
  };

  /* ─ First-time setup handler ─ */
  const handleSetup = (e) => {
    e.preventDefault();
    const errs = validateSetup(setupFields);
    if (Object.keys(errs).length > 0) { setSetupErrors(errs); return; }
    setSetupErrors({});
    setSubmitting(true);

    setTimeout(() => {
      saveTeacherUser({
        name: setupFields.name.trim(),
        email: setupFields.email.trim().toLowerCase(),
        password: setupFields.password,
      });
      openTeacherSession(setupFields.email.trim().toLowerCase());
      navigate("/teacher/dashboard");
    }, 400);
  };

  const handleL = (key) => (e) => setLoginFields((f) => ({ ...f, [key]: e.target.value }));
  const handleS = (key) => (e) => setSetupFields((f) => ({ ...f, [key]: e.target.value }));

  /* ─ Render ─ */
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh] flex items-center justify-center bg-emerald-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm px-8 py-10">

          {/* Brand mark — emerald teacher theme */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow mb-4">
              <GraduationCap className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 text-center">
              {mode === "login" ? "Teacher Sign In" : "Teacher Setup"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {mode === "login"
                ? "Access your teacher dashboard and manage your courses."
                : "Create your teacher account to get started."}
            </p>
          </div>

          {/* Mode toggle (only if a teacher account exists) */}
          {storedTeacher && (
            <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-6">
              {["login", "setup"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setLoginGlobal(""); }}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                    mode === m
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                  aria-pressed={mode === m}
                >
                  {m === "login" ? "Sign In" : "New Account"}
                </button>
              ))}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {mode === "login" && (
            <>
              {loginGlobal && (
                <div role="alert" className="mb-5 flex items-start gap-2 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <span aria-hidden="true" className="mt-0.5 flex-shrink-0">⚠</span>
                  {loginGlobal}
                </div>
              )}
              <form
                onSubmit={handleLogin}
                noValidate
                aria-label="Teacher login form"
                className="flex flex-col gap-5"
              >
                <FormField
                  id="teacher-email"
                  label="Email Address"
                  type="email"
                  value={loginFields.email}
                  onChange={handleL("email")}
                  autoComplete="email"
                  placeholder="teacher@school.edu"
                  error={loginErrors.email}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="teacher-password" className="text-sm font-semibold text-gray-700">
                    Password<span className="text-red-500 ml-1" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="teacher-password"
                      name="teacher-password"
                      type={showPass ? "text" : "password"}
                      value={loginFields.password}
                      onChange={handleL("password")}
                      autoComplete="current-password"
                      placeholder="Your password"
                      required
                      aria-required="true"
                      aria-describedby={loginErrors.password ? "tpass-error" : undefined}
                      aria-invalid={loginErrors.password ? "true" : "false"}
                      className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-gray-900 bg-white placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${
                        loginErrors.password
                          ? "border-red-400 focus:ring-red-400 bg-red-50"
                          : "border-gray-300 hover:border-emerald-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                    >
                      {showPass
                        ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                        : <Eye className="w-4 h-4" aria-hidden="true" />
                      }
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p id="tpass-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-0.5">
                      <span aria-hidden="true">⚠</span>{loginErrors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 px-6 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  {submitting ? "Signing in…" : (
                    <>
                      <LogIn className="w-4 h-4" aria-hidden="true" />
                      Sign In
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── SETUP FORM (first-time or switch) ── */}
          {mode === "setup" && (
            <form
              onSubmit={handleSetup}
              noValidate
              aria-label="Teacher account setup form"
              className="flex flex-col gap-5"
            >
              <FormField
                id="teacher-name"
                label="Full Name"
                type="text"
                value={setupFields.name}
                onChange={handleS("name")}
                autoComplete="name"
                placeholder="e.g. Mr. Arjun Patel"
                error={setupErrors.name}
                required
              />
              <FormField
                id="teacher-setup-email"
                label="Email Address"
                type="email"
                value={setupFields.email}
                onChange={handleS("email")}
                autoComplete="email"
                placeholder="teacher@school.edu"
                error={setupErrors.email}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="teacher-setup-pass" className="text-sm font-semibold text-gray-700">
                  Password<span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <input
                    id="teacher-setup-pass"
                    type={showPass ? "text" : "password"}
                    value={setupFields.password}
                    onChange={handleS("password")}
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    required
                    aria-required="true"
                    aria-describedby={setupErrors.password ? "spass-error" : undefined}
                    aria-invalid={setupErrors.password ? "true" : "false"}
                    className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-gray-900 bg-white placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${
                      setupErrors.password
                        ? "border-red-400 focus:ring-red-400 bg-red-50"
                        : "border-gray-300 hover:border-emerald-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                  >
                    {showPass
                      ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                      : <Eye className="w-4 h-4" aria-hidden="true" />
                    }
                  </button>
                </div>
                {setupErrors.password && (
                  <p id="spass-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-0.5">
                    <span aria-hidden="true">⚠</span>{setupErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 px-6 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {submitting ? "Setting up…" : (
                  <>
                    <UserPlus className="w-4 h-4" aria-hidden="true" />
                    Create Teacher Account
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Student account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline-offset-2 hover:underline"
            >
              Student login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
