import IUser from './types/user.type';

export class AdminManager {
  static WHITELIST_UIDS = [
    'BnlcfMNIvrf2XCxY73O5KXmYNkI3', // production - Yuxuan
    'aynNbQcI5rV2UxXVaRRW34K3eaH2', // preview - Yuxuan
    'xAlLvLRvY7NHtRr5GkL6TxIV0Vu1', // production - Austin
    'd57nt5xyZhX4S4f1sOFlo5WbAlX2', // preview - Austin
  ];

  static checkIsAdmin(user: IUser | null | undefined): boolean {
    if (user?.uid) {
      return this.WHITELIST_UIDS.includes(user.uid);
    }
    return false;
  }
}
