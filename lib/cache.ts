import { HASH } from './hash';

//ANCHOR - Feature pop up
export function getFeaturePopupString(): string | null {
  return localStorage.getItem(HASH.hasReadFeaturePopup);
}

export function setFeaturePopupString(s?: string) {
  if (s) localStorage.setItem(HASH.hasReadFeaturePopup, s);
}

//ANCHOR - Newletter pop up
export function getNewsletterPopupString(): string | null {
  return localStorage.getItem(HASH.hasReadNewsletterPopup);
}

export function setNewsletterPopupString(s?: string) {
  if (s) localStorage.setItem(HASH.hasReadNewsletterPopup, s);
}
