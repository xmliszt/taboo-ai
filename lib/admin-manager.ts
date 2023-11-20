import IUser from './types/user.type';

export class AdminManager {
  private static whitelistedUIDs = [
    'BnlcfMNIvrf2XCxY73O5KXmYNkI3', // production
    'kWNBkcDCPjWGzsB9ez4UP7Hqv9w2', // preview
  ];

  static checkIsAdmin(user: IUser | null | undefined): boolean {
    if (user?.uid) {
      return this.whitelistedUIDs.includes(user.uid);
    }
    return false;
  }
}
