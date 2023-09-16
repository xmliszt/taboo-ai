export default interface ILevel {
  id: string; // Uniquely identify a level
  name: string; // Name could be the same
  difficulty: number;
  words: string[];
  isVerified: boolean;
  author?: string;
  isNew?: boolean;
  createdAt?: string;
  popularity?: number;
  authorEmail?: string;
  isAIGenerated?: boolean;
}
