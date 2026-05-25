export default class UserWorkShiftsFilter {
  declare nameAr: string;
  declare nameEn: string;
  fkAssignedUserId: number | null = null;
  fkDepartmentId: number | null = null;
  declare startDate: any;
  declare endDate: any;
  declare workShiftType: number;
}
