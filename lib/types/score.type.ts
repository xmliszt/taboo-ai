import { IHighlight } from './highlight.type';

// {id} {word} {your question} {ai response} {completion time in seconds} {the higlights for word matches}
export interface IDisplayScore {
  id: number;
  target: string;
  taboos: string[];
  conversation: IChat[];
  difficulty: number;
  completion: number;
  ai_score?: number;
  ai_explanation?: string;
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
