export class UserFilter {
  declare id?: number;
  declare fullNameEn?: string;
  declare fullNameAr?: string;
  declare jobTitleEn?: string;
  declare jobTitleAr?: string;
  declare joinDateFrom?: Date;
  declare joinDateTo?: Date;
  declare fkDepartmentId?: number;
  declare isActive?: boolean;
  declare CanLeaveWithoutFingerPrint?: boolean;
}
