import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { notificationSettingInterceptor } from '@/model-interceptors/setting/notification-setting.interceptor';
import { ManualProcessingService } from '@/services/features/business/manual-processing.service';
import { NotificationSettingService } from '@/services/features/setting/notification-setting.service';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';

const { send, receive } = new notificationSettingInterceptor();

@InterceptModel({ send, receive })
export class ManualProcessing extends BaseCrudModel<ManualProcessing, ManualProcessingService> {
  override $$__service_name__$$: string = 'ManualProcessingService';

  declare dateFrom?: Date | string;
  declare dateTo?: Date | string;
  declare userIds?: number[];

  buildForm() {
    const { dateFrom, dateTo, userIds } = this;
    const form = {
      dateFrom: [dateFrom, [Validators.required]],
      dateTo: [dateTo, [Validators.required]],
      userIds: [userIds, []],
    };

    return form;
  }
}
