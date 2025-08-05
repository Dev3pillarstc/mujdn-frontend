import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { NotificationSettingService } from '@/services/features/setting/notification-channel.service';
import { NotificationSetting } from '@/models/features/setting/notification-setting';
import { catchError, of, tap } from 'rxjs';

export const notificationSettingResolver: ResolveFn<NotificationSetting | null> = () => {
  const notificationSettingService = inject(NotificationSettingService);
  return notificationSettingService.get().pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
