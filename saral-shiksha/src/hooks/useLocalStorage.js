// src/hooks/useLocalStorage.js
// Generic hook for reading/writing a single key in localStorage.
// Returns [value, setter] — same API as useState.

import { useState, useEffect } from "react";

/**
 * @template T
 * @param {string} key          - localStorage key
 * @param {T}      initialValue - Default value if key is absent or unparseable
 * @returns {[T, (value: T) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`useLocalStorage: failed to set key "${key}"`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
