import _ from 'lodash';
import moment from 'moment';
import ILevel from '../types/level.interface';
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
          return _.trim(a.name.toLowerCase()).localeCompare(
            _.trim(b.name.toLowerCase())
          );
        };
      case 'z-a':
        return (a, b) => {
          return _.trim(b.name.toLowerCase()).localeCompare(
            _.trim(a.name.toLowerCase())
          );
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
