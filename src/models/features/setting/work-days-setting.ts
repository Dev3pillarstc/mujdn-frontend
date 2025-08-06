import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { WorkDaysSettingInterceptor } from '@/model-interceptors/setting/work-days-setting.interceptor';
import { NotificationSettingService } from '@/services/features/setting/notification-setting.service';
import { WorkDaysSettingService } from '@/services/features/setting/work-days-setting.service';
import { InterceptModel } from 'cast-response';

const { send, receive } = new WorkDaysSettingInterceptor();

@InterceptModel({ send, receive })
export class WorkDaysSetting extends BaseCrudModel<WorkDaysSetting, WorkDaysSettingService> {
  override $$__service_name__$$: string = 'WorkDaysSettingService';
  sunday: boolean = true;
  monday: boolean = true;
  tuesday: boolean = true;
  wednesday: boolean = true;
  thursday: boolean = true;
  friday: boolean = true;
  saturday: boolean = true;
  declare concurrencyUpdateVersion?: Uint8Array;

  buildForm() {
    const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } = this;
    const form = {
      sunday: [sunday, []],
      monday: [monday, []],
      tuesday: [tuesday, []],
      wednesday: [wednesday, []],
      thursday: [thursday, []],
      friday: [friday, []],
      saturday: [saturday, []],
    };

    return form;
  }
}
