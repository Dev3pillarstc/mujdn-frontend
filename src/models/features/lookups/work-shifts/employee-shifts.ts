import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { MyShiftsService } from '@/services/features/lookups/my-shifts.service';

export default class EmployeeShifts extends BaseCrudModel<EmployeeShifts, MyShiftsService> {
  override $$__service_name__$$: string = 'MyShiftsService';
  declare id: number;
  declare nameAr?: string;
  declare nameEn?: string;
  declare timeFrom?: string;
  declare timeTo?: string;
  declare attendanceBuffer?: number;
  declare leaveBuffer?: number;
  declare employeeWorkingDays: string;
  declare startDate: Date | string;
  declare endDate: Date | string;
}
