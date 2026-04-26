import { TemporaryRoleAssignment } from '@/models/features/temporary-role-assignment/temporary-role-assignment';
import { toDateOnly, toDateTime } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class TemporaryRoleAssignmentInterceptor
  implements ModelInterceptorContract<TemporaryRoleAssignment>
{
  receive(model: TemporaryRoleAssignment): TemporaryRoleAssignment {
    model.dateFrom = toDateTime(model.dateFrom);
    model.dateTo = toDateTime(model.dateTo);
    return model;
  }

  send(model: Partial<TemporaryRoleAssignment>): Partial<TemporaryRoleAssignment> {
    if (model.dateFrom) {
      model.dateFrom = toDateTime(model.dateFrom);
    }

    if (model.dateTo) {
      model.dateTo = toDateTime(model.dateTo);
    }

    if (!model.fkRoleId) {
      delete model.fkRoleId;
    }

    return model;
  }
}
