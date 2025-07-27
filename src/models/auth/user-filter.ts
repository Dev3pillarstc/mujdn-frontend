export class UserFilter {
  declare fullNameEn?: string;
  declare fullNameAr?: string;
  declare jobTitleEn?: string;
  declare jobTitleAr?: string;
  declare joinDateFrom?: Date | string;
  declare joinDateTo?: Date | string;
  declare fkDepartmentId?: number;
  declare isActive?: boolean;
  declare CanLeaveWithoutFingerPrint?: boolean;
}
