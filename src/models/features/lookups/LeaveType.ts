import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { LeaveTypeService } from '@/services/features/lookups/leave-type.service';
import { InterceptModel } from 'cast-response';
import { LeaveTypeInterceptor } from '@/model-interceptors/features/lookups/leave-type-interceptor';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';

const { send, receive } = new LeaveTypeInterceptor();

@InterceptModel({ send, receive })
export class LeaveType extends BaseCrudModel<LeaveType, LeaveTypeService> {
  override $$__service_name__$$: string = 'LeaveTypeService';
  declare nameAr: string;
  declare nameEn: string;
  // Opaque Base64 row-version; must be sent back unchanged on update
  declare concurrencyUpdateVersion: string;

  buildForm() {
    const { nameAr, nameEn } = this;
    return {
      nameAr: [
        nameAr,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ARABIC_INPUT_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('AR_NUM'),
        ],
      ],
      nameEn: [
        nameEn,
        [
          Validators.maxLength(CustomValidators.defaultLengths.ENGLISH_INPUT_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('ENG_NUM'),
        ],
      ],
    };
  }
}
