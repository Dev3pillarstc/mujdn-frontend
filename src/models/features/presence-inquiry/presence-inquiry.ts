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
  declare assignedDate?: Date | string;
  declare statusId?: number;
  declare departmentId?: number;
  private languageService?: LanguageService;

  constructor() {
    super();
    this.languageService = FactoryService.getService('LanguageService');
  }

  buildForm() {
    const { messageAr, messageEn, buffer, departmentId, assignedDate } = this;

    return {
      messageAr: [
        messageAr,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ARABIC_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
        ],
      ],
      messageEn: [
        messageEn,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ENGLISH_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
        ],
      ],
      buffer: [buffer, [Validators.required, Validators.min(0)]],
      departmentId: [departmentId],
      assignedDate: [assignedDate],
    };
  }
}
