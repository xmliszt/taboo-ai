import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import { retrieveGameById } from '../../../../lib/services/backend/gameService';
import IGame from '../../../../types/game.interface';

interface GetGameByIDResponse {
  game: IGame;
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

  const { id } = req.query;
  if (!id) {
    res.status(400).json({ error: 'Game id parameter is required' });
    return;
  }
  try {
    const game = await retrieveGameById(Number(id));
    return res.status(200).send({ game });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: `Error fetching game by ID - ${id}.`,
      details: error.message,
    });
  }
};

export default withMiddleware(getGameByIDHandler);
