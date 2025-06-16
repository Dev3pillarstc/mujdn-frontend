import { ModelInterceptorContract } from 'cast-response';
import { Nationality } from '@/models/features/lookups/Nationality';

export class NationalityInterceptor implements ModelInterceptorContract<Nationality> {
  receive(model: Nationality): Nationality {
    return model;
  }

  send(model: Partial<Nationality>): Partial<Nationality> {
    return model;
  }
}
