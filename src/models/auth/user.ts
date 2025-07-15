import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { UserService } from '@/services/features/user.service';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';
import { BaseLookupModel } from '../features/lookups/base-lookup-model';
import { UserInterceptor } from '@/model-interceptors/auth/user.interceptor';
import { InterceptModel } from 'cast-response';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { FactoryService } from '@/services/factory-service';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

const { send, receive } = new UserInterceptor();

@InterceptModel({ send, receive })
export class User extends BaseCrudModel<User, UserService, string> {
  override $$__service_name__$$: string = 'UserService';
  declare email?: string;
  declare password?: string;
  declare fullNameEn?: string;
  declare fullNameAr?: string;
  declare nationalId?: string;
  declare phoneNumber?: string;
  declare fkRegionId?: number;
  declare fkCityId?: number;
  declare fkGenderId?: number;
  declare fkDepartmentId?: number;
  declare jobTitleEn?: string;
  declare jobTitleAr?: string;
  declare profilePhotoKey?: string;
  declare joinDate?: Date | string;
  canLeaveWithoutFingerPrint?: boolean = false;
  isActive?: boolean = true;
  declare region?: BaseLookupModel;
  declare city?: BaseLookupModel;
  declare roleIds?: string[];
  declare department?: BaseLookupModel;
  declare concurrencyUpdateVersion?: string;
  private languageService?: LanguageService;

  constructor() {
    super();
    this.languageService = FactoryService.getService('LanguageService');
  }

  buildForm(viewMode: ViewModeEnum) {
    const {
      email,
      password,
      fullNameEn,
      fullNameAr,
      nationalId,
      phoneNumber,
      fkRegionId,
      fkCityId,
      fkGenderId,
      fkDepartmentId,
      jobTitleEn,
      jobTitleAr,
      profilePhotoKey,
      joinDate,
      canLeaveWithoutFingerPrint,
      isActive,
    } = this;

    return {
      email: [
        email,
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(CustomValidators.defaultLengths.EMAIL_MAX),
        ],
      ],
      password: [
        password,
        viewMode == ViewModeEnum.CREATE
          ? [Validators.required, CustomValidators.strongPassword()]
          : [],
      ],
      fullNameEn: [
        fullNameEn,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ENGLISH_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('ENG_NUM'),
        ],
      ],
      fullNameAr: [
        fullNameAr,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ARABIC_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('AR_NUM'),
        ],
      ],
      nationalId: [nationalId, [Validators.required, CustomValidators.pattern('NATIONAL_ID')]],
      phoneNumber: [phoneNumber, [Validators.required]],
      fkRegionId: [fkRegionId, [Validators.required]],
      fkCityId: [fkCityId],
      // fkGenderId: [fkGenderId, [Validators.required]],
      fkDepartmentId: [fkDepartmentId, [Validators.required]],
      jobTitleEn: [
        jobTitleEn,
        [Validators.required, Validators.maxLength(100), CustomValidators.pattern('ENG_NUM')],
      ],
      jobTitleAr: [
        jobTitleAr,
        [Validators.required, Validators.maxLength(100), CustomValidators.pattern('AR_NUM')],
      ],
      // profilePhotoKey: [profilePhotoKey],
      joinDate: [joinDate, [Validators.required]],
      canLeaveWithoutFingerPrint: [canLeaveWithoutFingerPrint],
      isActive: [isActive ?? true],
    };
  }

  getUserName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.fullNameEn ?? '')
      : (this.fullNameAr ?? '');
  }
  getJobTitleName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.jobTitleEn ?? '')
      : (this.jobTitleAr ?? '');
  }
}
