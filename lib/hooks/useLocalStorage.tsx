'use client';

import { useDebugValue, useEffect, useState } from 'react';

export const useLocalStorage = <S,>(key: string) => {
  const [state, setState] = useState<S>();
  useDebugValue(state);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) setState(parse(item));
  }, []);

  const setItem = (s: S) => {
    localStorage.setItem(key, JSON.stringify(s));
    setState(s);
  };

  return { item: state, setItem };
};

const parse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
