import crypto from 'crypto';
import _ from 'lodash';
import { NextApiRequest } from 'next';
import { IDisplayScore } from '../types/score.interface';

export function getIp(req: NextApiRequest): string | undefined {
  let ip: string | undefined;
  if (req.headers['x-forwarded-for']) {
    if (req.headers['x-forwarded-for'] as string[]) {
      ip = req.headers['x-forwarded-for'][0];
    } else if (req.headers['x-forwarded-for'] as string) {
      ip = (req.headers['x-forwarded-for'] as string).split(',')[0];
    }
  } else if (req.headers['x-real-ip']) {
    ip = req.socket.remoteAddress;
  } else {
    ip = req.socket.remoteAddress;
  }
  return ip;
}

export function generateHashedString(...items: string[]): string {
  const stringToHash = items.join('_');
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const truncatedHash = hash.substring(0, 8);
  return truncatedHash;
}

export function calculateScore(score: IDisplayScore): number {
  return _.round(
    score.difficulty *
      (1 / (score.completion <= 0 ? 1 : score.completion)) *
      1000,
    2
  );
}

export function getFormattedToday(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
    date
  );
  const day = ('0' + date.getDate()).slice(-2);
  return `${day}-${month}-${year}`;
}
