import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { PermissionInterceptor } from '@/model-interceptors/features/lookups/permission.interceptor';
import { PermissionService } from '@/services/features/lookups/permission.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { Department } from '../department/department';
import { BaseLookupModel } from '../base-lookup-model';

const { send, receive } = new PermissionInterceptor();

@InterceptModel({ send, receive })
export class Permission extends BaseCrudModel<Permission, PermissionService> {
  override $$__service_name__$$: string = 'PermissionService';
  declare permissionDate?: Date | string;
  declare fkStatusId: number;
  declare fkReasonId: number;
  declare fkDepartmentId: number;
  declare fkPermissionTypeId: number;
  declare creationUserId: number;
  declare description: string;
  declare creationUser: BaseLookupModel;
  declare deprtment: BaseLookupModel;
  declare status: BaseLookupModel;
  declare permissionReason: BaseLookupModel;
  declare permissionType: BaseLookupModel;
  declare actionDate?: Date | string;

  buildForm() {
    const { permissionDate, fkPermissionTypeId, fkReasonId, description } = this;
    return {
      fkPermissionTypeId: [fkPermissionTypeId, [Validators.required]],
      fkReasonId: [fkReasonId, [Validators.required]],
      permissionDate: [permissionDate, [Validators.required]],
      description: [
        description,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ENGLISH_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
        ],
      ],
    };
  }
}
