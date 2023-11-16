import { HASH } from './hash';

//ANCHOR - Level
export function clearLevel() {
  localStorage.removeItem(HASH.level);
}

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

//ANCHOR - Acknowledgement
export function getTipsAck(): boolean {
  return JSON.parse(localStorage.getItem(HASH.hasReadTips) ?? 'false');
}

export function setTipsAck(ack: boolean) {
  localStorage.setItem(HASH.hasReadTips, JSON.stringify(ack));
}
