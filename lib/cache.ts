import { HASH } from './hash';

// Weekly topics drop pop up
export function getWeeklyTopicsPopupString(): string | null {
  return localStorage.getItem(HASH.hasReadWeeklyTopicsPopup);
}

export function setWeeklyTopicsPopupString(s?: string) {
  if (s) localStorage.setItem(HASH.hasReadWeeklyTopicsPopup, s);
}

// Feature pop up
export function getFeaturePopupString(): string | null {
  return localStorage.getItem(HASH.hasReadFeaturePopup);
}

export function setFeaturePopupString(s?: string) {
  if (s) localStorage.setItem(HASH.hasReadFeaturePopup, s);
}

// Newletter pop up
export function getNewsletterPopupString(): string | null {
  return localStorage.getItem(HASH.hasReadNewsletterPopup);
}

export function setNewsletterPopupString(s?: string) {
  if (s) localStorage.setItem(HASH.hasReadNewsletterPopup, s);
}
