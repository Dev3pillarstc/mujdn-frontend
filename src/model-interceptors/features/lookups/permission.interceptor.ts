import { Permission } from '@/models/features/lookups/permission/permission';
import { toDateTime, toDateOnly } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class PermissionInterceptor implements ModelInterceptorContract<Permission> {
  receive(model: Permission): Permission {
    model.permissionDate = toDateTime(model.permissionDate);
    model.actionDate = toDateTime(model.actionDate);

    return model;
  }

  send(model: Partial<Permission>): Partial<Permission> {
    delete model.permissionReason;
    delete model.permissionType;
    delete model.status;
    delete model.deprtment;
    delete model.creationUser;
    model.permissionDate = toDateOnly(model.permissionDate);
    return model;
  }
}
