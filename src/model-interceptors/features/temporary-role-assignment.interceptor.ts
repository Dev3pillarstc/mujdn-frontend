import { TemporaryRoleAssignment } from '@/models/features/temporary-role-assignment/temporary-role-assignment';
import { convertUtcToSystemTimeZone, toDateTime, toDateTimeString } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class TemporaryRoleAssignmentInterceptor
  implements ModelInterceptorContract<TemporaryRoleAssignment>
{
  receive(model: TemporaryRoleAssignment): TemporaryRoleAssignment {
    model.dateFrom = model.dateFrom ? convertUtcToSystemTimeZone(toDateTime(model.dateFrom)) : null;
    model.dateTo = model.dateTo ? convertUtcToSystemTimeZone(toDateTime(model.dateTo)) : null;
    return model;
  }

  send(model: Partial<TemporaryRoleAssignment>): Partial<TemporaryRoleAssignment> {
    if (model.dateFrom) {
      model.dateFrom = toDateTimeString(model.dateFrom);
    }

    if (model.dateTo) {
      model.dateTo = toDateTimeString(model.dateTo);
    }

    if (!model.fkRoleId) {
      delete model.fkRoleId;
    }

    return model;
  }
}
