import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@/validators/custom-validators';
import { LanguageService } from '@/services/shared/language.service';
import { FactoryService } from '@/services/factory-service';
import { PresenceInquiryService } from '@/services/features/presence-inquiry.service';
import { UserProfilePresenceInquiry } from './user-profile-presence-inquiry';
import { PresenceInquiryInterceptor } from '@/model-interceptors/features/presence-inquiry.interceptor';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

const { send, receive } = new PresenceInquiryInterceptor();

@InterceptModel({ send, receive })
export class PresenceInquiry extends BaseCrudModel<PresenceInquiry, PresenceInquiryService> {
  override $$__service_name__$$: string = 'PresenceInquiryService';

  declare buffer: number;
  declare assignedUsers?: UserProfilePresenceInquiry[];
  declare assignedDate?: Date | null | string;
  declare statusId?: number;
  declare departmentId?: number;
  private languageService?: LanguageService;

  constructor() {
    super();
    this.languageService = FactoryService.getService('LanguageService');
  }

  buildForm() {
    const { buffer } = this;

    return {
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
