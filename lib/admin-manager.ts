import { IUser } from './types/user.type';

export class AdminManager {
  static WHITELIST_UIDS = [
    '9f63e892-04f0-4f8b-b7e6-bb945f013fe8', // preview - Yuxuan
  ];

  static checkIsAdmin(user: IUser | null | undefined): boolean {
    if (user?.id) {
      return this.WHITELIST_UIDS.includes(user.id);
    }
    return false;
  }
}
