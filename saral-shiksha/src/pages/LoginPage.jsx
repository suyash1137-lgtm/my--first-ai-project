// src/pages/LoginPage.jsx
// Phase 3: Real student login with mock credential check.
// On success: opens saralShiksha_session and redirects to /dashboard.
// On failure: shows "invalid credentials" error (no hint which field is wrong,
//             for security — matching real-world login UX).

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogIn, Eye, EyeOff } from "lucide-react";
import FormField from "../components/forms/FormField";
import { getStudentUser, openStudentSession } from "../utils/auth";

/* ── Validation ───────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields) {
  const errors = {};
  if (!fields.email.trim())
    errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(fields.email.trim()))
    errors.email = "Enter a valid email address.";

  if (!fields.password)
    errors.password = "Password is required.";

  return errors;
}

/* ── Component ────────────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();

  const [fields, setFields]         = useState({ email: "", password: "" });
  const [errors, setErrors]         = useState({});
  const [showPass, setShowPass]     = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handle = (key) => (e) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalError("");

    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    setSubmitting(true);
    setTimeout(() => {
      const stored = getStudentUser();

      // No account at all, or credentials don't match
      if (
        !stored ||
        stored.email.toLowerCase() !== fields.email.trim().toLowerCase() ||
        stored.password !== fields.password
      ) {
        setGlobalError(
          "Invalid email or password. Please check your details or sign up for a new account."
        );
        setSubmitting(false);
        return;
      }

      openStudentSession(stored.email);
      navigate("/dashboard");
    }, 400);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10">

          {/* Brand mark */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow mb-4">
              <BookOpen className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 text-center">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Sign in to continue your learning journey.
            </p>
          </div>

          {/* Global error */}
          {globalError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-xl"
            >
              <span aria-hidden="true" className="mt-0.5 flex-shrink-0">⚠</span>
              {globalError}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Student login form"
            className="flex flex-col gap-5"
          >
            <FormField
              id="email"
              label="Email Address"
              type="email"
              value={fields.email}
              onChange={handle("email")}
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email}
              required
            />

            {/* Password with show/hide */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                {/* Forgot password — non-functional placeholder for now */}
                <span className="text-xs text-gray-400 italic">
                  (Forgot password coming later)
                </span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={fields.password}
                  onChange={handle("password")}
                  autoComplete="current-password"
                  placeholder="Your password"
                  required
                  aria-required="true"
                  aria-describedby={errors.password ? "password-error" : undefined}
                  aria-invalid={errors.password ? "true" : "false"}
                  className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-gray-900 bg-white placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                    errors.password
                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  {showPass
                    ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                    : <Eye className="w-4 h-4" aria-hidden="true" />
                  }
                </button>
              </div>
              {errors.password && (
                <p id="password-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-0.5">
                  <span aria-hidden="true">⚠</span>{errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 px-6 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 mt-1"
            >
              {submitting ? (
                "Signing in…"
              ) : (
                <>
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              Sign up free
            </Link>
          </div>

          <div className="mt-2 text-center">
            <Link
              to="/teacher/login"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Are you a teacher? Teacher login →
            </Link>
          </div>

          {/* Demo hint */}
          <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-xs text-indigo-700 leading-relaxed text-center">
            <span className="font-semibold">New here?</span> Sign up first, then log in with those credentials.
          </div>
        </div>
      </div>
    </div>
  );
}
