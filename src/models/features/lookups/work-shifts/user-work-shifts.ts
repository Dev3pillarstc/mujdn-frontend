import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { UserWorkShiftService } from '@/services/features/lookups/user-workshift.service';

export default class UserWorkShift extends BaseCrudModel<UserWorkShift, UserWorkShiftService> {
  override $$__service_name__$$: string = 'UserWorkShiftService';
  declare shiftNameAr: string;
  declare shiftNameEn: string;
  declare employeeNameAr: string;
  declare employeeNameEn: string;
  declare startDate: Date | string;
  declare endDate: Date | string;
}
