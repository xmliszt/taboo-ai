import moment from 'moment';
import IGame from '../../../types/game.interface';
import ILevel from '../../../types/level.interface';
import { IDisplayScore } from '../../../types/score.interface';

interface ErrorResponse {
  error: string;
}

async function request<T>(url: string, method: string, body?: any): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }

  const data: T = await response.json();
  return data;
}

export const saveGame = async (
  level: ILevel,
  scores: IDisplayScore[],
  player_nickname: string,
  player_id: string,
  prompt_visible: boolean
) => {
  const url = `/api/games/save`;
  const { data } = await request<{ data: IGame }>(url, 'POST', {
    level,
    scores,
    player_nickname: player_nickname,
    player_id: player_id,
    prompt_visible: prompt_visible,
  });
  return data as IGame;
};

export const getOneGameByID = async (game_id: string) => {
  const url = `/api/games/${game_id}/get`;
  return await request<{ game: IGame | null; error?: string }>(url, 'GET');
};

export const getAllGames = async (page: number, limit = 50) => {
  const url = `/api/games/get?pageIndex=${page}&limit=${limit}`;
  return await request<{ games: IGame[]; total: number }>(url, 'GET');
};

export const getAllGamesByLevel = async (level: string) => {
  const url = `/api/games/get?level=${level}`;
  return await request<{ games: IGame[]; total: number }>(url, 'GET');
};

export const getAllGamesByPlayerID = async (
  player_id: string,
  page: number,
  limit = 50
) => {
  const url = `/api/games/get?player_id=${player_id}&pageIndex=${page}&limit=${limit}`;
  return await request<{ games: IGame[]; total: number }>(url, 'GET');
};

export const getAllGamesByPlayerNickname = async (
  player_nickname: string,
  page: number,
  limit = 50
) => {
  const url = `/api/games/get?player_nickname=${player_nickname}&pageIndex=${page}&limit=${limit}`;
  return await request<{ games: IGame[]; total: number }>(url, 'GET');
};

export const getGameByPlayerNicknameFilterByDate = async (
  player_nickname: string,
  date: moment.Moment
) => {
  const url = `/api/games/get?player_nickname=${player_nickname}&pageIndex=0&limit=5`;
  const { games } = await request<{ games: IGame[]; total: number }>(
    url,
    'GET'
  );
  const targetGame = games.find((game) =>
    moment(game.created_at).isSame(date, 'day')
  );
  return targetGame;
};

export const getBestGamesByLevel = async (level: string, limit = 5) => {
  const url = `/api/games/best/get?level=${level}&limit=${limit}`;
  return await request<{ games: IGame[] }>(url, 'GET');
};

export const getBestGamesByNickname = async (nickname: string, limit = 5) => {
  const url = `/api/games/best/get?player_nickname=${nickname}&limit=${limit}`;
  return await request<{ games: IGame[] }>(url, 'GET');
};

export const getBestGamesByNicknameAndLevel = async (
  level: string,
  nickname: string,
  limit = 5
) => {
  const url = `/api/games/best/get?level=${level}&player_nickname=${nickname}&limit=${limit}`;
  return await request<{ games: IGame[] }>(url, 'GET');
};
