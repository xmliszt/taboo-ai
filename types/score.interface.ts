import { Highlight } from './chat.interface';

// {id} {word} {your question} {ai response} {completion time in seconds} {the higlights for word matches}
export interface IDisplayScore {
  id: number;
  target: string;
  question: string;
  response: string;
  difficulty: number;
  completion: number;
  responseHighlights: Highlight[];
}

export interface IScore {
  game_id: string;
  score_id: number;
  target: string;
  question: string;
  response: string;
  completion_duration: number;
}
