import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../lib/middleware/middlewareWrapper';
import {
  retrieveAllGames,
  retrieveAllGamesByLevel,
  retrieveBestGamesByLevel,
  retrieveBestGamesByNickname,
  retrieveBestGamesByNicknameAndLevel,
  retrieveGamesByNickname,
  retrieveGamesByPlayerID,
} from '../../../lib/services/backend/gameService';
import type IGame from '../../../types/game.interface';

interface GetAllGameResponse {
  games: IGame[];
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const getGamesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetAllGameResponse | ErrorResponse>
) => {
  const { level, player_id, player_nickname, limit } = req.query;
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
      return res.status(200).send({ games });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching games.', details: error.message });
    }
  } else if (level) {
    try {
      const games = await retrieveAllGamesByLevel(String(level));
      if (!games) {
        return res.status(404).send({
          error: `Games with ${level} not found`,
        });
      }
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
      return res.status(200).send({ games });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching games.', details: error.message });
    }
  } else if (player_nickname) {
    try {
      const games = await retrieveGamesByNickname(String(player_nickname));
      if (!games) {
        return res.status(404).send({
          error: `Games with ${player_nickname} not found`,
        });
      }
      return res.status(200).send({ games });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching games.', details: error.message });
    }
  } else if (player_id) {
    try {
      const games = await retrieveGamesByPlayerID(String(player_id));
      if (!games) {
        return res.status(404).send({
          error: `Games with ${player_id} not found`,
        });
      }
      return res.status(200).send({ games });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching games.', details: error.message });
    }
  } else {
    try {
      const games = await retrieveAllGames();
      return res.status(200).send({ games });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: 'Error fetching all games.', details: error.message });
    }
  }
};

export default withMiddleware(getGamesHandler);
