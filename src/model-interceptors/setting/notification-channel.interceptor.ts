
import { ModelInterceptorContract } from 'cast-response';
import { NotificationChannel } from '@/models/features/setting/notification-channel';

export class notificationChannelInterceptor implements ModelInterceptorContract<NotificationChannel> {
  receive(model: NotificationChannel): NotificationChannel {
    return model;
  }

  send(model: Partial<NotificationChannel>): Partial<NotificationChannel> {
    return model;
  }
}