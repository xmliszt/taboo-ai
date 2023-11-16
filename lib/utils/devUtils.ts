import { HASH } from '../hash';

export const isDevMode = (): boolean => {
  return localStorage.getItem(HASH.dev) === '1';
};

export const getDevMode = (): string => {
  return localStorage.getItem('mode') ?? '1';
};

export const setDevMode = (mode: string) => {
  localStorage.setItem('mode', mode);
};

export const setDevModeOn = () => {
  localStorage.setItem(HASH.dev, '1');
};

export const setDevModeOff = () => {
  localStorage.removeItem(HASH.dev);
};

export const clearDevMode = () => {
  localStorage.removeItem(HASH.dev);
  localStorage.removeItem('mode');
};
