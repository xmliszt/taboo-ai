import { Author } from '../lib/enums/Author';
export interface Highlight {
  start: number;
  end: number;
}

export interface IHighlight {
  game_id: string;
  score_id: number;
  highlight_id: number;
  start: number;
  end: number;
}

export interface Chat {
  message: string;
  target: string;
  highlights: Highlight[];
  createdOn: number;
  byWho: Author | null;
}
