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

    if (model.workShiftType === WorkShiftType.Rotating) {
      // to be deleted from here
      model.rotationGroups?.forEach((group) => {
        group.shiftDetails.nameAr = '';
        group.shiftDetails.nameEn = '';
      });
      // to be deleted to here

      model.shiftPeriodCount = 3;
    }

return model;
  }
}
