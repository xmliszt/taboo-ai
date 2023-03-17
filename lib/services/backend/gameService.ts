import IScore from '../../../types/score.interface';
import ILevel from '../../../types/level.interface';
import {
  getBestGamesByNickname,
  insertNewGame,
  getGameById,
  getAllGames,
  getBestGamesByLevel,
  getBestGamesByNicknameAndLevel,
  getGamesByLevel,
  getGamesByNickname,
  getGamesByPlayerId,
} from '../../database/gameRepository';
import { insertHighlight } from '../../database/highlightRepository';
import { insertNewScore } from '../../database/scoreRepository';
import { calculateScore } from '../../utils';
import IGame from '../../../types/game.interface';

const saveGame = async (
  level: ILevel,
  scores: IScore[],
  playerNickname: string,
  playerId: string,
  isPromptVisible: boolean
): Promise<IGame> => {
  // Insert the new game into the database
  const totalScore = scores
    .map(calculateScore)
    .reduce((prev, crrt) => prev + crrt);
  const data = await insertNewGame(
    level.name,
    totalScore,
    playerId,
    playerNickname,
    isPromptVisible
  );
  if (!data) {
    throw new Error('Failed to save game');
  }
  const savedGameID: number = data.id;
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
  return data;
};

const retrieveAllGames = async (
  page: number,
  limit: number
): Promise<{ data: IGame[] | null; total: number | null }> => {
  const data = await getAllGames(page, limit);
  if (!data) {
    throw new Error(`Failed to get games`);
  }
  return data;
};

const retrieveGameById = async (id: number): Promise<IGame> => {
  // Retrieve the game with the given ID from the database
  const game = await getGameById(id);
  if (!game) {
    throw new Error(`Game with ID ${id} not found`);
  }
  return game;
};

const retrieveGamesByNickname = async (
  nickname: string,
  page: number,
  limit: number
): Promise<{ data: IGame[] | null; total: number | null } | null> => {
  // Retrieve all games associated with the given nickname from the database
  try {
    const games = await await getGamesByNickname(nickname, page, limit);
    if (!games) {
      throw new Error(
        `Failed to get best games by player nickname ${nickname}`
      );
    }
    return games;
  } catch (error) {
    console.error(`Error getting best games by level: ${error}`);
    return null;
  }
};

const retrieveGamesByPlayerID = async (
  playerID: string,
  page: number,
  limit: number
): Promise<{ data: IGame[] | null; total: number | null } | null> => {
  // Retrieve all games associated with the given nickname from the database
  try {
    const games = await await getGamesByPlayerId(playerID, page, limit);
    if (!games) {
      throw new Error(`Failed to get best games by player ID ${playerID}`);
    }
    return games;
  } catch (error) {
    console.error(`Error getting best games by level: ${error}`);
    return null;
  }
};

const retrieveBestGamesByNickname = async (
  nickname: string,
  limit = 5
): Promise<IGame[] | null> => {
  try {
    const games = await getBestGamesByNickname(nickname, limit);
    if (!games) {
      throw new Error(`Failed to get best games by nickname ${nickname}`);
    }
    return games;
  } catch (error) {
    console.error(`Error getting best games by nickname: ${error}`);
    return null;
  }
};

const retrieveAllGamesByLevel = async (
  level: string,
  page: number,
  limit: number
): Promise<{ data: IGame[] | null; total: number | null } | null> => {
  try {
    const games = await getGamesByLevel(level, page, limit);
    if (!games) {
      throw new Error(`Failed to get best games by level ${level}`);
    }
    return games;
  } catch (error) {
    console.error(`Error getting best games by level: ${error}`);
    return null;
  }
};

const retrieveBestGamesByLevel = async (
  level: string,
  limit = 30
): Promise<IGame[] | null> => {
  try {
    const games = await getBestGamesByLevel(level, limit);
    if (!games) {
      throw new Error(`Failed to get best games by level ${level}`);
    }
    return games;
  } catch (error) {
    console.error(`Error getting best games by level: ${error}`);
    return null;
  }
};

const retrieveBestGamesByNicknameAndLevel = async (
  nickname: string,
  level: string,
  limit = 5
): Promise<IGame[] | null> => {
  try {
    const games = await getBestGamesByNicknameAndLevel(nickname, level, limit);
    if (!games) {
      throw new Error(
        `Failed to get best games by nickname ${nickname} and level ${level}`
      );
    }
    return games;
  } catch (error) {
    console.error(`Error getting best games by nickname and level: ${error}`);
    return null;
  }
};

export {
  saveGame,
  retrieveBestGamesByLevel,
  retrieveBestGamesByNickname,
  retrieveBestGamesByNicknameAndLevel,
  retrieveGameById,
  retrieveGamesByNickname,
  retrieveAllGames,
  retrieveAllGamesByLevel,
  retrieveGamesByPlayerID,
};
