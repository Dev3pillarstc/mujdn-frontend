import { WorkDaysSetting } from '@/models/features/setting/work-days-setting';
import { ModelInterceptorContract } from 'cast-response';

export class WorkDaysSettingInterceptor implements ModelInterceptorContract<WorkDaysSetting> {
  send(model: Partial<WorkDaysSetting>): Partial<WorkDaysSetting> {
    return model;
  }

  receive(model: WorkDaysSetting): WorkDaysSetting {
    return model;
  }
}
