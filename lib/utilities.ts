import crypto from 'crypto';
import html2canvas from 'html2canvas';
import _ from 'lodash';

import { IWord } from './types/word.type';

export function generateHashedString(...items: string[]): string {
  const stringToHash = items.join('_');
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return hash.substring(0, 8);
}

export const formatResponseTextIntoArray = (text: string, target?: string): string[] => {
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
        wordList.map((text) => _.trim(text.replace(/\d/g, ''), punctuation).toLowerCase())
      );
      wordList = wordList.filter((text) => text.length > 0);
    } catch {
      wordList = [];
    }
  }
  wordList = wordList.map((e) => _.toLower(_.trim(e, punctuation)));
  wordList = _.uniq(wordList);
  if (target) {
    const _word = _.toLower(target);
    if (!wordList.includes(_word)) {
      wordList.push(_word);
    }
  }
  wordList = wordList.filter((word) => word.length < 20);
  return wordList.map(_.trim);
};

export const getMockResponse = async (
  target: string,
  mode: string,
  duration = 1000
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
          res('Server Overloaded');
          break;
        case '4':
          rej('Mock Failure');
          break;
        default:
          res(`The target response is: ${target}.`);
      }
    }, duration);
  });
};

export const getMockVariations = async (target: string, shouldSucceed = true): Promise<IWord> => {
  return new Promise<IWord>((res, rej) => {
    setTimeout(() => {
      shouldSucceed
        ? res({
            word: target,
            taboos: Array(15).fill(target),
            is_verified: true,
            updated_at: new Date().toISOString(),
            created_by: null,
          })
        : rej('Mock Failure');
    }, 1000);
  });
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatStringForDisplay = (s: string) => {
  return _.startCase(_.trim(_.toLower(s)));
};

export const getDifficulty = (difficulty: number, withNumber = true): string => {
  let s;
  switch (difficulty) {
    case 1:
      s = 'Easy';
      break;
    case 2:
      s = 'Medium';
      break;
    case 3:
      s = 'Hard';
      break;
    default:
      s = 'Unknown';
      break;
  }
  if (withNumber) {
    s += ` (${difficulty})`;
  }
  return s;
};

export const getDifficultyMultipliers = (
  difficulty: number
): { timeMultiplier: number; promptMultiplier: number } => {
  switch (difficulty) {
    case 1:
      return { timeMultiplier: 0.4, promptMultiplier: 0.6 };
    case 2:
      return { timeMultiplier: 0.3, promptMultiplier: 0.7 };
    case 3:
      return { timeMultiplier: 0.2, promptMultiplier: 0.8 };
    default:
      return { timeMultiplier: 0.5, promptMultiplier: 0.5 };
  }
};

export const getDisplayedTopicName = (name?: string): string => {
  return _.startCase(name) ?? 'Unknown';
};

export const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

type ShareResult = {
  href: string;
  downloadName: string;
};
export const shareImage = (source: HTMLDivElement): Promise<ShareResult> => {
  return new Promise<ShareResult>((res, rej) => {
    html2canvas(source, {
      scale: 2,
      backgroundColor: 'transparent',
      height: source.scrollHeight,
    })
      .then((canvas) => {
        const href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        const downloadName = `taboo-ai-scores-${new Date().toISOString()}.png`;
        res({
          href,
          downloadName,
        });
      })
      .catch((err) => {
        rej(err);
      });
  });
};
