import { ModelInterceptorContract } from 'cast-response';
import EmployeeShiftDay from '@/models/features/lookups/work-shifts/employee-shift-day';

export class EmployeeShiftDayInterceptor implements ModelInterceptorContract<EmployeeShiftDay> {
  receive(model: EmployeeShiftDay): EmployeeShiftDay {
    return model;
  }

  send(model: Partial<EmployeeShiftDay>): Partial<EmployeeShiftDay> {
    return model;
  }
}
