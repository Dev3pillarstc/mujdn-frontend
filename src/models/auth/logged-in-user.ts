export class LoggedInUser {
  version?: string;
  isActive?: string;
  fullNameAr?: string;
  fullNameEn?: string;
  profilePhotoId?: string;
  roles: string[] = [];

  isSameUser(user: any): boolean {
    // to be modified to compare with user Id
    return (
      user instanceof LoggedInUser &&
      user.fullNameAr == this.fullNameAr &&
      user.fullNameEn == this.fullNameEn
    );
  }
}
