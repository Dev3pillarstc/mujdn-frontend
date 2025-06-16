import { PermissionReason } from '@/models/features/lookups/permission-reason/permission-reason';
import { ModelInterceptorContract } from 'cast-response';

export class PermissionReasonInterceptor implements ModelInterceptorContract<PermissionReason> {
  receive(model: PermissionReason): PermissionReason {
    return model;
  }

  send(model: Partial<PermissionReason>): Partial<PermissionReason> {
    return model;
  }
}
