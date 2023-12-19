import IUser from './types/user.type';

export class AdminManager {
  static WHITELIST_UIDS = [
    'BnlcfMNIvrf2XCxY73O5KXmYNkI3', // production
    'aynNbQcI5rV2UxXVaRRW34K3eaH2', // preview
  ];

  static checkIsAdmin(user: IUser | null | undefined): boolean {
    console.log(user);
    if (user?.uid) {
      return this.WHITELIST_UIDS.includes(user.uid);
    }
    return false;
  }
}
