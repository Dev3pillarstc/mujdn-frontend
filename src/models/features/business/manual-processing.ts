import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { ManualProcessingInterceptor } from '@/model-interceptors/features/business/manual-processing.interceptor';
import { ManualProcessingService } from '@/services/features/business/manual-processing.service';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';

const { send, receive } = new ManualProcessingInterceptor();

@InterceptModel({ send, receive })
export class ManualProcessing extends BaseCrudModel<ManualProcessing, ManualProcessingService> {
  override $$__service_name__$$: string = 'ManualProcessingService';

  declare startDate?: Date | string;
  declare endDate?: Date | string;
  declare userIdsArray?: number[];
  declare departmentIds?: number[];

  buildForm() {
    const { startDate, endDate, userIdsArray } = this;
    const form = {
      startDate: [startDate, [Validators.required]],
      endDate: [endDate, [Validators.required]],
      departmentIds: [null, []],
      userIdsArray: [userIdsArray, []],
    };

    return form;
  }
}
