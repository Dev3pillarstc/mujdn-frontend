import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { UserWorkShiftInterceptor } from '@/model-interceptors/features/lookups/user-work-shift.interceptor';
import { SingleResponseData } from '@/models/shared/response/single-response-data';
import { UserWorkShiftService } from '@/services/features/lookups/user-workshift.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { map, Observable } from 'rxjs';

const { send, receive } = new UserWorkShiftInterceptor();

@InterceptModel({ send, receive })
export default class UserWorkShift extends BaseCrudModel<UserWorkShift, UserWorkShiftService> {
  override $$__service_name__$$: string = 'UserWorkShiftService';

  declare id: number;
  declare shiftNameAr: string;
  declare shiftNameEn: string;
  declare employeeNameAr: string;
  declare employeeNameEn: string;
  declare startDate: Date | string;
  declare endDate: Date | string;
  declare fkShiftId: number;
  declare fkAssignedUserId: number;
  declare employeeWorkingDays: string;
  declare assignedUserIds: number[];
  declare workShiftType: number;
  declare presenceInquiryTime: string;
  declare presenceInquiryBuffer: number;

  declare concurrencyUpdateVersion?: Uint8Array;

  constructor(init?: Partial<UserWorkShift>) {
    super();
    Object.assign(this, init);
  }

  buildForm() {
    const {
      fkShiftId,
      fkAssignedUserId,
      startDate,
      endDate,
      employeeWorkingDays,
      workShiftType,
      presenceInquiryTime,
    } = this;
    return {
      fkShiftId: [fkShiftId, [Validators.required]],
      fkAssignedUserId: [fkAssignedUserId, []], // Made optional here as we might use assignedUserIds
      startDate: [startDate, [Validators.required]],
      endDate: [endDate, []],
      employeeWorkingDays: [employeeWorkingDays || ''],
      workShiftType: [workShiftType || WorkShiftType.Standard, [Validators.required]],
      presenceInquiryTime: [presenceInquiryTime, []],
    };
  }
}

export enum WorkShiftType {
  Standard = 1,
  WeekOnWeekOff = 2,
  WeekOnWeekOff24 = 3,
}
