import UserWorkShift from '@/models/features/lookups/work-shifts/user-work-shifts';
import { toDateOnly } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';
import { WorkShiftType } from '@/enums/work-shift-type';

export class UserWorkShiftInterceptor implements ModelInterceptorContract<UserWorkShift> {
  receive(model: UserWorkShift): UserWorkShift {
    return model;
  }
  send(model: Partial<UserWorkShift>): Partial<UserWorkShift> {
    delete model.shiftNameAr;
    delete model.shiftNameEn;
    delete model.fkAssignedUserId;
    model.startDate = toDateOnly(model.startDate);
    if (model.endDate) model.endDate = toDateOnly(model.endDate);

    if (model.workShiftType !== WorkShiftType.Rotating) {
      delete model.rotationGroups;
      delete model.shiftDetails;
      delete model.shiftPeriodCount;
    }

    if (model.workShiftType !== WorkShiftType.Standard) {
      delete model.employeeWorkingDays;
    }

    // Shift / rest duration applies only to the rotation based types
    if (model.workShiftType == WorkShiftType.Standard) {
      delete model.legacyDaysCount;
    }

    if (model.workShiftType === WorkShiftType.Rotating) {
      delete model.shiftDetails;
      delete model.fkShiftId;
      model.rotationGroups?.forEach((group) => {
        delete group.shiftDetails;
        delete group.shiftDetails;
      });

      model.shiftPeriodCount = 3;
    }

    return model;
  }
}
