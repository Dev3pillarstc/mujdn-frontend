import EmployeeShifts from '@/models/features/lookups/work-shifts/employee-shifts';
import { toDateOnly } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class MyShiftsInterceptor implements ModelInterceptorContract<EmployeeShifts> {
  receive(model: EmployeeShifts): EmployeeShifts {
    model.startDate = toDateOnly(model.startDate);
    model.endDate = toDateOnly(model.endDate);
    return model;
  }

  send(model: Partial<EmployeeShifts>): Partial<EmployeeShifts> {
    return model;
  }
}
