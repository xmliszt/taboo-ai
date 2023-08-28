export default interface IUser {
  nickname: string;
  recovery_key: string;
  created_at: number;
  last_login_at: number;
  devices: string[];
}
