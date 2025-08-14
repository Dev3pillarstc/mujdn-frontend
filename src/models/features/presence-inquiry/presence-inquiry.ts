import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@/validators/custom-validators';
import { LanguageService } from '@/services/shared/language.service';
import { FactoryService } from '@/services/factory-service';
import { PresenceInquiryService } from '@/services/features/presence-inquiry.service';
import { UserProfilePresenceInquiry } from './user-profile-presence-inquiry';
import { PresenceInquiryInterceptor } from '@/model-interceptors/features/presence-inquiry.interceptor';

const { send, receive } = new PresenceInquiryInterceptor();

@InterceptModel({ send, receive })
export class PresenceInquiry extends BaseCrudModel<PresenceInquiry, PresenceInquiryService> {
  override $$__service_name__$$: string = 'PresenceInquiryService';

  declare messageAr: string;
  declare messageEn: string;
  declare buffer: number;
  declare assignedUsers?: UserProfilePresenceInquiry[];
  declare assignedDate?: Date | null | string;
  declare statusId?: number;
  declare departmentId?: number;

  buildForm() {
    const { messageAr, messageEn, buffer } = this;

    return {
      messageAr: [messageAr, [Validators.required, CustomValidators.pattern('AR_NUM')]],
      messageEn: [messageEn, [Validators.required, CustomValidators.pattern('ENG_NUM')]],
      buffer: [
        buffer,
        [
          Validators.required,
          Validators.min(CustomValidators.defaultLengths.INQUIRY_MIN_BUFFER),
          Validators.max(CustomValidators.defaultLengths.INQUIRY_MAX_BUFFER),
        ],
      ],
    };
  }
}
