import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { NotificationChannelService } from '@/services/features/setting/notification-channel.service';
import { NotificationChannel } from '@/models/features/setting/notification-channel';
import { catchError, of, tap } from 'rxjs';

export const notificationChannelResolver: ResolveFn<NotificationChannel | null> = () => {
  const notificationChannelService = inject(NotificationChannelService);
  return notificationChannelService.get().pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
