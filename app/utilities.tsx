import _ from 'lodash';
import IVariation from '../types/variation.interface';
import { Highlight, IHighlight } from '../types/chat.interface';
import { IDisplayScore, IScore } from '../types/score.interface';
import ILevel from '../types/level.interface';
import IGame from '../types/game.interface';
import { CONSTANTS } from '../lib/constants';
import IDailyLevel from '../types/dailyLevel.interface';
import moment from 'moment';

/**
 * Sanitize the array of Highlight objects such that Highlight
 * with same start but different end will only keep the one
 * that has the larget end.
 * @param highlights The array of Highlight object
 */
export const sanitizeHighlights = (highlights: Highlight[]): Highlight[] => {
  const highlightMap: { [key: number]: Highlight } = {};
  for (const highlight of highlights) {
    const start = highlight.start;
    if (start in highlightMap) {
      const currentHighlight = highlightMap[start];
      highlightMap[start] =
        highlight.end > currentHighlight.end ? highlight : currentHighlight;
    } else {
      highlightMap[start] = highlight;
    }
  }
  const highlightsArray = Object.values(highlightMap);
  highlightsArray.sort((a, b) => a.start - b.start);
  const results: Highlight[] = [];
  let prevEnd = 0;
  let idx = 0;
  for (const highlight of highlightsArray) {
    if (highlight.start < prevEnd) {
      if (highlight.end > prevEnd) {
        results[idx - 1].end = highlight.end;
      }
    } else {
      results.push(highlight);
      prevEnd = highlight.end;
      idx++;
    }
  }
  return results;
};

export const applyHighlightsToMessage = (
  message: string,
  highlights: Highlight[],
  onNormalMessagePart: (s: string) => JSX.Element,
  onHighlightMessagePart: (s: string) => JSX.Element
): JSX.Element[] => {
  let parts = [];
  if (highlights.length === 0) parts = [<span key={message}>{message}</span>];
  else {
    let startIndex = 0;
    let endIndex = 0;
    for (const highlight of highlights) {
      endIndex = highlight.start;
      while (/[\W_]/g.test(message[endIndex])) {
        endIndex++;
      }
      // Normal part
      parts.push(onNormalMessagePart(message.substring(startIndex, endIndex)));
      startIndex = endIndex;
      endIndex = highlight.end;
      // Highlighted part
      parts.push(
        onHighlightMessagePart(message.substring(startIndex, endIndex))
      );
      startIndex = endIndex;
    }
    parts.push(onNormalMessagePart(message.substring(endIndex)));
  }
  return parts;
};

export const formatResponseTextIntoArray = (
  text: string,
  target?: string
): string[] => {
  let wordList: string[];
  const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  try {
    wordList = JSON.parse(text) as string[];
  } catch {
    try {
      const sanitizedString = text.trim();
      wordList = sanitizedString.split(',');
      if (wordList.length <= 1) {
        wordList = sanitizedString.split('\n');
        if (wordList.length <= 1) {
          wordList = [];
        }
      }
      wordList = _.uniq(
        wordList.map((text) =>
          _.trim(text.replace(/\d/g, ''), punctuation).toLowerCase()
        )
      );
      wordList = wordList.filter((text) => text.length > 0);
    } catch {
      wordList = [];
    }
  }
  wordList = wordList.map((e) =>
    _.startCase(_.toLower(_.trim(e, punctuation)))
  );
  wordList = _.uniq(wordList);
  if (target) {
    const _word = _.startCase(_.toLower(target));
    if (!wordList.includes(_word)) {
      wordList.push(_word);
    }
  }
  wordList = wordList.filter((word) => word.length < 20);
  return wordList;
};

export const getMockResponse = async (
  target: string,
  mode: string
): Promise<string | undefined> => {
  return new Promise<string | undefined>((res, rej) => {
    setTimeout(() => {
      switch (mode) {
        case '1':
          res(`The target response is: ${target}.`);
          break;
        case '2':
          res(`adfjlasdjflaksjdfklajsdfjaklsjaj`);
          break;
        case '3':
          res(undefined);
          break;
        case '4':
          rej('Mock Failure');
          break;
        default:
          res(`The target response is: ${target}.`);
      }
    }, 2000);
  });
};

export const getMockVariations = async (
  target: string,
  shouldSucceed = true
): Promise<IVariation> => {
  return new Promise<IVariation>((res, rej) => {
    setTimeout(() => {
      shouldSucceed
        ? res({ target: target, variations: Array(15).fill(target) })
        : rej('Mock Failure');
    }, 1000);
  });
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getDifficulty = (difficulty: number): string => {
  switch (difficulty) {
    case 1:
      return 'Easy (1)';
    case 2:
      return 'Medium (2)';
    case 3:
      return 'Hard (3)';
    default:
      return 'Unknown (?)';
  }
};

export const buildScoresForDisplay = (
  level: ILevel,
  score: IScore,
  highlights: IHighlight[]
): IDisplayScore => {
  return {
    id: score.score_id,
    target: score.target,
    question: score.question,
    response: score.response,
    difficulty: level.difficulty,
    completion: score.completion_duration,
    responseHighlights: highlights.map(
      (h): Highlight => ({ start: h.start, end: h.end })
    ),
  };
};

export const buildLevelForDisplay = (level: IDailyLevel): ILevel => {
  const dateObject = moment(level.created_date, 'DD-MM-YYYY');
  return {
    name: level.name,
    difficulty: level.difficulty,
    author: 'Taboo.AI',
    isDaily: true,
    words: level.words,
    createdAt: dateObject.valueOf(),
    dailyLevelName: `Daily Challenge: ${dateObject.format('ddd, MMM Do YYYY')}`,
    dailyLevelTopic: level.topic,
  };
};

export const maskPlayerID = (game: IGame) => {
  game.player_id = CONSTANTS.mask;
};
