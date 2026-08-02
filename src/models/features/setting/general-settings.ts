import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { GeneralSettingsInterceptor } from '@/model-interceptors/setting/general-settings.interceptor';
import { GeneralSettingsService } from '@/services/features/setting/general-settings.service';
import { InterceptModel } from 'cast-response';

export class GeneralSettingsWorkDays {
  sunday = false;
  monday = false;
  tuesday = false;
  wednesday = false;
  thursday = false;
  friday = false;
  saturday = false;
  concurrencyUpdateVersion = '';
}

export class GeneralSettingsNotificationChannels {
  isSms = false;
  isEmail = false;
  isWeb = false;
  concurrencyUpdateVersion = '';
}

const { send, receive } = new GeneralSettingsInterceptor();

@InterceptModel({ send, receive })
export class GeneralSettings extends BaseCrudModel<GeneralSettings, GeneralSettingsService> {
  override $$__service_name__$$: string = 'GeneralSettingsService';

  workDays = new GeneralSettingsWorkDays();
  notificationChannels = new GeneralSettingsNotificationChannels();
  graceMonthlyMinutes = 0;
  graceDailyMaxMinutes = 0;
  monthlyPermissionLimit = 1;
}
