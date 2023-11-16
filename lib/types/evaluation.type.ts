import { IChat } from './score.type';

export default interface IEvaluation {
  target: string;
  taboos: string[];
  conversation: IChat[];
}
