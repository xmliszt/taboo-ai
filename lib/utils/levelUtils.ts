import _ from 'lodash';
import moment from 'moment';

import { IHighlight } from '../types/highlight.type';
import ILevel from '../types/level.type';
import { DateUtils } from './dateUtils';

export type SortType =
  | 'a-z'
  | 'z-a'
  | 'create-old'
  | 'create-new'
  | 'most-popular'
  | 'least-popular'
  | 'most-likes'
  | 'least-likes'
  | 'hard-first'
  | 'easy-first';

export class LevelUtils {
  static getCompareFn(sortType: SortType): (a: ILevel, b: ILevel) => number {
    switch (sortType) {
      case 'a-z':
        return (a, b) => {
          return _.trim(a.name.toLowerCase()).localeCompare(_.trim(b.name.toLowerCase()));
        };
      case 'z-a':
        return (a, b) => {
          return _.trim(b.name.toLowerCase()).localeCompare(_.trim(a.name.toLowerCase()));
        };
      case 'create-new':
        return (a, b) => {
          return (
            moment(b.createdAt, DateUtils.formats.levelCreatedAt).unix() -
            moment(a.createdAt, DateUtils.formats.levelCreatedAt).unix()
          );
        };
      case 'create-old':
        return (a, b) => {
          return (
            moment(a.createdAt, DateUtils.formats.levelCreatedAt).unix() -
            moment(b.createdAt, DateUtils.formats.levelCreatedAt).unix()
          );
        };
      case 'most-popular':
        return (a, b) => {
          return (b.popularity ?? 0) - (a.popularity ?? 0);
        };
      case 'least-popular':
        return (a, b) => {
          return (a.popularity ?? 0) - (b.popularity ?? 0);
        };
      case 'easy-first':
        return (a, b) => {
          return (a.difficulty ?? 0) - (b.difficulty ?? 0);
        };
      case 'hard-first':
        return (a, b) => {
          return (b.difficulty ?? 0) - (a.difficulty ?? 0);
        };
      default:
        return () => {
          return 0;
        };
    }
  }
}

export const getRegexPattern = (target: string): RegExp => {
  const magicSeparator = '[\\W_]*';
  const magicMatchString = target.replace(/\W/g, '').split('').join(magicSeparator);
  const groupRegexString =
    target.length === 1
      ? `^(${magicMatchString})[\\W_]+|[\\W_]+(${magicMatchString})[\\W_]+|[\\W_]+(${magicMatchString})$|^(${magicMatchString})$`
      : `(${magicMatchString})`;
  return new RegExp(groupRegexString, 'gi');
};

export const getMatchedTabooWords = (userInput: string, matchers: string[]): string[] => {
  const matchedTaboos: string[] = [];
  for (const matcher of matchers) {
    if (!matcher) continue;
    const regex = getRegexPattern(matcher);
    let result;
    while ((result = regex.exec(userInput)) !== null) {
      if (!matchedTaboos.includes(matcher)) {
        matchedTaboos.push(matcher);
      }
      // This is necessary to avoid infinite loops with zero-width matches
      if (result.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }
  }
  return matchedTaboos;
};

export const generateHighlights = (
  target: string | null,
  message: string,
  forResponse: boolean
): IHighlight[] => {
  const highlights: IHighlight[] = [];
  if (forResponse && target) {
    const regex = getRegexPattern(target);
    let result;
    while ((result = regex.exec(message)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (result.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      const startIndex = result.index;
      const endIndex = regex.lastIndex;
      const highlight = { start: startIndex, end: endIndex };
      highlights.push(highlight);
    }
  }
  return highlights;
};
