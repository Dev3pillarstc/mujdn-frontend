import { WorkShiftType } from "@/enums/work-shift-type";

export class EmployeeShiftsFilter {
  declare nameAr: string;
  declare nameEn: string;
  declare startDate: Date | string;
  declare endDate: Date | string;
  declare workShiftType: WorkShiftType;
}
