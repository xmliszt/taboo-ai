import { IScore } from './score.type';

export default interface IGame {
  id: string;
  levelId: string;
  finishedAt: Date;
  totalScore: number;
  totalDuration: number;
  difficulty: number;
  scores: IScore[];
  isCustomGame?: boolean;
}
