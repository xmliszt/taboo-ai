export default interface IUser {
  uid?: string;
  email: string;
  name?: string; // Name from google auth
  nickname?: string; // Player custom name
  photoUrl?: string;
  firstLoginAt?: string;
  lastLoginAt?: string;
  gameAttemptedCount?: number;
  gamePlayedCount?: number;
  levelPlayedCount?: number;
  anonymity?: boolean;
}
