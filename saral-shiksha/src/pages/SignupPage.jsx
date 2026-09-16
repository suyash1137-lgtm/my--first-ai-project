// src/pages/SignupPage.jsx
// Phase 3: Real student sign-up with client-side validation.
// On success: saves user to localStorage (saralShiksha_user)
//             opens a session (saralShiksha_session)
//             redirects to /dashboard

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, UserPlus, ArrowRight, Eye, EyeOff } from "lucide-react";
import FormField from "../components/forms/FormField";
import { saveStudentUser, openStudentSession, getStudentUser } from "../utils/auth";

/* ── Validation helpers ───────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields) {
  const errors = {};

  if (!fields.name.trim())
    errors.name = "Full name is required.";
  else if (fields.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";

  if (!fields.email.trim())
    errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(fields.email.trim()))
    errors.email = "Enter a valid email address (e.g. you@example.com).";

  if (!fields.password)
    errors.password = "Password is required.";
  else if (fields.password.length < 8)
    errors.password = "Password must be at least 8 characters.";

  if (!fields.confirmPassword)
    errors.confirmPassword = "Please confirm your password.";
  else if (fields.password !== fields.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";

  return errors;
}

/* ── Component ────────────────────────────────────────────────── */
export default function SignupPage() {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors]         = useState({});
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

    // Check: email already registered?
    const existing = getStudentUser();
    if (existing && existing.email.toLowerCase() === fields.email.trim().toLowerCase()) {
      setGlobalError("An account with this email already exists. Please log in.");
      return;
    }

    setSubmitting(true);
    // Simulate a tiny async save (no real network)
    setTimeout(() => {
      saveStudentUser({
        name: fields.name.trim(),
        email: fields.email.trim().toLowerCase(),
        password: fields.password, // plain text — MVP only, never do this in production
      });
      openStudentSession(fields.email.trim().toLowerCase());
      navigate("/dashboard");
    }, 400);
  };

  return (
    // Outer page container — same pattern as AccessibilityPage.jsx
    <div className="px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10">

          {/* Brand mark */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow mb-4">
              <BookOpen className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 text-center">
              Create your account
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Start your accessible learning journey today.
            </p>
          </div>

          {/* Global error banner */}
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
            aria-label="Student sign-up form"
            className="flex flex-col gap-5"
          >
            <FormField
              id="name"
              label="Full Name"
              type="text"
              value={fields.name}
              onChange={handle("name")}
              autoComplete="name"
              placeholder="e.g. Priya Sharma"
              error={errors.name}
              required
            />

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

            {/* Password with show/hide toggle */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={fields.password}
                  onChange={handle("password")}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
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

            {/* Confirm password with show/hide */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                Confirm Password
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={fields.confirmPassword}
                  onChange={handle("confirmPassword")}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  required
                  aria-required="true"
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-gray-900 bg-white placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  {showConfirm
                    ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                    : <Eye className="w-4 h-4" aria-hidden="true" />
                  }
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-0.5">
                  <span aria-hidden="true">⚠</span>{errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Accessibility tip */}
            <p className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 leading-relaxed">
              💡 After signing up, you can configure your accessibility preferences — font size, high contrast, read-aloud, and more.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 px-6 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 mt-1"
            >
              {submitting ? (
                "Creating account…"
              ) : (
                <>
                  <UserPlus className="w-4 h-4" aria-hidden="true" />
                  Create Account
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              Sign in
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
        </div>
      </div>
    </div>
  );
}
