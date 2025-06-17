import { InterceptModel } from 'cast-response';
import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { PermissionReasonService } from '@/services/features/lookups/permission-reason.service';
import { PermissionReasonInterceptor } from '@/model-interceptors/features/lookups/permission-reason.interceptor';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';

const { send, receive } = new PermissionReasonInterceptor();

@InterceptModel({ send, receive })

export class PermissionReason extends BaseCrudModel<PermissionReason, PermissionReasonService> {
  override $$__service_name__$$: string = 'PermissionReasonService';
  declare nameAr: string;
  declare nameEn: string;
   isActive: boolean = true;

   buildForm() {
     const { nameAr, nameEn, isActive } = this;
     const form = {
       nameAr: [
         nameAr,
         [
           Validators.required,
           Validators.maxLength(CustomValidators.defaultLengths.ARABIC_NAME_MAX),
           Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
           CustomValidators.pattern('AR_NUM'),
        ],
      ],
      nameEn: [
        nameEn,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ENGLISH_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('ENG_NUM'),
        ],
      ],
      isActive: [isActive, []],
    };

    return form;
  }

}