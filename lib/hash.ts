import { generateHashedString } from './utils';

export function getHash(key: string): string {
  return generateHashedString('taboo-ai', key);
}

export const HASH = {
  user: getHash('user'),
  level: getHash('level'),
  scores: getHash('scores'),
  dev: getHash('dev'),
  hasReadFeaturePopup: getHash('has-read-feature-popup'),
};
