import { IScore } from '../../../types/score.interface';
import { selectScoresByGameID } from '../../database/scoreRepository';

const getScoresByGameID = async (gameID: string): Promise<IScore[]> => {
  const { data } = await selectScoresByGameID(gameID);
  return data as IScore[];
};

export { getScoresByGameID };
