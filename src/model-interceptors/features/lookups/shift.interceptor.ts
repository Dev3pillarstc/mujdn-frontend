import Shift from '@/models/features/lookups/work-shifts/shift';
import { toDateOnly, toDateTime } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class ShiftInterceptor implements ModelInterceptorContract<Shift> {
  receive(model: Shift): Shift {
    model['shiftLogStartDate'] = toDateTime(model['shiftLogStartDate']);
    model['activeShiftStartDate'] = toDateTime(model['activeShiftStartDate']);
    model.isDefaultShiftForm = model.isDefaultShift;
    return model;
  }

  send(model: Partial<Shift>): Partial<Shift> {
    delete model['isDefaultShift'];
    // delete model['shiftLogId'];
    // delete model['activeShiftStartDate'];
    delete model['isDefaultShiftForm'];
    if (model['activeShiftStartDate']) {
      model['activeShiftStartDate'] = toDateOnly(model['activeShiftStartDate']);
    }
    if (model['shiftLogStartDate']) {
      model['shiftLogStartDate'] = toDateOnly(model['shiftLogStartDate']);
    }
    return model;
  }
}
