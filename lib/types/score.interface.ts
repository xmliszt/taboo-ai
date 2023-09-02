import { IHighlight } from './highlight.interface';

// {id} {word} {your question} {ai response} {completion time in seconds} {the higlights for word matches}
export interface IDisplayScore {
  id: number;
  target: string;
  question: string;
  response: string;
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
