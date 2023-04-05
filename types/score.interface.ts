import { Highlight } from './chat.interface';

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
  responseHighlights: Highlight[];
}

export interface IScore {
  game_id: string;
  score_id: number;
  target: string;
  question: string;
  response: string;
  ai_score: number;
  ai_explanation: string;
  completion_duration: number;
}

export interface IAIScore {
  score?: number;
  explanation?: string;
}
