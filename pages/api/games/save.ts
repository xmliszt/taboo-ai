import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../lib/middleware/middlewareWrapper';
import { saveGame } from '../../../lib/services/backend/gameService';
import IGame from '../../../types/game.interface';
import type ILevel from '../../../types/level.interface';
import type { IDisplayScore } from '../../../types/score.interface';

interface SaveGameResponse {
  data: IGame;
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
    final_score,
    player_nickname,
    player_id,
    prompt_visible,
  }: {
    level: ILevel;
    scores: IDisplayScore[];
    final_score: number;
    player_nickname: string;
    player_id: string;
    prompt_visible: boolean;
  } = req.body;

  try {
    const savedGame = await saveGame(
      level,
      scores,
      final_score,
      player_nickname,
      player_id,
      prompt_visible
    );
    return res.status(200).send({ data: savedGame });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: 'Error saving game.', details: error.message });
  }
};

export default withMiddleware(saveGameHandler);
