import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { notificationSettingInterceptor } from '@/model-interceptors/setting/notification-channel.interceptor';
import { NotificationSettingService } from '@/services/features/setting/notification-channel.service';
import { InterceptModel } from 'cast-response';

const { send, receive } = new notificationSettingInterceptor();

@InterceptModel({ send, receive })
export class NotificationSetting extends BaseCrudModel<
  NotificationSetting,
  NotificationSettingService
> {
  override $$__service_name__$$: string = 'NotificationSettingService';

  isSms: boolean = true;
  isMobile: boolean = true;
  isWeb: boolean = true;

  buildForm() {
    const { isSms, isMobile, isWeb } = this;
    const form = {
      isSms: [isSms, []],
      isMobile: [isMobile, []],
      isWeb: [isWeb, []],
    };

    return form;
  }
}
