import { Holiday } from '@/models/features/lookups/holiday/holiday';
import { toDateOnly, toDateTime } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class HolidayInterceptor implements ModelInterceptorContract<Holiday> {
  receive(model: Holiday): Holiday {
    model.endDate = toDateTime(model.endDate);
    model.startDate = toDateTime(model.startDate);
    return model;
  }
  send(model: Partial<Holiday>): Partial<Holiday> {
    model.endDate = toDateOnly(model.endDate);
    model.startDate = toDateOnly(model.startDate);

    return model;
  }
}
