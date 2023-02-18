import { Highlight } from './Chat.interface';

// {id} {word} {your question} {ai response} {completion time in seconds} {the higlights for word matches}
export default interface IScore {
  id: number;
  target: string;
  question: string;
  response: string;
  difficulty: number;
  completion: number;
  responseHighlights: Highlight[];
}
