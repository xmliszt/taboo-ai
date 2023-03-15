export default interface IUser {
  nickname: string;
  recoveryKey: string;
  createdAt: number;
  lastLoginAt: number;
  devices: string[];
}
