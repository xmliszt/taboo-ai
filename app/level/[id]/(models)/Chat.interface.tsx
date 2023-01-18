import { Author } from '../(models)/Author.enum';

export interface Highlight {
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
