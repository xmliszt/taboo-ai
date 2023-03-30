import IGame from '../../types/game.interface';
import { supabase } from '../supabaseClient';
import { generateHashedString, getFormattedToday } from '../utilities';

async function insertNewGame(
  levelName: string,
  totalScore: number,
  playerID?: string,
  playerNickname?: string,
  isPromptVisible = true
): Promise<IGame | null> {
  const { data, error } = await supabase
    .from('game')
    .insert({
      game_id: generateHashedString(
        playerID ?? '',
        playerNickname ?? '',
        levelName,
        getFormattedToday()
      ),
      player_id: playerID,
      player_nickname: playerNickname,
      level: levelName,
      total_score: totalScore,
      created_at: new Date().toISOString(),
      prompt_visible: isPromptVisible,
    })
    .select();
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return (data[0] as IGame) || null;
}

async function getGameById(game_id: string): Promise<IGame | null> {
  const { data, error } = await supabase
    .from('game')
    .select()
    .eq('game_id', game_id);

  if (error) {
    console.error('Error getting game by id:', error);
    return null;
  }

  return data[0] as IGame | null;
}

async function getAllGames(
  page: number,
  limit: number
): Promise<{ data: IGame[] | null; total: number | null } | null> {
  const {
    data: games,
    error,
    count: total,
  } = await supabase
    .from('game')
    .select('*', { count: 'exact' })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    console.error(`Error getting games on page ${page}:`, error);
    return null;
  }

  return { data: games as IGame[], total };
}

async function getGamesByNickname(
  nickname: string,
  page: number,
  limit: number
): Promise<{ data: IGame[] | null; total: number | null } | null> {
  const {
    data,
    error,
    count: total,
  } = await supabase
    .from('game')
    .select('*', { count: 'exact' })
    .eq('player_nickname', nickname)
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    console.error('Error getting games by nickname:', error);
    return null;
  }

  return { data: data as IGame[], total };
}

async function getGamesByPlayerId(
  playerId: string,
  page: number,
  limit: number
): Promise<{ data: IGame[] | null; total: number | null } | null> {
  const {
    data,
    error,
    count: total,
  } = await supabase
    .from('game')
    .select('*', { count: 'exact' })
    .eq('player_id', playerId)
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    console.error('Error getting games by player ID:', error);
    return null;
  }

  return { data: data as IGame[], total };
}

async function getGamesByLevel(
  level: string
): Promise<{ data: IGame[] | null; total: number | null } | null> {
  const {
    data,
    error,
    count: total,
  } = await supabase
    .from('game')
    .select('*', { count: 'exact' })
    .eq('level', level);

  if (error) {
    console.error('Error getting games by level:', error);
    return null;
  }

  return { data: data as IGame[], total };
}

async function getBestGamesByNickname(
  nickname: string,
  limit = 5
): Promise<IGame[] | null> {
  const { data, error } = await supabase
    .from('game')
    .select('*')
    .eq('player_nickname', nickname)
    .order('total_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting best games by nickname:', error);
    return null;
  }

  return data as IGame[];
}

async function getBestGamesByLevel(
  level: string,
  limit = 30
): Promise<IGame[] | null> {
  const { data, error } = await supabase
    .from('game')
    .select('*')
    .eq('level', level)
    .order('total_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting best games by level:', error);
    return null;
  }

  return data as IGame[];
}

async function getBestGamesByNicknameAndLevel(
  nickname: string,
  level: string,
  limit = 5
): Promise<IGame[] | null> {
  const { data, error } = await supabase
    .from('game')
    .select('*')
    .eq('player_nickname', nickname)
    .eq('level', level)
    .order('total_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting best games by nickname and level:', error);
    return null;
  }

  return data as IGame[];
}

export {
  insertNewGame,
  getAllGames,
  getGameById,
  getGamesByPlayerId,
  getGamesByLevel,
  getGamesByNickname,
  getBestGamesByLevel,
  getBestGamesByNickname,
  getBestGamesByNicknameAndLevel,
};
