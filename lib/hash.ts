import { generateHashedString } from './utilities';

export function getHash(key: string): string {
  return generateHashedString('taboo-ai', key);
}

export const HASH = {
  level: getHash('level'),
  scores: getHash('scores'),
  dev: getHash('dev'),
  hasReadFeaturePopup: getHash('has-read-feature-popup'),
  hasReadNewsletterPopup: getHash('has-read-newsletter-popup'),
  hasReadTips: getHash('has-read-tips'),
};
