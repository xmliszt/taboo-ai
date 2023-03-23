import { IDisplayScore } from '../types/score.interface';
import ILevel from '../types/level.interface';
import IUser from '../types/user.interface';
import { HASH } from './hash';

export function cacheLevel(level: ILevel) {
  localStorage.setItem(HASH.level, JSON.stringify(level));
}

export function cacheScore(score: IDisplayScore) {
  const scores = getScoresCache();
  if (scores !== null) {
    scores.push(score);
    scores.sort((a, b) => a.id - b.id);
    localStorage.setItem(HASH.scores, JSON.stringify(scores));
  } else {
    localStorage.setItem(HASH.scores, JSON.stringify([score]));
  }
}

export function getLevelCache(): ILevel | null {
  const levelString = localStorage.getItem(HASH.level);
  if (levelString !== null) return JSON.parse(levelString);
  return null;
}

export function getScoresCache(): IDisplayScore[] | null {
  const scoresString = localStorage.getItem(HASH.scores);
  if (scoresString !== null) return JSON.parse(scoresString);
  return null;
}

export function clearLevel() {
  localStorage.removeItem(HASH.level);
}

export function clearScores() {
  localStorage.removeItem(HASH.scores);
}

export function clearCache() {
  localStorage.clear();
}

//ANCHOR - User data storage
export function getUser(): IUser | null {
  const userString = localStorage.getItem(HASH.user);
  return userString === null ? null : JSON.parse(userString);
}

export function setUser(user: IUser) {
  localStorage.setItem(HASH.user, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(HASH.user);
}
