import { IDisplayScore } from './types/score.interface';
import ILevel from './types/level.interface';
import { HASH } from './hash';

//ANCHOR - Level
export function cacheLevel(level: ILevel) {
  localStorage.setItem(HASH.level, JSON.stringify(level));
}

export function getLevelCache(): ILevel | null {
  const levelString = localStorage.getItem(HASH.level);
  return levelString ? JSON.parse(levelString) : null;
}

export function clearLevel() {
  localStorage.removeItem(HASH.level);
}

//ANCHOR - Scores
export function cacheScore(score: IDisplayScore) {
  const scores = getScoresCache();
  if (scores !== null && !scores.includes(score)) {
    scores.push(score);
    scores.sort((a, b) => a.id - b.id);
    localStorage.setItem(HASH.scores, JSON.stringify(scores));
  } else {
    localStorage.setItem(HASH.scores, JSON.stringify([score]));
  }
}

export function getScoresCache(): IDisplayScore[] | null {
  const scoresString = localStorage.getItem(HASH.scores);
  return scoresString ? JSON.parse(scoresString) : null;
}

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
