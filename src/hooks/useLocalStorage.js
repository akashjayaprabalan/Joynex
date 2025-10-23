import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value
 * @returns {[any, Function]} The stored value and a function to update it
 */
export const useLocalStorage = (key, initialValue) => {
  // Get the stored value or use the initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when the value changes
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

