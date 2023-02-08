export default interface ILevel {
  id: string;
  name: string;
  difficulty: number;
  author?: string;
  new?: boolean;
  words: string[];
}
