/**
 * UserLevel type: for firestore /users/{email}/levels/{levelId} document
 */
export default interface IUserLevel {
  levelId: string;
  attempts: number;
  bestScore: number;
  lastPlayedAt: Date;
}
