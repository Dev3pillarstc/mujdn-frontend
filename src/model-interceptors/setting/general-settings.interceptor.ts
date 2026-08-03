import { GeneralSettings } from '@/models/features/setting/general-settings';
import { NotificationSetting } from '@/models/features/setting/notification-setting';
import { WorkDaysSetting } from '@/models/features/setting/work-days-setting';
import { ModelInterceptorContract } from 'cast-response';

export class GeneralSettingsInterceptor implements ModelInterceptorContract<GeneralSettings> {
  receive(model: GeneralSettings): GeneralSettings {
    return Object.assign(new GeneralSettings(), model, {
      workDays: Object.assign(new WorkDaysSetting(), model.workDays),
      notificationChannels: Object.assign(new NotificationSetting(), model.notificationChannels),
    });
  }

  send(model: Partial<GeneralSettings>): Partial<GeneralSettings> {
    if (!model.workDays || !model.notificationChannels) {
      return model;
    }

    const { workDays, notificationChannels } = model;
    return {
      workDays: {
        sunday: workDays.sunday,
        monday: workDays.monday,
        tuesday: workDays.tuesday,
        wednesday: workDays.wednesday,
        thursday: workDays.thursday,
        friday: workDays.friday,
        saturday: workDays.saturday,
        concurrencyUpdateVersion: workDays.concurrencyUpdateVersion,
      } as WorkDaysSetting,
      notificationChannels: {
        isSms: notificationChannels.isSms,
        isEmail: notificationChannels.isEmail,
        isWeb: notificationChannels.isWeb,
        concurrencyUpdateVersion: notificationChannels.concurrencyUpdateVersion,
      } as NotificationSetting,
      graceMonthlyMinutes: model.graceMonthlyMinutes,
      graceDailyMaxMinutes: model.graceDailyMaxMinutes,
      monthlyPermissionLimit: model.monthlyPermissionLimit,
    };
  }
}
