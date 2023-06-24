import { generateHashedString } from './utilities';

export function getHash(key: string): string {
  return generateHashedString('taboo-ai', key);
}

export const HASH = {
  user: getHash('user'),
  level: getHash('level'),
  scores: getHash('scores'),
  dev: getHash('dev'),
  game: getHash('game'),
  hasReadFeaturePopup: getHash('has-read-feature-popup'),
  hasReadTips: getHash('has-read-tips'),
};
