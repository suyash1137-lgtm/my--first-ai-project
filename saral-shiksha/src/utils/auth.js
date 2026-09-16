// src/utils/auth.js
// Centralised localStorage auth helpers.
// Keys live here so every file references one source of truth.
// No backend calls — this is a frontend-only hackathon MVP.

export const STUDENT_KEY   = "saralShiksha_user";
export const TEACHER_KEY   = "saralShiksha_teacherUser";
export const SESSION_KEY   = "saralShiksha_session";        // student session flag
export const T_SESSION_KEY = "saralShiksha_teacherSession"; // teacher session flag

/* ── Student ─────────────────────────────────────────────────── */

/**
 * Persist a new student account.
 * @param {{ name: string, email: string, password: string }} data
 */
export function saveStudentUser(data) {
  localStorage.setItem(STUDENT_KEY, JSON.stringify(data));
}

/**
 * Retrieve the stored student account (or null).
 * @returns {{ name: string, email: string, password: string } | null}
 */
export function getStudentUser() {
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Open a student session (marks the user as logged in).
 * @param {string} email
 */
export function openStudentSession(email) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, loginAt: Date.now() }));
}

/** Remove the active student session. */
export function clearStudentSession() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Returns the active student session object or null.
 * @returns {{ email: string, loginAt: number } | null}
 */
export function getStudentSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ── Teacher ─────────────────────────────────────────────────── */

/**
 * Persist a teacher account (mock — single teacher for MVP).
 * @param {{ name: string, email: string, password: string }} data
 */
export function saveTeacherUser(data) {
  localStorage.setItem(TEACHER_KEY, JSON.stringify(data));
}

/**
 * Retrieve the stored teacher account (or null).
 */
export function getTeacherUser() {
  try {
    const raw = localStorage.getItem(TEACHER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Open a teacher session. */
export function openTeacherSession(email) {
  localStorage.setItem(T_SESSION_KEY, JSON.stringify({ email, loginAt: Date.now() }));
}

/** Remove the active teacher session. */
export function clearTeacherSession() {
  localStorage.removeItem(T_SESSION_KEY);
}

/**
 * Returns the active teacher session object or null.
 */
export function getTeacherSession() {
  try {
    const raw = localStorage.getItem(T_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
