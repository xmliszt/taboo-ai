import { NextApiRequest, NextApiResponse } from 'next';
import { maskPlayerID } from '../../../../lib/utilities';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import {
  retrieveBestGamesByLevel,
  retrieveBestGamesByNickname,
  retrieveBestGamesByNicknameAndLevel,
} from '../../../../lib/services/backend/gameService';
import type IGame from '../../../../types/game.interface';

interface GetAllBestGameResponse {
  games: IGame[];
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const getBestGamesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetAllBestGameResponse | ErrorResponse>
) => {
  const { level, player_nickname, limit } = req.query;
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'Method not allowed.' });
  }

  if (level && player_nickname && limit) {
    try {
      const games = await retrieveBestGamesByNicknameAndLevel(
        String(player_nickname),
        String(level),
        Number(limit)
      );
      if (!games) {
        return res.status(404).send({
          error: `Games with ${player_nickname} and ${level} not found`,
        });
      }
      games.forEach((game) => maskPlayerID(game));
      return res.status(200).send({ games });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching games.', details: error.message });
    }
  } else if (level && limit) {
    try {
      const games = await retrieveBestGamesByLevel(
        String(level),
        Number(limit)
      );
      if (!games) {
        return res.status(404).send({
          error: `Games with ${level} not found`,
        });
      }
      games.forEach((game) => maskPlayerID(game));
      return res.status(200).send({ games });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching games.', details: error.message });
    }
  } else if (player_nickname && limit) {
    try {
      const games = await retrieveBestGamesByNickname(
        String(player_nickname),
        Number(limit)
      );
      if (!games) {
        return res.status(404).send({
          error: `Games with ${player_nickname} not found`,
        });
      }
      games.forEach((game) => maskPlayerID(game));
      return res.status(200).send({ games });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching games.', details: error.message });
    }
  } else {
    return res.status(400).send({ error: 'Invalid request parameters!' });
  }
};

export default withMiddleware(getBestGamesHandler);
