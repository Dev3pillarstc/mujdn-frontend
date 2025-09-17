import { ModelInterceptorContract } from 'cast-response';
import { ManualProcessing } from '@/models/features/business/manual-processing';
import { toDateOnly } from '@/utils/general-helper';

export class ManualProcessingInterceptor implements ModelInterceptorContract<ManualProcessing> {
  receive(model: ManualProcessing): ManualProcessing {
    return model;
  }

  send(model: Partial<ManualProcessing>): Partial<ManualProcessing> {
    model.dateFrom = toDateOnly(model.dateFrom);
    model.dateTo = toDateOnly(model.dateTo);
    return model;
  }
}
