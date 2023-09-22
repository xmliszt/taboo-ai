import IUser from './types/user.type';

export class AdminManager {
  private static whitelistedUIDs = ['BnlcfMNIvrf2XCxY73O5KXmYNkI3'];

  static checkIsAdmin(user: IUser | null | undefined): boolean {
    if (user?.uid) {
      return this.whitelistedUIDs.includes(user.uid);
    }
    return false;
  }
}
