'use client';

import { useDebugValue, useEffect, useState } from 'react';

export const useLocalStorage = <S,>(key: string) => {
  const [state, setState] = useState<S>();
  const [loading, setLoading] = useState(true);
  useDebugValue(state);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) setState(parse(item));
    setLoading(false);
    return () => {
      setLoading(true);
    };
  }, []);

  const setItem = (s: S) => {
    localStorage.setItem(key, JSON.stringify(s));
    setState(s);
  };

  const clearItem = () => {
    localStorage.removeItem(key);
    setState(undefined);
  };

  return { item: state, setItem, clearItem, loading };
};

const parse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
