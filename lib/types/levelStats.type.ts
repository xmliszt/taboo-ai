export default interface ILevelStats {
  bestPerformingLevel:
    | {
        id: string;
        name: string;
        difficulty: number;
        score: number;
      }
    | undefined;
  mostFrequentlyPlayedLevel:
    | {
        id: string;
        name: string;
        difficulty: number;
        attempts: number;
      }
    | undefined;
}
