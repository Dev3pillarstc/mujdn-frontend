import { ModelInterceptorContract } from 'cast-response';
import { ManualProcessing } from '@/models/features/business/manual-processing';
import { toDateOnly } from '@/utils/general-helper';

export class ManualProcessingInterceptor implements ModelInterceptorContract<ManualProcessing> {
  receive(model: ManualProcessing): ManualProcessing {
    return model;
  }

  send(model: Partial<ManualProcessing>): Partial<ManualProcessing> {
    model.startDate = toDateOnly(model.startDate);
    model.endDate = toDateOnly(model.endDate);
    delete model.departmentIds;
    // convert userIds array into comma separated
    return model;
  }
}
