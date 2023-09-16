import { IDisplayScore } from './types/score.interface';
import { HASH } from './hash';

//ANCHOR - Level
export function clearLevel() {
  localStorage.removeItem(HASH.level);
}

//ANCHOR - Scores
export function clearScores() {
  localStorage.removeItem(HASH.scores);
}

//ANCHOR - Feature pop up
export function getFeaturePopupString(): string | null {
  return localStorage.getItem(HASH.hasReadFeaturePopup);
}

export function setFeaturePopupString(s?: string) {
  if (s) localStorage.setItem(HASH.hasReadFeaturePopup, s);
}

//ANCHOR - Acknowledgement
export function getTipsAck(): boolean {
  return JSON.parse(localStorage.getItem(HASH.hasReadTips) ?? 'false');
}

export function setTipsAck(ack: boolean) {
  localStorage.setItem(HASH.hasReadTips, JSON.stringify(ack));
}
