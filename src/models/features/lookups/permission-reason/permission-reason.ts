import { InterceptModel } from 'cast-response';
import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { PermissionReasonService } from '@/services/features/lookups/permission-reason.service';
import { PermissionReasonInterceptor } from '@/model-interceptors/features/lookups/permission-reason.interceptor';

const { send, receive } = new PermissionReasonInterceptor();

@InterceptModel({ send, receive })

export class PermissionReason extends BaseCrudModel<PermissionReason, PermissionReasonService> {
  override $$__service_name__$$: string = 'PermissionReasonService';
  declare nameAr: string;
  declare nameEn: string;
  declare isActive: boolean;

  getName() {
    return this.nameEn;
  }
}