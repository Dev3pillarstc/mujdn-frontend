import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { UserService } from '@/services/features/user.service';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';
import { BaseLookupModel } from '../features/lookups/base-lookup-model';
import { UserInterceptor } from '@/model-interceptors/auth/user.interceptor';
import { InterceptModel } from 'cast-response';

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
  declare department?: BaseLookupModel;

  buildForm() {
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
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.PASSWORD_MAX),
          Validators.minLength(CustomValidators.defaultLengths.PASSWORD_MIN),
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
      nationalId: [nationalId, [Validators.required]],
      phoneNumber: [phoneNumber, [Validators.required]],
      // fkRegionId: [fkRegionId, [Validators.required]],
      // fkCityId: [fkCityId, [Validators.required]],
      // fkGenderId: [fkGenderId, [Validators.required]],
      // fkDepartmentId: [fkDepartmentId, [Validators.required]],
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
      canLeaveWithoutFingerPrint: [canLeaveWithoutFingerPrint ?? false],
      isActive: [isActive ?? true],
    };
  }
}
