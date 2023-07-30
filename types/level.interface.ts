export default interface ILevel {
  name: string;
  difficulty: number;
  author?: string;
  new?: boolean;
  words: string[];
  createdAt?: number;
  isVerified: boolean;
  isDaily?: boolean;
  dailyLevelName?: string;
  dailyLevelTopic?: string;
}
