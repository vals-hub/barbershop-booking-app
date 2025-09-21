import { useEffect, useState } from 'react';

type Initializer<T> = T | (() => T);

const resolveInitialValue = <T>(value: Initializer<T>): T =>
  typeof value === 'function' ? (value as () => T)() : value;

export function usePersistentState<T>(key: string, initialValue: Initializer<T>) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return resolveInitialValue(initialValue);
    }

    const storedValue = window.localStorage.getItem(key);

    if (storedValue) {
      try {
        return JSON.parse(storedValue) as T;
      } catch (error) {
        console.warn('Αδυναμία ανάγνωσης δεδομένων από το localStorage', error);
      }
    }

    return resolveInitialValue(initialValue);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
