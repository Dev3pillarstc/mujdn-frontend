import EmployeeShift from '@/models/features/lookups/work-shifts/employee-shift';
import { toDateOnly } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class MyShiftsInterceptor implements ModelInterceptorContract<EmployeeShift> {
  receive(model: EmployeeShift): EmployeeShift {
    model.startDate = toDateOnly(model.startDate);
    model.endDate = toDateOnly(model.endDate);
    return model;
  }

  send(model: Partial<EmployeeShift>): Partial<EmployeeShift> {
    return model;
  }
}
