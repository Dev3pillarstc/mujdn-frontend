import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { notificationSettingInterceptor } from '@/model-interceptors/setting/notification-setting.interceptor';
import { NotificationSettingService } from '@/services/features/setting/notification-setting.service';
import { InterceptModel } from 'cast-response';

const { send, receive } = new notificationSettingInterceptor();

@InterceptModel({ send, receive })
export class NotificationSetting extends BaseCrudModel<
  NotificationSetting,
  NotificationSettingService
> {
  override $$__service_name__$$: string = 'NotificationSettingService';

  isSms: boolean = true;
  isEmail: boolean = true;
  isWeb: boolean = true;

  buildForm() {
    const { isSms, isEmail, isWeb } = this;
    const form = {
      isSms: [isSms, []],
      isEmail: [isEmail, []],
      isWeb: [isWeb, []],
    };

    return form;
  }
}
