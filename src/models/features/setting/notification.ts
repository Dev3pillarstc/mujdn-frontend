import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { NotificationInterceptor } from '@/model-interceptors/setting/notification.interceptor';
import { FactoryService } from '@/services/factory-service';
import { NotificationService } from '@/services/features/setting/notification.service';
import { LanguageService } from '@/services/shared/language.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { NotificationType } from './notificatonType';

const { send, receive } = new NotificationInterceptor();

@InterceptModel({ send, receive })
export class Notification extends BaseCrudModel<Notification, NotificationService> {
  override $$__service_name__$$: string = 'NotificationService';
  declare receiverProfileId?: number;
  declare initiatorProfileId?: number;
  declare notificationTypeId: number;
  declare creationDate: Date;
  declare contentAr: string;
  declare contentEn: string;
  declare notificationType: NotificationType;
  private languageService!: LanguageService;

  constructor() {
    super();
    this.languageService = FactoryService.getService('LanguageService');
  }
  getContent(): string {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? this.contentEn
      : this.contentAr;
  }
  getnotificationTypeTitle(): string {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? this.notificationType.englishTitle
      : this.notificationType.arabicTitle;
  }
}
