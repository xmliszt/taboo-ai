import { IHighlight } from './highlight.type';

// {id} {word} {your question} {ai response} {completion time in seconds} {the higlights for word matches}
export interface IScore {
  id: number;
  target: string;
  taboos: string[];
  conversation: IChat[];
  completion: number;
  aiScore?: number;
  aiExplanation?: string;
  responseHighlights: IHighlight[];
}

export interface IAIScore {
  score?: number;
  explanation?: string;
}

export interface IChat {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
}
