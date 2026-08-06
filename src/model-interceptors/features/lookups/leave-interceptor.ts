import { ModelInterceptorContract } from 'cast-response';
import { Leave } from '@/models/features/lookups/leave/leave';
import { toDateOnly, toDateTime } from '@/utils/general-helper';

export class LeaveInterceptor implements ModelInterceptorContract<Leave> {
  receive(model: Leave): Leave {
    model.dateFrom = toDateTime(model.dateFrom);
    model.dateTo = toDateTime(model.dateTo);
    model.actionDate = toDateTime(model.actionDate);
    return model;
  }

  // The leaves API rejects unknown JSON properties (UnmappedMemberHandling.Disallow),
  // so send exactly the request shape and nothing else: create sends the
  // CreateLeaveRequest fields; update additionally needs id + the row-version.
  send(model: Partial<Leave>): Partial<Leave> {
    const payload: Partial<Leave> = {
      fkEmployeeId: model.fkEmployeeId,
      fkLeaveTypeId: model.fkLeaveTypeId,
      dateFrom: toDateOnly(model.dateFrom),
      dateTo: toDateOnly(model.dateTo),
    };
    if (model.id) {
      payload.id = model.id;
      payload.concurrencyUpdateVersion = model.concurrencyUpdateVersion;
    }
    return payload;
  }
}
