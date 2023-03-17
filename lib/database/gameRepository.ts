import IGame from '../../types/game.interface';
import { supabase } from '../supabaseClient';

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

async function getGameById(id: number): Promise<IGame | null> {
  const { data, error } = await supabase.from('game').select().eq('id', id);

  if (error) {
    console.error('Error getting game by id:', error);
    return null;
  }

  return data[0] as IGame | null;
}

async function getAllGames(): Promise<IGame[] | null> {
  const { data, error } = await supabase.from('game').select('*');

  if (error) {
    console.error('Error getting all games:', error);
    return null;
  }

  return data as IGame[];
}

async function getGamesByNickname(nickname: string): Promise<IGame[] | null> {
  const { data, error } = await supabase
    .from('game')
    .select('*')
    .eq('player_nickname', nickname);

  if (error) {
    console.error('Error getting games by nickname:', error);
    return null;
  }

  return data as IGame[];
}

async function getGamesByPlayerId(playerId: string): Promise<IGame[] | null> {
  const { data, error } = await supabase
    .from('game')
    .select('*')
    .eq('player_id', playerId);

  if (error) {
    console.error('Error getting games by player ID:', error);
    return null;
  }

  return data as IGame[];
}

async function getGamesByLevel(level: string): Promise<IGame[] | null> {
  const { data, error } = await supabase
    .from('game')
    .select('*')
    .eq('level', level);

  if (error) {
    console.error('Error getting games by level:', error);
    return null;
  }

  return data as IGame[];
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
