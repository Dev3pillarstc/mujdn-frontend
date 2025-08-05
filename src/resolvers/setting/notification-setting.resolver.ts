import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { NotificationSettingService } from '@/services/features/setting/notification-setting.service';
import { NotificationSetting } from '@/models/features/setting/notification-setting';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { WorkDaysSettingService } from '@/services/features/setting/work-days-setting.service';

export const notificationSettingResolver: ResolveFn<any> = () => {
  const notificationSettingService = inject(NotificationSettingService);
  const workDaysSettingService = inject(WorkDaysSettingService);

  return forkJoin({
    notificationSetting: notificationSettingService.get(),
    workDays: workDaysSettingService.getWorkDays()
  }).pipe(
    catchError((error) => {
      return of({ notificationSetting: null, workDays: null });
    })
  );
};
