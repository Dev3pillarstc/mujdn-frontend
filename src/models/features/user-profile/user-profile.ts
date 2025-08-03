import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { UserService } from '@/services/features/user.service';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';
import { InterceptModel } from 'cast-response';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { BaseLookupModel } from '../lookups/base-lookup-model';
import { UserProfileService } from '@/services/features/user-profile.service';
import { UserProfileInterceptor } from '@/model-interceptors/features/user-profile.interceptor';

const { send, receive } = new UserProfileInterceptor();

@InterceptModel({ send, receive })
export class UserProfile extends BaseCrudModel<UserProfile, UserProfileService, string> {
  override $$__service_name__$$: string = 'UserProfileService';
  declare fullName?: BaseLookupModel;
  declare department?: BaseLookupModel;
  declare region?: BaseLookupModel;
  declare city?: BaseLookupModel;
  declare jobTitle?: BaseLookupModel;
  declare phoneNumber?: string;
  declare isActive?: boolean;
  declare email?: string;
  declare joinDate?: Date | string;
  declare nationalId?: string;
  declare roleKeys?: string[];

  buildForm(viewMode: ViewModeEnum) {
    const { email, phoneNumber } = this;

    return {
      email: [
        email,
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(CustomValidators.defaultLengths.EMAIL_MAX),
        ],
      ],
      phoneNumber: [
        phoneNumber,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.PHONE_NUMBER_MAX),
          CustomValidators.pattern('PHONE_NUMBER'),
        ],
      ],
    };
  }
}
