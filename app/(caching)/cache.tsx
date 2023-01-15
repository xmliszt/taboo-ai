import IScore from "../level/[id]/(models)/Score.interface";
import ILevel from "../levels/(models)/level.interface";

export function cacheLevel(level: ILevel) {
  localStorage.setItem("level", JSON.stringify(level));
}

export function cacheScore(score: IScore) {
  let scores = getScoresCache();
  if (scores !== null) {
    scores.push(score);
    scores.sort((a, b) => a.id - b.id);
    localStorage.setItem("scores", JSON.stringify(scores));
  } else {
    localStorage.setItem("scores", JSON.stringify([score]));
  }
}

export function getLevelCache(): ILevel | null {
  let levelString = localStorage.getItem("level");
  if (levelString !== null) return JSON.parse(levelString);
  return null;
}

export function getScoresCache(): IScore[] | null {
  let scoresString = localStorage.getItem("scores");
  if (scoresString !== null) return JSON.parse(scoresString);
  return null;
}

export function clearScores() {
  localStorage.removeItem("scores");
}

export function clearCache() {
  localStorage.clear();
}
