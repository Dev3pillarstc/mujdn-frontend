import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { PermissionInterceptor } from '@/model-interceptors/features/lookups/permission.interceptor';
import { PermissionService } from '@/services/features/lookups/permission.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { Department } from '../department/department';
import { BaseLookupModel } from '../base-lookup-model';
import { LanguageService } from '@/services/shared/language.service';
import { FactoryService } from '@/services/factory-service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

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
  declare canTakeAction?: boolean;
  private languageService?: LanguageService;

  constructor() {
    super();
    this.languageService = FactoryService.getService('LanguageService');
  }
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
  getStatusName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.status.nameEn ?? '')
      : (this.status.nameAr ?? '');
  }
  getCreationUserName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.creationUser.nameEn ?? '')
      : (this.creationUser.nameAr ?? '');
  }
  getPermissionReasonName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.permissionReason.nameEn ?? '')
      : (this.permissionReason.nameAr ?? '');
  }
  getPermissionTypeName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.permissionType.nameEn ?? '')
      : (this.permissionType.nameAr ?? '');
  }
  getPermissionDepartmentName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.deprtment.nameEn ?? '')
      : (this.deprtment.nameAr ?? '');
  }
}
