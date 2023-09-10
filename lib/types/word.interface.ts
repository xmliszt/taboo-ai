export default interface IWord {
  target: string;
  taboos: string[];
  isVerified: boolean;
  updatedAt: string;
  creatorEmail?: string;
}
