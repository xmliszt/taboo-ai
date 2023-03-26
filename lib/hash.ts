import { generateHashedString } from './utils';

export function getHash(key: string): string {
  return generateHashedString('taboo-ai', key);
}

export const HASH = {
  user: getHash('user'),
  level: getHash('level'),
  scores: getHash('scores'),
  dev: getHash('dev'),
  game_id: getHash('game_id'),
  is_prompt_visible: getHash('is_prompt_visible'),
  preview_player_nickname: getHash('preview_player_nickname'),
};
