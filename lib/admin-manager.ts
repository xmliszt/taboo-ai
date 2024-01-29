export class AdminManager {
  static WHITELIST_UIDS = [
    '9f63e892-04f0-4f8b-b7e6-bb945f013fe8', // preview - Yuxuan
  ];

  static checkIsAdmin(userId?: string): boolean {
    if (userId) return this.WHITELIST_UIDS.includes(userId);
    return false;
  }
}
