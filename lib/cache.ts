import { IDisplayScore } from '../types/score.interface';
import ILevel from '../types/level.interface';
import IUser from '../types/user.interface';
import { HASH } from './hash';
import IGame from '../types/game.interface';

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
  if (scores !== null) {
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

//ANCHOR - Feature pop up
export function getFeaturePopupString(): string | null {
  return localStorage.getItem(HASH.hasReadFeaturePopup);
}

export function setFeaturePopupString(s: string) {
  localStorage.setItem(HASH.hasReadFeaturePopup, s);
}

//ANCHOR - Submitted Game
export function getCachedGame(): IGame | null {
  const gameString = localStorage.getItem(HASH.game);
  return gameString ? JSON.parse(gameString) : null;
}

export function setCachedGame(game: IGame) {
  localStorage.setItem(HASH.game, JSON.stringify(game));
}

export function clearCachedGame() {
  localStorage.removeItem(HASH.game);
}
