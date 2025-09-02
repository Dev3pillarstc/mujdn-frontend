import { ModelInterceptorContract } from 'cast-response';
import { NotificationSetting } from '@/models/features/setting/notification-setting';

export class notificationSettingInterceptor
  implements ModelInterceptorContract<NotificationSetting>
{
  receive(model: NotificationSetting): NotificationSetting {
    return model;
  }

  send(model: Partial<NotificationSetting>): Partial<NotificationSetting> {
    return model;
  }
}
