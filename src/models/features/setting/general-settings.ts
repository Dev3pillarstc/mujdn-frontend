import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { GeneralSettingsInterceptor } from '@/model-interceptors/setting/general-settings.interceptor';
import { NotificationSetting } from '@/models/features/setting/notification-setting';
import { WorkDaysSetting } from '@/models/features/setting/work-days-setting';
import { GeneralSettingsService } from '@/services/features/setting/general-settings.service';
import { InterceptModel } from 'cast-response';

const { send, receive } = new GeneralSettingsInterceptor();

@InterceptModel({ send, receive })
export class GeneralSettings extends BaseCrudModel<GeneralSettings, GeneralSettingsService> {
  override $$__service_name__$$: string = 'GeneralSettingsService';

  workDays = new WorkDaysSetting();
  notificationChannels = new NotificationSetting();
  graceMonthlyMinutes = 0;
  graceDailyMaxMinutes = 0;
  monthlyPermissionLimit = 1;
}
