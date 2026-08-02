import {
  GeneralSettings,
  GeneralSettingsNotificationChannels,
  GeneralSettingsWorkDays,
} from '@/models/features/setting/general-settings';
import { ModelInterceptorContract } from 'cast-response';

export class GeneralSettingsInterceptor implements ModelInterceptorContract<GeneralSettings> {
  receive(model: GeneralSettings): GeneralSettings {
    return Object.assign(new GeneralSettings(), model, {
      workDays: Object.assign(new GeneralSettingsWorkDays(), model.workDays),
      notificationChannels: Object.assign(
        new GeneralSettingsNotificationChannels(),
        model.notificationChannels
      ),
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
      },
      notificationChannels: {
        isSms: notificationChannels.isSms,
        isEmail: notificationChannels.isEmail,
        isWeb: notificationChannels.isWeb,
        concurrencyUpdateVersion: notificationChannels.concurrencyUpdateVersion,
      },
      graceMonthlyMinutes: model.graceMonthlyMinutes,
      graceDailyMaxMinutes: model.graceDailyMaxMinutes,
      monthlyPermissionLimit: model.monthlyPermissionLimit,
    };
  }
}
