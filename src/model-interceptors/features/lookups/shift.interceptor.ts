import Shift from '@/models/features/lookups/work-shifts/shift';
import {
  convertUtcToSystemTimeZone,
  dateToTimeString,
  timeStringToDate,
  toDateOnly,
  toDateTime,
  toLocalTime,
} from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class ShiftInterceptor implements ModelInterceptorContract<Shift> {
  receive(model: Shift): Shift {
    model.shiftLogStartDate = toDateTime(model.shiftLogStartDate);
    model.activeShiftStartDate = toDateTime(model.activeShiftStartDate);
    model.isDefaultShiftForm = model.isDefaultShift;
    model.timeFrom = dateToTimeString(
      convertUtcToSystemTimeZone(timeStringToDate(model.timeFrom as string))
    ) as string;
    model.timeTo = dateToTimeString(
      convertUtcToSystemTimeZone(timeStringToDate(model.timeTo as string))
    ) as string;
    return model;
  }

  send(model: Partial<Shift>): Partial<Shift> {
    delete model.isDefaultShift;
    delete model.isDefaultShiftForm;
    if (model.activeShiftStartDate) {
      model.activeShiftStartDate = toDateOnly(model.activeShiftStartDate);
    }
    if (model.shiftLogStartDate) {
      model.shiftLogStartDate = toDateOnly(model.shiftLogStartDate);
    }
    return model;
  }
}
