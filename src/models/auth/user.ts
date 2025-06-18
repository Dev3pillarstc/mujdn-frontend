import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { UserService } from '@/services/features/user.serice';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';
import { BaseLookupModel } from '../features/lookups/base-lookup-model';

export class User extends BaseCrudModel<User, UserService, string> {
  override $$__service_name__$$: string = 'AuthService';
  declare email?: string;
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
  declare joinDate?: string;
  declare isFingerprintExempted?: boolean;
  declare isActive?: boolean;
  declare region?: BaseLookupModel;
  declare city?: BaseLookupModel;
  declare departmentAr?: string;

  buildForm() {
    const {
      email,
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
      isFingerprintExempted,
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
      nationalId: [
        nationalId,
        [Validators.required, Validators.maxLength(14), Validators.minLength(14)],
      ],
      phoneNumber: [phoneNumber, [Validators.required]],
      fkRegionId: [fkRegionId, [Validators.required]],
      fkCityId: [fkCityId, [Validators.required]],
      fkGenderId: [fkGenderId, [Validators.required]],
      fkDepartmentId: [fkDepartmentId, [Validators.required]],
      jobTitleEn: [
        jobTitleEn,
        [Validators.required, Validators.maxLength(100), CustomValidators.pattern('ENG_NUM')],
      ],
      jobTitleAr: [
        jobTitleAr,
        [Validators.required, Validators.maxLength(100), CustomValidators.pattern('AR_NUM')],
      ],
      profilePhotoKey: [profilePhotoKey],
      joinDate: [joinDate, [Validators.required]],
      isFingerprintExempted: [isFingerprintExempted],
      isActive: [isActive ?? true],
    };
  }
}
