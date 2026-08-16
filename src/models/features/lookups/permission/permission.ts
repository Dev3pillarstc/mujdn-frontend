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
import { PERMISSION_STATUS_ENUM } from '@/enums/permission-status-enum';
import { Attachment } from '@/models/shared/attachment/attachment';
import { TemporaryUpload } from '@/models/shared/attachment/temporary-upload';

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
  declare department: BaseLookupModel;
  declare status: BaseLookupModel;
  declare permissionReason: BaseLookupModel;
  declare permissionType: BaseLookupModel;
  declare actionDate?: Date | string;
  declare canTakeAction?: boolean;
  // Files already stored against this permission; always present on read, never sent back
  attachments: Attachment[] = [];
  // Files staged for a permission that does not exist yet. The API links attachments at
  // creation time only, so this is write-once: the create payload carries their ids and the
  // edit payload never mentions them — which is why the popup drops this control when
  // editing rather than leaving a field that changes nothing.
  temporaryUploads: TemporaryUpload[] = [];
  private languageService?: LanguageService;

  constructor() {
    super();
    this.languageService = FactoryService.getService('LanguageService');
  }
  buildForm() {
    const { permissionDate, fkPermissionTypeId, fkReasonId, description, temporaryUploads } = this;
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
      // Attachments are optional on a permission — the API accepts an empty id list.
      temporaryUploads: [temporaryUploads ?? []],
    };
  }
  isAccepted(): boolean {
    return (this.fkStatusId ?? this.status?.id) === PERMISSION_STATUS_ENUM.Accepted;
  }
  getStatusName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.status?.nameEn ?? '')
      : (this.status?.nameAr ?? '');
  }
  getCreationUserName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.creationUser?.nameEn ?? '')
      : (this.creationUser?.nameAr ?? '');
  }
  getPermissionReasonName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.permissionReason?.nameEn ?? '')
      : (this.permissionReason?.nameAr ?? '');
  }
  getPermissionTypeName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.permissionType?.nameEn ?? '')
      : (this.permissionType?.nameAr ?? '');
  }
  getPermissionDepartmentName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.department?.nameEn ?? '')
      : (this.department?.nameAr ?? '');
  }
}
