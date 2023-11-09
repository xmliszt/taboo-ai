export default interface IUser {
  uid?: string;
  email: string;
  name?: string;
  nickname?: string;
  photoUrl?: string;
  firstLoginAt?: string;
  lastLoginAt?: string;
  gameAttemptedCount?: number;
  gamePlayedCount?: number;
  levelPlayedCount?: number;
}
