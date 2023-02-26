import IScore from '../../app/level/(models)/Score.interface';
import ILevel from '../../app/levels/(models)/level.interface';
import { insertNewGame } from '../db/gameRepository';
import { insertHighlight } from '../db/highlightRepository';
import { insertNewScore } from '../db/scoreRepository';

export const saveGame = async (level: ILevel, scores: IScore[]) => {
  const { data } = await insertNewGame(level.name);
  const savedGameID: number = data[0].id;
  let scoreID = 1;
  for (const score of scores) {
    const { data } = await insertNewScore(
      savedGameID,
      scoreID,
      score.target,
      score.question,
      score.response,
      score.completion
    );
    const savedScoreID: number = data[0].score_id;
    for (const highlight of score.responseHighlights) {
      await insertHighlight(
        savedGameID,
        savedScoreID,
        highlight.start,
        highlight.end
      );
    }
    scoreID++;
  }
};
