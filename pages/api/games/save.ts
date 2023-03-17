import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../lib/middleware/middlewareWrapper';
import { saveGame } from '../../../lib/services/backend/gameService';
import type ILevel from '../../../types/level.interface';
import type IScore from '../../../types/score.interface';

interface SaveGameResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const saveGameHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<SaveGameResponse | ErrorResponse>
) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Method not allowed.' });
  }

  const {
    level,
    scores,
    player_nickname,
    player_id,
    prompt_visible,
  }: {
    level: ILevel;
    scores: IScore[];
    player_nickname: string;
    player_id: string;
    prompt_visible: boolean;
  } = req.body;

  try {
    await saveGame(level, scores, player_nickname, player_id, prompt_visible);
    return res.status(200).send({ message: 'Game saved successfully.' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: 'Error saving game.', details: error.message });
  }
};

export default withMiddleware(saveGameHandler);
