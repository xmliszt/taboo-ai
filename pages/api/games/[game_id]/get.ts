import { NextApiRequest, NextApiResponse } from 'next';
import { maskPlayerID } from '../../../../lib/utilities';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import { retrieveGameById } from '../../../../lib/services/backend/gameService';
import IGame from '../../../../types/game.interface';

interface GetGameByIDResponse {
  game: IGame | null;
  error?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const getGameByIDHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetGameByIDResponse | ErrorResponse>
) => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'Method not allowed.' });
  }

  const { game_id } = req.query;
  if (!game_id || typeof game_id !== 'string') {
    res.status(400).json({ error: 'Game id parameter is required' });
    return;
  }
  try {
    const game = await retrieveGameById(game_id);
    if (!game) {
      return res.status(200).send({ game: null, error: 'not found' });
    } else {
      maskPlayerID(game);
      return res.status(200).send({ game });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: `Error fetching game by ID - ${game_id}.`,
      details: error.message,
    });
  }
};

export default withMiddleware(getGameByIDHandler);
