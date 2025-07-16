export class LoggedInUser {
  version?: string;
  isActive?: string;
  fullNameAr?: string;
  fullNameEn?: string;
  departNameAr?: string;
  departNameEn?: string;
  profilePhotoId?: string;
  isInRootDepartment?: boolean;
  isDepartmentManager?: boolean;
  roles: string[] = [];
}
