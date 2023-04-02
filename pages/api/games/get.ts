import { NextApiRequest, NextApiResponse } from 'next';
import { maskPlayerID } from '../../../lib/utilities';
import withMiddleware from '../../../lib/middleware/middlewareWrapper';
import {
  retrieveAllGames,
  retrieveAllGamesByLevel,
  retrieveGamesByNickname,
  retrieveGamesByPlayerID,
} from '../../../lib/services/backend/gameService';
import type IGame from '../../../types/game.interface';

interface GetAllGameResponse {
  games: IGame[];
  total: number;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const getGamesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetAllGameResponse | ErrorResponse>
) => {
  const { level, player_id, player_nickname, limit, pageIndex } = req.query;
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'Method not allowed.' });
  }

  if (level) {
    try {
      const data = await retrieveAllGamesByLevel(String(level));
      if (!data) {
        return res.status(404).send({
          error: `Games with ${level} not found`,
        });
      }
      const games = data.data ?? [];
      const total = data.total ?? 0;
      games.forEach((game) => maskPlayerID(game));
      return res.status(200).send({ games: games, total: total });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching games.', details: error.message });
    }
  } else if (player_nickname && limit && pageIndex) {
    try {
      const data = await retrieveGamesByNickname(
        String(player_nickname),
        Number(pageIndex),
        Number(limit)
      );
      if (!data) {
        return res.status(404).send({
          error: `Games with ${player_nickname} not found`,
        });
      }
      const games = data.data ?? [];
      const total = data.total ?? 0;
      games.forEach((game) => maskPlayerID(game));
      return res.status(200).send({ games: games, total: total });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching games.', details: error.message });
    }
  } else if (player_id && limit && pageIndex) {
    try {
      const data = await retrieveGamesByPlayerID(
        String(player_id),
        Number(pageIndex),
        Number(limit)
      );
      if (!data) {
        return res.status(404).send({
          error: `Games with ${player_id} not found`,
        });
      }
      const games = data.data ?? [];
      const total = data.total ?? 0;
      games.forEach((game) => maskPlayerID(game));
      return res.status(200).send({ games: games, total: total });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching games.', details: error.message });
    }
  } else if (pageIndex && limit) {
    try {
      const data = await retrieveAllGames(Number(pageIndex), Number(limit));
      if (!data) {
        return res.status(404).send({
          error: `Games not found`,
        });
      }
      const games = data.data ?? [];
      const total = data.total ?? 0;
      games.forEach((game) => maskPlayerID(game));
      return res.status(200).send({ games: games, total: total });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching all games.', details: error.message });
    }
  } else {
    return res.status(400).send({ error: 'Invalid pagination request' });
  }
};

export default withMiddleware(getGamesHandler);
