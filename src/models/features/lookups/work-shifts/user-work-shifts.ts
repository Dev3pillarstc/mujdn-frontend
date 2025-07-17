import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { UserWorkShiftInterceptor } from '@/model-interceptors/features/lookups/user-work-shift.interceptor';
import { UserWorkShiftService } from '@/services/features/lookups/user-workshift.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';

const { send, receive } = new UserWorkShiftInterceptor();

@InterceptModel({ send, receive })
export default class UserWorkShift extends BaseCrudModel<UserWorkShift, UserWorkShiftService> {
  override $$__service_name__$$: string = 'UserWorkShiftService';
  declare shiftNameAr: string;
  declare shiftNameEn: string;
  declare employeeNameAr: string;
  declare employeeNameEn: string;
  declare startDate: Date | string;
  declare endDate: Date | string;
  declare fkShiftId: number;
  declare fkAssignedUserId: number;


  buildForm() {
    const { fkShiftId, fkAssignedUserId, startDate, endDate } = this;
    return {
      fkShiftId: [fkShiftId, [Validators.required]],
      fkAssignedUserId: [fkAssignedUserId, [Validators.required]],
      startDate: [startDate, [Validators.required]],
      endDate: [endDate, [Validators.required]],
    }
    //, CustomValidators.startBeforeEnd('startDate', 'endDate')
  }
}
