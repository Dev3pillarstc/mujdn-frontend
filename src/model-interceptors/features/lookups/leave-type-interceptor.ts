import { ModelInterceptorContract } from 'cast-response';
import { LeaveType } from '@/models/features/lookups/LeaveType';

export class LeaveTypeInterceptor implements ModelInterceptorContract<LeaveType> {
  receive(model: LeaveType): LeaveType {
    return model;
  }

  send(model: Partial<LeaveType>): Partial<LeaveType> {
    return model;
  }
}
