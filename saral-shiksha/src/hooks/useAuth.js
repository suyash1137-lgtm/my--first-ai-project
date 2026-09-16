// src/hooks/useAuth.js
// Thin hook that reads session state from localStorage.
// No React state — just reads the snapshot at call time.
// Pages that need reactive re-render should call this inside component.

import { getStudentSession, getStudentUser, getTeacherSession, getTeacherUser } from "../utils/auth";

/**
 * Returns current student auth state.
 * @returns {{ isLoggedIn: boolean, user: object|null, session: object|null }}
 */
export function useStudentAuth() {
  const session = getStudentSession();
  const user    = getStudentUser();
  return {
    isLoggedIn: Boolean(session),
    user,
    session,
  };
}

/**
 * Returns current teacher auth state.
 * @returns {{ isLoggedIn: boolean, user: object|null, session: object|null }}
 */
export function useTeacherAuth() {
  const session = getTeacherSession();
  const user    = getTeacherUser();
  return {
    isLoggedIn: Boolean(session),
    user,
    session,
  };
}

export default useStudentAuth;
