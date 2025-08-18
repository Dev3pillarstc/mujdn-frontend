import EmployeeShift from '@/models/features/lookups/work-shifts/employee-shift';
import { formatTimeTo12Hour, toDateOnly } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class MyShiftsInterceptor implements ModelInterceptorContract<EmployeeShift> {
  receive(model: EmployeeShift): EmployeeShift {
    model.startDate = toDateOnly(model.startDate);
    model.endDate = toDateOnly(model.endDate);
    model.timeFrom = formatTimeTo12Hour(model.timeFrom as string);
    model.timeTo = formatTimeTo12Hour(model.timeTo as string);
    return model;
  }

  send(model: Partial<EmployeeShift>): Partial<EmployeeShift> {
    return model;
  }
}
