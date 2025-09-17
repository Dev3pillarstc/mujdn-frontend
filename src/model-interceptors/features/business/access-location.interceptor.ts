import { AccessLocation } from '@/models/features/business/access-location';
import { ModelInterceptorContract } from 'cast-response';

export class AccessLocationInterceptor implements ModelInterceptorContract<AccessLocation> {
  receive(model: AccessLocation): AccessLocation {
    return model;
  }

  send(model: Partial<AccessLocation>): Partial<AccessLocation> {
    return model;
  }
}
