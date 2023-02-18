import IScore from '../level/(models)/Score.interface';
import ILevel from '../levels/(models)/level.interface';

export function cacheLevel(level: ILevel) {
  localStorage.setItem('level', JSON.stringify(level));
}

export function cacheScore(score: IScore) {
  const scores = getScoresCache();
  if (scores !== null) {
    scores.push(score);
    scores.sort((a, b) => a.id - b.id);
    localStorage.setItem('scores', JSON.stringify(scores));
  } else {
    localStorage.setItem('scores', JSON.stringify([score]));
  }
}

export function getLevelCache(): ILevel | null {
  const levelString = localStorage.getItem('level');
  if (levelString !== null) return JSON.parse(levelString);
  return null;
}

export function getScoresCache(): IScore[] | null {
  const scoresString = localStorage.getItem('scores');
  if (scoresString !== null) return JSON.parse(scoresString);
  return null;
}

export function clearLevel() {
  localStorage.removeItem('level');
}

export function clearScores() {
  localStorage.removeItem('scores');
}

export function clearCache() {
  localStorage.clear();
}
