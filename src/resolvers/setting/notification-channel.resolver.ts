import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { NotificationChannelService } from '@/services/features/setting/notification-channel.service';
import { NotificationChannel } from '@/models/features/setting/notification-channel';
import { tap } from 'rxjs';

export const notificationChannelResolver: ResolveFn<NotificationChannel> = () => {
  const notificationChannelService = inject(NotificationChannelService);
  return notificationChannelService.get();
};
